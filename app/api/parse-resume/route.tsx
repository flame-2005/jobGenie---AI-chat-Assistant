// /api/parse-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Type definitions matching the frontend
interface ExperienceEntry {
    company: string;
    position: string;
    duration: string;
    description: string;
}

interface ProjectEntry {
    title: string;
    description: string;
    technologies: string;
}

interface EducationEntry {
    degree: string;
    institution: string;
    year: string;
    gpa: string;
}

interface ParsedResumeData {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills?: string[];
    experience?: ExperienceEntry[];
    projects?: ProjectEntry[];
    education?: EducationEntry[];
}
// Configure the worker - this is crucial for Next.js
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
// Simple PDF text extraction fallback
function extractTextFromPDFSimple(buffer: Buffer): string {
    try {
        const text = buffer.toString('binary');

        // Extract text between stream/endstream objects (compatible with older JS versions)
        const streamPattern = /stream[\s\S]*?endstream/g;
        const matches = text.match(streamPattern) || [];

        let extractedText = '';
        for (const match of matches) {
            // Remove PDF formatting and extract readable text
            const cleanText = match
                .replace(/stream|endstream/g, '')
                .replace(/[^\x20-\x7E\n]/g, ' ') // Keep only printable ASCII and newlines
                .replace(/\s+/g, ' ')
                .trim();

            if (cleanText.length > 10) {
                extractedText += cleanText + '\n';
            }
        }

        // Alternative: Try to extract text objects
        if (!extractedText) {
            const textObjectPattern = /\[(.*?)\]/g;
            const textMatches = text.match(textObjectPattern) || [];

            for (const textMatch of textMatches) {
                const cleanText = textMatch
                    .replace(/[\[\]]/g, '')
                    .replace(/[^\x20-\x7E\n]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (cleanText.length > 5) {
                    extractedText += cleanText + ' ';
                }
            }
        }

        return extractedText || 'Could not extract readable text from PDF';
    } catch (error) {
        console.error('Simple PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

// Word document parsing function
async function extractTextFromWord(buffer: ArrayBuffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({
            arrayBuffer: buffer
        });
        return result.value;
    } catch (error) {
        console.error('Word extraction error:', error);
        throw new Error('Failed to extract text from Word document');
    }
}

// Email extraction
function extractEmail(text: string): string | undefined {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : undefined;
}

// Phone number extraction
function extractPhone(text: string): string | undefined {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0].replace(/\s+/g, ' ').trim() : undefined;
}

// Name extraction (first few non-email, non-phone lines)
function extractName(text: string): string | undefined {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    for (const line of lines.slice(0, 8)) {
        // Skip lines that look like emails, phones, or addresses
        if (
            !line.includes('@') &&
            !line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) &&
            !line.toLowerCase().includes('resume') &&
            !line.toLowerCase().includes('cv') &&
            !line.toLowerCase().includes('curriculum') &&
            line.length > 2 &&
            line.length < 60 &&
            /^[a-zA-Z\s.'-]+$/.test(line) &&
            !line.toLowerCase().includes('profile') &&
            !line.toLowerCase().includes('summary')
        ) {
            return line;
        }
    }

    return undefined;
}

// Skills extraction
function extractSkills(text: string): string[] {
    const skillsText = text.toLowerCase();

    // Extended list of common technical skills
    const technicalSkills = [
        // Programming Languages
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift',
        'scala', 'r', 'matlab', 'perl', 'shell', 'bash', 'powershell',

        // Frontend
        'react', 'angular', 'vue', 'svelte', 'jquery', 'bootstrap', 'tailwind', 'sass', 'less',
        'html', 'css', 'html5', 'css3', 'responsive design', 'webpack', 'vite', 'parcel',

        // Backend
        'nodejs', 'express', 'nestjs', 'django', 'flask', 'fastapi', 'spring', 'laravel',
        'rails', '.net', 'asp.net', 'gin', 'fiber',

        // Databases
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle',
        'dynamodb', 'cassandra', 'neo4j', 'firebase',

        // Cloud & DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions',
        'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache',

        // Tools & Others
        'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'figma',
        'adobe', 'photoshop', 'illustrator', 'sketch', 'xd', 'invision',

        // Methodologies
        'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd', 'microservices',
        'rest api', 'graphql', 'soap', 'grpc',

        // Data & AI
        'machine learning', 'deep learning', 'data science', 'data analysis', 'pandas',
        'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'opencv', 'nltk',

        // Mobile
        'react native', 'flutter', 'ionic', 'xamarin', 'android', 'ios'
    ];

    const foundSkills = technicalSkills.filter(skill => {
        const skillLower = skill.toLowerCase();
        return skillsText.includes(skillLower) || skillsText.includes(skillLower.replace(/\s/g, ''));
    });

    // Remove duplicates and return
    return [...new Set(foundSkills)];
}

// Summary extraction
function extractSummary(text: string): string | undefined {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let summaryStart = -1;

    // Look for summary section with various keywords
    const summaryKeywords = [
        'summary', 'objective', 'about', 'profile', 'overview',
        'professional summary', 'career objective', 'personal statement'
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (summaryKeywords.some(keyword => line.includes(keyword) && line.length < 50)) {
            summaryStart = i + 1;
            break;
        }
    }

    if (summaryStart !== -1) {
        const summaryLines = [];
        const stopKeywords = ['experience', 'education', 'skills', 'projects', 'employment', 'work history'];

        for (let i = summaryStart; i < Math.min(summaryStart + 8, lines.length); i++) {
            const line = lines[i].trim();
            if (line && !stopKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                summaryLines.push(line);
            } else if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('education')) {
                break;
            }
        }

        const summary = summaryLines.join(' ').substring(0, 600);
        return summary.length > 20 ? summary : undefined;
    }

    return undefined;
}

// Experience extraction with improved pattern matching
function extractExperience(text: string): ExperienceEntry[] {
    const experiences: ExperienceEntry[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let experienceStart = -1;
    let experienceEnd = lines.length;

    // Find experience section
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (
            (line.includes('experience') || line.includes('employment') || line.includes('work history')) &&
            line.length < 50
        ) {
            experienceStart = i + 1;
        }
        if (experienceStart !== -1 &&
            (line.includes('education') || line.includes('projects') || line.includes('skills')) &&
            line.length < 30) {
            experienceEnd = i;
            break;
        }
    }

    if (experienceStart !== -1) {
        const experienceLines = lines.slice(experienceStart, experienceEnd);
        let currentExperience: Partial<ExperienceEntry> = {};

        for (let i = 0; i < experienceLines.length; i++) {
            const line = experienceLines[i];
            if (line.length < 2) continue;

            // Check for date patterns (2020-2023, Jan 2020 - Dec 2023, etc.)
            const datePattern = /\b(20\d{2}|19\d{2})\b.*?(\b(20\d{2}|19\d{2}|present|current)\b)?/i;
            const monthYearPattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}/i;

            if (datePattern.test(line) || monthYearPattern.test(line)) {
                if (Object.keys(currentExperience).length > 0) {
                    // Save previous experience
                    if (currentExperience.company && currentExperience.position) {
                        experiences.push({
                            company: currentExperience.company,
                            position: currentExperience.position,
                            duration: currentExperience.duration || '',
                            description: currentExperience.description || ''
                        });
                    }
                    currentExperience = {};
                }
                currentExperience.duration = line;
            }
            // Likely a position title (not too long, contains job-related keywords)
            else if (
                line.length < 100 &&
                (line.includes('engineer') || line.includes('developer') || line.includes('manager') ||
                    line.includes('analyst') || line.includes('designer') || line.includes('specialist') ||
                    line.includes('lead') || line.includes('senior') || line.includes('junior') ||
                    /^[A-Z][a-z]/.test(line)) &&
                !currentExperience.position
            ) {
                currentExperience.position = line;
            }
            // Company name (usually comes after position, shorter lines)
            else if (
                line.length < 80 &&
                line.length > 2 &&
                !currentExperience.company &&
                currentExperience.position &&
                !/^[•\-\*]/.test(line) // Not a bullet point
            ) {
                currentExperience.company = line;
            }
            // Description (bullet points or longer text)
            else if (
                currentExperience.position &&
                currentExperience.company &&
                (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') ||
                    (!currentExperience.description && line.length > 20))
            ) {
                if (currentExperience.description) {
                    currentExperience.description += ' ' + line;
                } else {
                    currentExperience.description = line;
                }
            }
        }

        // Add the last experience
        if (currentExperience.company && currentExperience.position) {
            experiences.push({
                company: currentExperience.company,
                position: currentExperience.position,
                duration: currentExperience.duration || '',
                description: currentExperience.description || ''
            });
        }
    }

    return experiences.slice(0, 10); // Limit to 10 experiences
}

