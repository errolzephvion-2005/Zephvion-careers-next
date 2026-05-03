import { createClient } from '@/lib/supabase/client';


// Define the Job type based on the schema provided
export interface Job {
  id: number;
  job_title: string;
  job_reference_code: string;
  work_experience: string | null;
  location: string;
  educational_requirements: string | null;
  service_line: string;
  category: string;
  responsibilities: string;
  technical_requirements: string | null;
  preferred_skills: string | null;
  job_type: string;
  salary: string | null;
  is_trending: boolean;
  is_active: boolean;
  created_at: string;
  status: string;
}

// UI Job Interface
export interface UIJob {
  id: string;
  title: string;
  experience: string;
  education: string;
  serviceLine: string;
  responsibilities: string[];
  preferredSkills: string[];
  division: string;
  salary: string;
  status: string;
  location: string;
  category: string;
  jobType: string;
  isTrending: boolean;

}

/**
 * Retrieves all active jobs from the Supabase database using the client-side connection
 * and transforms them into the format expected by the UI.
 */
export async function getJobs(): Promise<UIJob[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error.message);
    throw new Error(error.message);
  }

  return (data as Job[]).map((job) => {
    return {
      id: job.job_reference_code || `JOB_${job.id}`,
      title: job.job_title,
      experience: job.work_experience || "NOT SPECIFIED",
      education: job.educational_requirements || "NOT SPECIFIED",
      serviceLine: job.service_line,
      category: job.category,
      jobType: job.job_type,
      location: job.location,
      responsibilities: job.responsibilities && job.responsibilities !== "N/A"
        ? job.responsibilities.split('\n').filter((s: string) => s.trim().length > 0)
        : ["Standard professional responsibilities as per role requirements", "Stakeholder management and communication", "Process optimization and documentation"],
      preferredSkills: job.preferred_skills && job.preferred_skills !== "N/A"
        ? job.preferred_skills.split(/[,\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0).slice(0, 5)
        : ["Problem Solving", "Team Leadership", "Strategic Planning"],
      division: job.service_line.toUpperCase().replace(/\s+/g, '_'),
      salary: job.salary || 'NOT DISCLOSED',
      status: job.status || "OPEN",
      isTrending: job.is_trending
    };
  });
}

/**
 * Retrieves unique keywords, locations, and categories for the UI (Search & Explore).
 */
export async function getFilters() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('job_title, location, category, service_line, job_type')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching filters:', error.message);
    return { keywords: [], locations: [], categories: [] };
  }

  const keywords = Array.from(new Set(data.map((job) => job.job_title))).filter(Boolean) as string[];
  const locations = Array.from(new Set(data.map((job) => job.location))).filter(Boolean) as string[];
  const categories = Array.from(new Set(data.map((job) => job.category))).filter(Boolean) as string[];

  return { keywords, locations, categories };
}
