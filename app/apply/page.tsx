"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ThankYou from "@/features/applications/components/ThankYou";

import { getJobs, UIJob } from "@/features/jobs/queries";
import { notFound } from "next/navigation";
import { submitApplication } from "@/features/applications/actions";

import { validateField } from "@/features/applications/validation";
import PrivacyPolicy from "@/app/legal/PrivacyPolicy";
import TermsOfService from "@/app/legal/TermsOfService";

export default function ApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<UIJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    linkedIn: "",
    github: "",
    coverLetter: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [files, setFiles] = useState<{ resume: File | null; coverLetter: File | null }>({
    resume: null,
    coverLetter: null,
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modal, setModal] = useState<null | 'privacy' | 'terms'>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      router.push("/");
      return;
    }

    const fetchJob = async () => {
      try {
        const jobsArray = await getJobs();
        const foundJob = jobsArray.find((j) => j.id === jobId);

        if (foundJob) {
          setJob(foundJob);
        } else {
          setIsNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation for URL fields
    if (name === 'linkedIn' || name === 'github') {
      const isTechnical = job?.jobType === "technical";
      const error = validateField(name, value, isTechnical);
      setErrors(prev => ({ ...prev, [name]: error }));
    } else if (errors[name]) {
      // Clear error for other fields as user types
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isTechnical = job?.jobType === "technical";
    const error = validateField(name, value, isTechnical);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "coverLetter") => {
    const file = e.target.files?.[0] || null;
    const MAX_SIZE = 2 * 1024 * 1024; // Strict 2MB limit

    if (file && file.size > MAX_SIZE) {
      setErrors(prev => ({ ...prev, [type === "resume" ? "resume" : "coverLetterFile"]: `File size exceeds 2MB limit.` }));
      e.target.value = "";
      setFiles((prev) => ({ ...prev, [type]: null }));
      return;
    }

    // Check PDF for resume
    if (type === "resume" && file && file.type !== "application/pdf") {
      setErrors(prev => ({ ...prev, [type]: "Only PDF files are allowed for resume." }));
      e.target.value = "";
      setFiles((prev) => ({ ...prev, [type]: null }));
      return;
    }

    setErrors(prev => ({ ...prev, [type === "resume" ? "resume" : "coverLetterFile"]: null }));
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isTechnical = job?.jobType === "technical";

    // Final Validation Check
    const newErrors: { [key: string]: string | null } = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key], isTechnical);
      if (error) newErrors[key] = error;
    });

    if (!files.resume) newErrors.resume = "Resume is required";
    if (!agreed) newErrors.agreed = "You must agree to the Privacy Policy and Terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('jobId', jobId as string);
      formDataObj.append('fullName', formData.fullName.trim());
      formDataObj.append('email', formData.email.trim().toLowerCase());
      formDataObj.append('contactNumber', formData.contactNumber.trim());
      if (formData.linkedIn) formDataObj.append('linkedIn', formData.linkedIn.trim());
      if (formData.github) formDataObj.append('github', formData.github.trim());
      formDataObj.append('motivation', formData.coverLetter.trim());
      formDataObj.append('resume', files.resume!);
      if (files.coverLetter) formDataObj.append('coverLetter', files.coverLetter);

      await submitApplication(formDataObj);

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submission error detail:", error);
      
      const msg = error?.message || "An unexpected network error occurred.";
      let targetField: string | null = null;
      let cleanMessage = msg;

      // Parse server-side error prefixes to target specific fields (more robust with .includes)
      if (msg.includes("Full Name:")) { targetField = "fullName"; cleanMessage = msg.replace("Full Name:", "").trim(); }
      else if (msg.includes("Email:")) { targetField = "email"; cleanMessage = msg.replace("Email:", "").trim(); }
      else if (msg.includes("Contact:")) { targetField = "contactNumber"; cleanMessage = msg.replace("Contact:", "").trim(); }
      else if (msg.includes("LinkedIn")) { targetField = "linkedIn"; }
      else if (msg.includes("GitHub")) { targetField = "github"; }
      else if (msg.includes("Motivation:")) { targetField = "coverLetter"; cleanMessage = msg.replace("Motivation:", "").trim(); }
      else if (msg.includes("Resume")) { targetField = "resume"; }

      // Clean up any potential quotes from the message
      cleanMessage = cleanMessage.replace(/^["']|["']$/g, "");

      if (targetField) {
        setErrors(prev => ({ ...prev, [targetField!]: cleanMessage }));
        // Focus the field after a tiny delay to ensure state has updated
        setTimeout(() => {
          const element = document.getElementsByName(targetField!)[0] as HTMLElement;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 10);
      } else {
        // More descriptive alert for 500 errors
        if (msg.includes("Failed to fetch") || msg.includes("network")) {
          setSubmissionError("Connection to the server failed. Please check your internet or try again later. (Error 500)");
        } else {
          setSubmissionError(cleanMessage);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 space-y-4">
            <div className="h-4 w-32 animate-skeleton"></div>
            <div className="h-12 w-96 animate-skeleton"></div>
            <div className="h-3 w-64 animate-skeleton"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-zinc-900/20 border border-white/5 p-6 h-[300px] animate-skeleton"></div>
            </div>

            {/* Form Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/20 border border-white/5 p-6 md:p-8 space-y-8">
                <div className="h-8 w-48 animate-skeleton"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-24 animate-skeleton"></div>
                      <div className="h-12 w-full animate-skeleton"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-32 animate-skeleton"></div>
                  <div className="h-32 w-full animate-skeleton"></div>
                </div>
                <div className="h-14 w-full animate-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    notFound();
  }

  if (!job) return null;

  const isTechnical = job.jobType === "technical";

  if (isSubmitted) {
    return <ThankYou jobTitle={job.title} />;
  }

  const isFormValid = 
    formData.fullName.trim().length >= 2 &&
    formData.email.trim().length > 0 &&
    formData.contactNumber.trim().length > 0 &&
    formData.coverLetter.trim().length >= 30 &&
    files.resume !== null &&
    agreed === true &&
    !Object.values(errors).some(error => error !== null);

  return (
    <>

      <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/")}
              className="text-zinc-500 hover:text-[#0DE4CF] transition-colors font-technical text-xs tracking-widest uppercase mb-4 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Jobs
            </button>
            <h1 className="text-4xl md:text-5xl font-display text-white tracking-tight mb-2">
              APPLY FOR <span className="text-[#0DE4CF]">ROLE</span>
            </h1>
            <p className="text-zinc-500 font-technical text-xs tracking-[0.3em] uppercase">
              Complete the application form below
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details Card */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/40 border border-white/10 p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-2xl text-[#0DE4CF]">work</span>
                  <div>
                    <h2 className="text-white font-display text-lg">{job.title}</h2>
                    <p className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">
                      {job.serviceLine}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">Category</span>
                    <span className="text-white font-technical text-xs">{job.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">Type</span>
                    <span className={`font-technical text-xs px-2 py-1 ${isTechnical ? 'bg-[#0DE4CF]/20 text-[#0DE4CF]' : 'bg-zinc-800 text-zinc-400'}`}>
                      {job.jobType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">Experience</span>
                    <span className="text-white font-technical text-xs">{job.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">Location</span>
                    <span className="text-white font-technical text-xs">{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">Salary</span>
                    <span className="text-[#0DE4CF] font-technical text-xs">{job.salary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} noValidate className="bg-zinc-900/40 border border-white/10 p-6 md:p-8">
                <h3 className="text-white font-display text-xl mb-6 tracking-wide">
                  Application <span className="text-[#0DE4CF]">Form</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Enter your name"
                      className={`w-full bg-black border ${errors.fullName ? 'border-red-500/50' : 'border-white/10'} text-white px-4 py-3 focus:outline-none focus:border-[#0DE4CF] transition-colors placeholder:text-zinc-600`}
                    />
                    {errors.fullName && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.fullName}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Enter your email address"
                      className={`w-full bg-black border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white px-4 py-3 focus:outline-none focus:border-[#0DE4CF] transition-colors placeholder:text-zinc-600`}
                    />
                    {errors.email && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.email}</p>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Enter your contact number"
                      className={`w-full bg-black border ${errors.contactNumber ? 'border-red-500/50' : 'border-white/10'} text-white px-4 py-3 focus:outline-none focus:border-[#0DE4CF] transition-colors placeholder:text-zinc-600`}
                    />
                    {errors.contactNumber && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.contactNumber}</p>}
                  </div>

                  {/* LinkedIn Profile */}
                  <div>
                    <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Paste Your LinkedIn URL"
                      className={`w-full bg-black border ${errors.linkedIn ? 'border-red-500/50' : 'border-white/10'} text-white px-4 py-3 focus:outline-none focus:border-[#0DE4CF] transition-colors placeholder:text-zinc-600`}
                    />
                    {errors.linkedIn && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.linkedIn}</p>}
                  </div>

                  {/* GitHub - Only for technical roles */}
                  {isTechnical && (
                    <div className="md:col-span-2">
                      <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                        GitHub Profile {isTechnical && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="https://github.com/username"
                        className={`w-full bg-black border ${errors.github ? 'border-red-500/50' : 'border-white/10'} text-white px-4 py-3 focus:outline-none focus:border-[#0DE4CF] transition-colors placeholder:text-zinc-600`}
                      />
                      {errors.github && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.github}</p>}
                    </div>
                  )}
                </div>

                {/* Cover Letter / Why Join */}
                <div className="mb-6">
                  <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                    Why you want to join us <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    rows={6}
                    maxLength={1024}
                    placeholder="Tell us about your motivation and why you're a great fit for this role..."
                    className={`w-full bg-black border ${errors.coverLetter ? 'border-red-500/50' : 'border-white/10'} text-white px-4 py-3 focus:outline-none focus:border-[#0DE4CF] transition-colors placeholder:text-zinc-600 resize-none`}
                  />
                  <div className="flex justify-between mt-1.5">
                    {errors.coverLetter ? (
                      <p className="text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.coverLetter}</p>
                    ) : (
                      <span></span>
                    )}
                    <p className={`font-technical text-[10px] tracking-widest uppercase ${formData.coverLetter.length >= 1024 ? 'text-red-500' : 'text-zinc-500'}`}>
                      {formData.coverLetter.length} / 1024
                    </p>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                      Resume (PDF, max 2MB) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, "resume")}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 bg-zinc-950 border ${errors.resume ? 'border-red-500/50' : 'border-white/10'} border-dashed cursor-pointer hover:border-[#0DE4CF] transition-colors`}
                      >
                        <span className="material-symbols-outlined text-3xl text-zinc-500 mb-2">upload_file</span>
                        <span className="text-zinc-500 text-sm px-4 text-center">
                          {files.resume ? files.resume.name : "Drop files here or click to upload"}
                        </span>
                      </label>
                      {errors.resume && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.resume}</p>}
                    </div>
                  </div>

                  {/* Cover Letter Upload */}
                  <div>
                    <label className="block text-[#0DE4CF] font-technical text-xs tracking-widest uppercase mb-2">
                      Cover Letter (Optional, max 2MB)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="coverLetterFile"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "coverLetter")}
                        className="hidden"
                        id="coverletter-upload"
                      />
                      <label
                        htmlFor="coverletter-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 bg-zinc-950 border ${errors.coverLetterFile ? 'border-red-500/50' : 'border-white/10'} border-dashed cursor-pointer hover:border-[#0DE4CF] transition-colors`}
                      >
                        <span className="material-symbols-outlined text-3xl text-zinc-500 mb-2">upload_file</span>
                        <span className="text-zinc-500 text-sm px-4 text-center">
                          {files.coverLetter ? files.coverLetter.name : "Drop files here or click to upload"}
                        </span>
                      </label>
                      {errors.coverLetterFile && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.coverLetterFile}</p>}
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (e.target.checked) setErrors(prev => ({ ...prev, agreed: null }));
                      }}
                      className={`mt-1 w-4 h-4 bg-black border ${errors.agreed ? 'border-red-500/50' : 'border-white/10'} checked:bg-[#0DE4CF] checked:border-[#0DE4CF] appearance-none cursor-pointer relative after:content-['✓'] after:absolute after:text-black after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100`}
                    />
                    <span className="text-zinc-400 text-sm">
                      I agree to the{" "}
                      <button 
                        type="button" 
                        onClick={() => setModal('privacy')}
                        className="text-[#0DE4CF] hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      {" "}and{" "}
                      <button 
                        type="button" 
                        onClick={() => setModal('terms')}
                        className="text-[#0DE4CF] hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Terms
                      </button>
                      .
                    </span>
                  </label>
                  {errors.agreed && <p className="mt-1.5 text-red-500 font-technical text-[10px] tracking-widest uppercase">{errors.agreed}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !isFormValid}
                  className={`w-full py-4 font-technical tracking-[0.3em] uppercase transition-all duration-500 flex justify-center items-center gap-3 border border-transparent ${!submitting && isFormValid
                    ? "bg-white text-black hover:bg-[#0DE4CF] hover:shadow-[0_0_40px_rgba(13,228,207,0.4)] cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                    }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {modal === "privacy" && <PrivacyPolicy onClose={() => setModal(null)} />}
      {modal === "terms" && <TermsOfService onClose={() => setModal(null)} />}

      {/* Submission Error Modal */}
      {submissionError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-500">
          <div className="bg-zinc-900 border border-red-500/50 p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
              </div>
              <div>
                <h4 className="text-white font-display text-xl uppercase tracking-tight">Submission Failed</h4>
                <p className="text-zinc-500 font-technical text-[10px] tracking-widest uppercase">Action Required</p>
              </div>
            </div>
            
            <p className="text-zinc-300 text-sm mb-8 leading-relaxed font-technical border-l-2 border-red-500/30 pl-4 py-1">
              {submissionError}
            </p>
            
            <button
              onClick={() => setSubmissionError(null)}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-technical text-xs tracking-widest uppercase transition-all duration-300"
            >
              Close and Fix
            </button>
          </div>
        </div>
      )}
    </>
  );
}
