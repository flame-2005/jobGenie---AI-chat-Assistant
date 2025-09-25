"use client";
import { JSX, useState } from "react";
import { User, Mail, Phone, Briefcase, FileText, Code, Award, GraduationCap, Rocket, Upload, Plus, Trash2, AlertCircle } from "lucide-react";
import InputField from "@/components/resumeForm/inputField";
import { SelectField } from "@/components/resumeForm/seletionField";
import {ParsedResumeData } from "@/constants/resumeForm";
import type { FormData } from "@/constants/resumeForm";
import ArraySection from "@/components/resumeForm/arraySection";

export default function ResumeForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    summary: "",
    skills: "",
    experience: [{ company: "", position: "", duration: "", description: "" }],
    projects: [{ title: "", description: "", technologies: "" }],
    education: [{ degree: "", institution: "", year: "", gpa: "" }],
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function parseResumeFile(file: File): Promise<void> {
    setIsParsingResume(true);
    setUploadStatus("Parsing resume...");
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', file);
      
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formDataUpload,
      });
      
      if (response.ok) {
        const parsedData: ParsedResumeData = await response.json();
        console.log('Parsed Resume Data:', {parsedData});
        
        // Merge parsed data with existing form data
        setFormData(prevData => ({
          ...prevData,
          name: parsedData.name || prevData.name,
          email: parsedData.email || prevData.email,
          phone: parsedData.phone || prevData.phone,
          summary: parsedData.summary || prevData.summary,
          skills: parsedData.skills ? parsedData.skills.join(', ') : prevData.skills,
          experience: parsedData.experience && parsedData.experience.length > 0 
            ? parsedData.experience 
            : prevData.experience,
          projects: parsedData.projects && parsedData.projects.length > 0 
            ? parsedData.projects 
            : prevData.projects,
          education: parsedData.education && parsedData.education.length > 0 
            ? parsedData.education 
            : prevData.education,
        }));
        
        setUploadStatus("Resume parsed successfully! ✓");
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("Failed to parse resume. Please fill manually.");
        setTimeout(() => setUploadStatus(""), 3000);
      }
    } catch (error) {
      console.error('Resume parsing error:', error);
      setUploadStatus("Error parsing resume. Please try again.");
      setTimeout(() => setUploadStatus(""), 3000);
    } finally {
      setIsParsingResume(false);
    }
  }

  async function handleSubmit(): Promise<void> {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setUploadStatus("Resume saved & embedded successfully! ✓");
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("Something went wrong.");
        setTimeout(() => setUploadStatus(""), 3000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setUploadStatus("Network error occurred.");
      setTimeout(() => setUploadStatus(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-6 rounded-t-2xl">
        <div className="flex items-center justify-center space-x-2">
          <FileText className="text-white" size={24} />
          <h1 className="text-xl font-bold text-white">Create Resume</h1>
        </div>
        <p className="text-blue-100 text-sm text-center mt-1">Build your professional profile</p>
      </div>

      {/* Upload Section */}
      {/* <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
            <Upload size={16} className="mr-2" />
            Upload Existing Resume
          </h2>
        </div>
        
        <div className="relative">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isParsingResume}
          />
          <label
            htmlFor="resume-upload"
            className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              isParsingResume 
                ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {isParsingResume ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm">Parsing resume...</span>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600">Click to upload PDF or Word document</p>
                <p className="text-xs text-gray-400 mt-1">We&apos;ll auto-fill the form with your resume data</p>
              </div>
            )}
          </label>
        </div>
        
        {uploadStatus && (
          <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
            uploadStatus.includes('✓') 
              ? 'bg-green-100 text-green-700' 
              : uploadStatus.includes('Error') || uploadStatus.includes('Failed')
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            <AlertCircle size={16} />
            <span className="text-sm">{uploadStatus}</span>
          </div>
        )}
      </div> */}

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Personal Info Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
            <User size={16} className="mr-2" />
            Personal Information
          </h2>
          <InputField icon={User} name="name" placeholder="Full Name" activeField={activeField} setActiveField={setActiveField} value={formData.name} onChange={handleChange} />
          <InputField icon={Mail} name="email" placeholder="Email Address" type="email" activeField={activeField} setActiveField={setActiveField} value={formData.email} onChange={handleChange} />
          <InputField icon={Phone} name="phone" placeholder="Phone Number" activeField={activeField} setActiveField={setActiveField} value={formData.phone} onChange={handleChange} />
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
            <Briefcase size={16} className="mr-2" />
            Professional Role
          </h2>
          <SelectField icon={Briefcase} name="role" placeholder={formData.role} onChange={handleChange}>
            <option value="">Select Your Role</option>
            <option value="frontend">🎨 Frontend Engineer</option>
            <option value="backend">⚙️ Backend Engineer</option>
            <option value="fullstack">🚀 Full Stack Engineer</option>
            <option value="mobile">📱 Mobile Developer</option>
            <option value="devops">🔧 DevOps Engineer</option>
            <option value="uiux">🎯 UI/UX Designer</option>
            <option value="pm">📊 Product Manager</option>
            <option value="qa">🧪 QA Engineer</option>
            <option value="data">📈 Data Scientist</option>
            <option value="other">💼 Other</option>
          </SelectField>
        </div>

        {/* Professional Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
            <FileText size={16} className="mr-2" />
            Professional Summary
          </h2>
          <InputField icon={FileText} name="summary" placeholder="Brief professional summary..." rows={3}  activeField="summary" setActiveField={setActiveField} value={formData.summary} onChange={handleChange} />
          <InputField icon={Code} name="skills" placeholder="Skills (comma separated)" rows={2}  activeField="skills" setActiveField={setActiveField} value={formData.skills} onChange={handleChange} />
        </div>

        {/* Experience Section */}
        <ArraySection
          title="Work Experience"
          section="experience"
          icon={Briefcase}
          addLabel="Experience"
          fields={[
            { name: 'company', placeholder: 'Company Name' },
            { name: 'position', placeholder: 'Job Title/Position' },
            { name: 'duration', placeholder: 'Duration (e.g., Jan 2022 - Present)' },
            { name: 'description', placeholder: 'Job description and achievements...', type: 'textarea', rows: 3 }
          ]}
          formData={formData}
            setFormData={setFormData}
        />

        {/* Projects Section */}
        <ArraySection
          title="Projects"
          section="projects"
          icon={Rocket}
          addLabel="Project"
          fields={[
            { name: 'title', placeholder: 'Project Title' },
            { name: 'description', placeholder: 'Project description and impact...', type: 'textarea', rows: 2 },
            { name: 'technologies', placeholder: 'Technologies used (comma separated)' }
          ]}
          formData={formData}
            setFormData={setFormData}
        />

        {/* Education Section */}
        <ArraySection
          title="Education"
          section="education"
          icon={GraduationCap}
          addLabel="Education"
          fields={[
            { name: 'degree', placeholder: 'Degree (e.g., Bachelor of Computer Science)' },
            { name: 'institution', placeholder: 'University/Institution' },
            { name: 'year', placeholder: 'Graduation Year' },
            { name: 'gpa', placeholder: 'GPA (optional)' }
          ]}
          formData={formData}
            setFormData={setFormData}
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <FileText size={18} />
              <span>Save Resume</span>
            </div>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <p className="text-xs text-gray-500 text-center">
          All information is processed securely and never stored without consent
        </p>
      </div>
    </div>
  );
}