// Education extraction with improved parsing
function extractEducation(text: string): EducationEntry[] {
    const education: EducationEntry[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let educationStart = -1;
    let educationEnd = lines.length;

    // Find education section
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if ((line.includes('education') || line.includes('academic')) && line.length < 40) {
            educationStart = i + 1;
        }
        if (educationStart !== -1 &&
            (line.includes('experience') || line.includes('projects') || line.includes('skills')) &&
            line.length < 30) {
            educationEnd = i;
            break;
        }
    }

    if (educationStart !== -1) {
        const educationLines = lines.slice(educationStart, educationEnd);
        const degreeKeywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'associate', 'diploma', 'certificate',
            'b.s.', 'b.a.', 'm.s.', 'm.a.', 'mba', 'ph.d.', 'bs', 'ba', 'ms', 'ma'
        ];
        const yearPattern = /\b(20\d{2}|19\d{2})\b/;

        let currentEducation: Partial<EducationEntry> = {};

        for (const line of educationLines) {
            if (line.length < 3) continue;

            const lowerLine = line.toLowerCase();

            // Check if line contains a degree
            if (degreeKeywords.some(keyword => lowerLine.includes(keyword))) {
                // If we already have a degree, save the current one
                if (currentEducation.degree) {
                    education.push({
                        degree: currentEducation.degree,
                        institution: currentEducation.institution || '',
                        year: currentEducation.year || '',
                        gpa: currentEducation.gpa || ''
                    });
                    currentEducation = {};
                }
                currentEducation.degree = line;
            }
            // Check if line contains a year
            else if (yearPattern.test(line)) {
                const yearMatch = line.match(yearPattern);
                if (yearMatch) {
                    currentEducation.year = yearMatch[0];
                    // Check if line also contains institution info
                    const withoutYear = line.replace(yearPattern, '').trim();
                    if (withoutYear.length > 3 && !currentEducation.institution) {
                        currentEducation.institution = withoutYear;
                    }
                }
            }
            // Check for GPA
            else if (lowerLine.includes('gpa') || lowerLine.includes('grade')) {
                const gpaMatch = line.match(/(\d+\.\d+)/);
                if (gpaMatch) {
                    currentEducation.gpa = gpaMatch[0];
                }
            }
            // Otherwise might be institution (if we don't have one yet)
            else if (!currentEducation.institution && line.length > 5 && line.length < 100) {
                // Skip if it looks like a degree or contains years
                if (!degreeKeywords.some(keyword => lowerLine.includes(keyword)) && !yearPattern.test(line)) {
                    currentEducation.institution = line;
                }
            }
        }

        // Add the last education entry
        if (currentEducation.degree || currentEducation.institution) {
            education.push({
                degree: currentEducation.degree || '',
                institution: currentEducation.institution || '',
                year: currentEducation.year || '',
                gpa: currentEducation.gpa || ''
            });
        }
    }

    return education.slice(0, 5); // Limit to 5 education entries
}

