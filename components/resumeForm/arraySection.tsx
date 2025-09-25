import React from 'react'
import type { EducationEntry, ExperienceEntry, FormData, ProjectEntry } from "@/constants/resumeForm";
import { Plus, Trash2 } from 'lucide-react';

interface FieldConfig {
    name: string;
    placeholder: string;
    type?: string;
    rows?: number;
}

interface ArraySectionProps {
    title: string;
    section: keyof Pick<FormData, 'experience' | 'projects' | 'education'>;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    fields: FieldConfig[];
    addLabel: string;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    formData: FormData;
}

type SectionType = 'experience' | 'projects' | 'education';

const ArraySection = ({ title, section, icon: Icon, fields, addLabel, setFormData, formData, }: ArraySectionProps) => {

    function addArrayItem(section: SectionType): void {
        const templates: Record<SectionType, ExperienceEntry | ProjectEntry | EducationEntry> = {
            experience: { company: "", position: "", duration: "", description: "" },
            projects: { title: "", description: "", technologies: "" },
            education: { degree: "", institution: "", year: "", gpa: "" }
        };

        setFormData({
            ...formData,
            [section]: [...formData[section], templates[section]]
        });
    }

    function removeArrayItem(section: SectionType, index: number): void {
        if (formData[section].length > 1) {
            const updatedSection = formData[section].filter((_, i) => i !== index);
            setFormData({ ...formData, [section]: updatedSection });
        }
    }

    function getFieldValue(item: ExperienceEntry | ProjectEntry | EducationEntry, fieldName: string): string {
        return (item as Record<string, string>)[fieldName] || "";
    }

      function handleArrayChange(section: SectionType, index: number, field: string, value: string): void {
        const updatedSection = [...formData[section]];
        
        if (section === 'experience') {
          const experienceSection = updatedSection as ExperienceEntry[];
          (experienceSection[index] as Record<string, string>)[field] = value;
        } else if (section === 'projects') {
          const projectsSection = updatedSection as ProjectEntry[];
          (projectsSection[index] as Record<string, string>)[field] = value;
        } else if (section === 'education') {
          const educationSection = updatedSection as EducationEntry[];
          (educationSection[index] as Record<string, string>)[field] = value;
        }
        
        setFormData({ ...formData, [section]: updatedSection });
      }
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                    <Icon size={16} className="mr-2" />
                    {title}
                </h2>
                <button
                    type="button"
                    onClick={() => addArrayItem(section)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    <Plus size={16} />
                    <span>Add {addLabel}</span>
                </button>
            </div>

            {formData[section].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl space-y-3 relative">
                    {formData[section].length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeArrayItem(section, index)}
                            className="absolute top-0 right-0 text-red-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {fields.map((field: FieldConfig) => (
                            <div key={field.name} className="relative">
                                {field.type === 'textarea' ? (
                                    <textarea
                                        placeholder={field.placeholder}
                                        rows={field.rows || 2}
                                        value={getFieldValue(item, field.name)}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                      transition-all duration-200 resize-none placeholder-gray-400"
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            handleArrayChange(section, index, field.name, e.target.value)
                                        }
                                    />
                                ) : (
                                    <input
                                        type={field.type || "text"}
                                        placeholder={field.placeholder}
                                        value={getFieldValue(item, field.name)}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                      transition-all duration-200 placeholder-gray-400"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleArrayChange(section, index, field.name, e.target.value)
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ArraySection
