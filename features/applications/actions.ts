"use server";

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

import { validateField, normalizeContactNumber } from './validation';

export async function submitApplication(formData: FormData) {
  const supabase = await createClient();

  // 1. Extract raw data from FormData
  const jobIdRef = formData.get('jobId') as string;

  // 2. Resolve the job data first to check requirements (job_type)
  console.log(`[Submission] Resolving jobId: ${jobIdRef}`);
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .select('id, job_type')
    .eq('job_reference_code', jobIdRef)
    .single();

  if (jobError || !jobData) {
    console.error(`[Submission] Job resolution error for ${jobIdRef}:`, jobError);
    throw new Error('Invalid Job ID specified');
  }
  
  console.log(`[Submission] Found internal Job ID: ${jobData.id} (${jobData.job_type})`);
  
  const internalJobId = jobData.id;
  const isTechnical = jobData.job_type === "technical";

  // 2. Extract and Validate
  const fullName = (formData.get('fullName') as string || "").trim();
  const email = (formData.get('email') as string || "").trim().toLowerCase();
  const contactNumber = normalizeContactNumber(formData.get('contactNumber') as string || "");
  const linkedin = (formData.get('linkedIn') as string || "").trim();
  const github = (formData.get('github') as string || "").trim();
  const motivation = (formData.get('motivation') as string || "").trim();
  const resumeFile = formData.get('resume') as File | null;
  const coverLetterFile = formData.get('coverLetter') as File | null;

  const errors: string[] = [];
  
  const nameErr = validateField('fullName', fullName, isTechnical);
  if (nameErr) errors.push(`Full Name: ${nameErr}`);
  
  const emailErr = validateField('email', email, isTechnical);
  if (emailErr) errors.push(`Email: ${emailErr}`);
  
  const phoneErr = validateField('contactNumber', contactNumber, isTechnical);
  if (phoneErr) errors.push(`Contact: ${phoneErr}`);
  
  const linkErr = validateField('linkedIn', linkedin, isTechnical);
  if (linkErr) errors.push(`LinkedIn: ${linkErr}`);
  
  const gitErr = validateField('github', github, isTechnical);
  if (gitErr) errors.push(`GitHub: ${gitErr}`);
  
  const motErr = validateField('coverLetter', motivation, isTechnical);
  if (motErr) errors.push(`Motivation: ${motErr}`);

  // File Validations (Strict Backend Enforcement)
  if (!resumeFile || resumeFile.size === 0) {
    errors.push("Resume: Resume is required");
  } else if (resumeFile.size > 2 * 1024 * 1024) {
    errors.push(`Resume: File size (${(resumeFile.size / 1024 / 1024).toFixed(2)}MB) exceeds 2MB limit`);
  } else if (resumeFile.type !== 'application/pdf') {
    errors.push("Resume: Only PDF files are allowed");
  }

  if (coverLetterFile && coverLetterFile.size > 0) {
    if (coverLetterFile.size > 2 * 1024 * 1024) {
      errors.push(`Cover Letter: File size (${(coverLetterFile.size / 1024 / 1024).toFixed(2)}MB) exceeds 2MB limit`);
    }
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(coverLetterFile.type)) {
      errors.push("Cover Letter: Must be PDF, DOC, or DOCX");
    }
  }

  if (errors.length > 0) {
    console.error("[Submission] Validation failed:", errors);
    throw new Error(errors[0]); // Return the first error for simplicity in UI
  }

  // 3. Handle File Uploads (Resumes & Cover Letters)
  // NOTE: You must create a public bucket named 'applications' in Supabase Storage for this to work.
  let resumeUrl = 'pending_upload';
  let coverLetterUrl = null;

  const adminClient = createAdminClient();

  try {
    // Generate a unique file name
    const timestamp = Date.now();
    
    // Type guard for TypeScript narrowing
    if (!resumeFile) throw new Error("Resume file is required");
    
    const resumePath = `resumes/${timestamp}_${resumeFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    console.log(`[Submission] Uploading resume: ${resumePath}`);
    // Upload Resume
    const { data: resumeUpload, error: resumeError } = await adminClient.storage
      .from('resume_and_cover_letter')
      .upload(resumePath, resumeFile);

    if (resumeError) {
      console.error("[Submission] Resume upload failed:", resumeError);
      throw new Error(`Resume upload failed: ${resumeError.message}`);
    }
    console.log("[Submission] Resume uploaded successfully");

    if (resumeUpload) {
      const { data: publicUrlData } = adminClient.storage.from('resume_and_cover_letter').getPublicUrl(resumePath);
      resumeUrl = publicUrlData.publicUrl;
    }

    // Upload Cover Letter (Optional)
    if (coverLetterFile && coverLetterFile.size > 0) {
      const coverPath = `cover_letters/${timestamp}_${coverLetterFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { data: coverUpload, error: coverError } = await adminClient.storage
        .from('resume_and_cover_letter')
        .upload(coverPath, coverLetterFile);
        
      if (coverError) {
        console.error("Cover letter upload failed:", coverError);
        // We don't necessarily want to fail the whole application if the optional cover letter fails,
        // but it's better to be safe and let the user know.
        throw new Error(`Cover letter upload failed: ${coverError.message}`);
      }

      if (coverUpload) {
        const { data: publicUrlData } = adminClient.storage.from('resume_and_cover_letter').getPublicUrl(coverPath);
        coverLetterUrl = publicUrlData.publicUrl;
      }
    }
  } catch (error: any) {
    console.error("Storage upload failed:", error);
    throw new Error(error.message || "Failed to upload documents");
  }

  // 4. Candidate Management (Optimized: Only update if fields changed)
  // adminClient is already created above
  let candidateId: number;

  const { data: existingCandidate } = await adminClient
    .from('candidates')
    .select('id, full_name, contact_number, linkedin, github')
    .eq('email', email)
    .maybeSingle();

  if (existingCandidate) {
    candidateId = existingCandidate.id;
    
    // Prepare update payload - ONLY update optional fields if they are provided (non-empty)
    // This preserves existing LinkedIn/GitHub links if the candidate leaves them blank in subsequent applications
    const updatePayload: any = {
      full_name: fullName,
      contact_number: contactNumber,
    };

    if (linkedin) updatePayload.linkedin = linkedin;
    if (github) updatePayload.github = github;

    // Check if any of the provided fields actually differ from what's in the database
    const hasChanged = Object.keys(updatePayload).some(key => {
      const existingValue = (existingCandidate as any)[key] || null;
      const newValue = updatePayload[key] || null;
      return existingValue !== newValue;
    });

    if (hasChanged) {
      console.log(`[Submission] Updating candidate details for: ${email}`);
      const { error: updateError } = await adminClient
        .from('candidates')
        .update(updatePayload)
        .eq('id', candidateId);

      if (updateError) {
        console.error('Candidate update error:', updateError);
        throw new Error('Failed to update candidate information');
      }
    } else {
      console.log(`[Submission] Candidate details unchanged for: ${email}. Skipping DB update.`);
    }
  } else {
    // New candidate: Insert fresh record
    console.log(`[Submission] Creating new candidate record for: ${email}`);
    const { data: newCandidate, error: insertError } = await adminClient
      .from('candidates')
      .insert([{
        full_name: fullName,
        email: email,
        contact_number: contactNumber,
        linkedin: linkedin || null,
        github: github || null,
      }])
      .select('id')
      .single();

    if (insertError || !newCandidate) {
      console.error('Candidate insertion error:', insertError);
      throw new Error('Failed to register candidate');
    }
    candidateId = newCandidate.id;
  }

  // 5. Insert Application Data (Always add a new record, allowing multiple applications)
  const { error: applicationError } = await adminClient
    .from('applications')
    .insert([
      {
        job_id: internalJobId,
        candidate_id: candidateId,
        motivation: motivation,
        resume_url: resumeUrl,
        cover_letter_url: coverLetterUrl,
        status: 'applied'
      }
    ]);

  if (applicationError) {
    console.error('Application insertion error:', applicationError);
    throw new Error('Failed to submit application. If you have already applied, our system may still be processing your previous submission.');
  }

  return { success: true };
}
