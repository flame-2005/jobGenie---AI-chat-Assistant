export interface ExperienceEntry {
  company: string;
  position: string;
  duration: string;
  description: string;
  [key: string]: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies: string;
  [key: string]: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
 [key: string]: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  summary: string;
  skills: string;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience?: ExperienceEntry[];
  projects?: ProjectEntry[];
  education?: EducationEntry[];
}