// Projects extraction with improved parsing
function extractProjects(text: string): ProjectEntry[] {
    const projects: ProjectEntry[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let projectsStart = -1;
    let projectsEnd = lines.length;

    // Find projects section
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if ((line.includes('project') || line.includes('portfolio')) && line.length < 40) {
            projectsStart = i + 1;
        }
        if (projectsStart !== -1 &&
            (line.includes('education') || line.includes('experience')) &&
            line.length < 30) {
            projectsEnd = i;
            break;
        }
    }

    if (projectsStart !== -1) {
        const projectLines = lines.slice(projectsStart, projectsEnd);
        let currentProject: Partial<ProjectEntry> = {};

        for (let i = 0; i < projectLines.length && projects.length < 8; i++) {
            const line = projectLines[i];
            if (line.length < 3) continue;

            const lowerLine = line.toLowerCase();

            // If line looks like a project title (not too long, doesn't start with bullet)
            if (
                line.length < 100 &&
                line.length > 5 &&
                !line.startsWith('•') &&
                !line.startsWith('-') &&
                !line.startsWith('*') &&
                !currentProject.title
            ) {
                // Save previous project if it exists
                if (currentProject.title && currentProject.description) {
                    projects.push({
                        title: currentProject.title,
                        description: currentProject.description,
                        technologies: currentProject.technologies || ''
                    });
                }
                currentProject = { title: line };
            }
            // If we have a title and this looks like a description
            else if (currentProject.title && !currentProject.description && line.length > 10) {
                currentProject.description = line;
            }
            // Look for technology mentions
            else if (
                currentProject.title &&
                currentProject.description &&
                (lowerLine.includes('built with') || lowerLine.includes('using') ||
                    lowerLine.includes('technologies') || lowerLine.includes('tech stack') ||
                    lowerLine.includes('tools') || lowerLine.includes('framework'))
            ) {
                currentProject.technologies = line;
            }
            // Additional description lines
            else if (
                currentProject.title &&
                currentProject.description &&
                !currentProject.technologies &&
                (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
            ) {
                currentProject.description += ' ' + line;
            }
        }

        // Add the last project
        if (currentProject.title) {
            projects.push({
                title: currentProject.title,
                description: currentProject.description || '',
                technologies: currentProject.technologies || ''
            });
        }
    }

    return projects;
}

// Main parsing function
async function parseResumeText(text: string): Promise<ParsedResumeData> {
    try {
        const parsedData: ParsedResumeData = {
            name: extractName(text),
            email: extractEmail(text),
            phone: extractPhone(text),
            summary: extractSummary(text),
            skills: extractSkills(text),
            experience: extractExperience(text),
            projects: extractProjects(text),
            education: extractEducation(text)
        };

        return parsedData;
    } catch (error) {
        console.error('Resume parsing error:', error);
        throw new Error('Failed to parse resume content');
    }
}

// API route handler
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Check file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Unsupported file type. Please upload PDF or Word document.' },
                { status: 400 }
            );
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Please upload a file smaller than 10MB.' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();

        // Extract text based on file type
        let extractedText: string;

        if (file.type === 'application/pdf') {
            const buffer = Buffer.from(arrayBuffer);
            extractedText = await extractTextFromPDF(buffer);
        } else {
            // Word document
            extractedText = await extractTextFromWord(arrayBuffer);
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return NextResponse.json(
                { error: 'Could not extract text from file. Please ensure the file contains readable text.' },
                { status: 400 }
            );
        }

        // Parse the extracted text
        const parsedData = await parseResumeText(extractedText);

        // Return the parsed data
        return NextResponse.json(parsedData, { status: 200 });

    } catch (error) {
        console.error('Resume parsing API error:', error);
        return NextResponse.json(
            { error: 'Internal server error while processing resume' },
            { status: 500 }
        );
    }
}