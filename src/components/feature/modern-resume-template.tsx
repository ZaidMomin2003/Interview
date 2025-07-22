// src/components/feature/modern-resume-template.tsx
import React from 'react';
import type { ResumeFormData } from './resume-generator';
import { Mail, Phone, Linkedin, Github, Globe, Briefcase, GraduationCap, Construction, Code, Star } from 'lucide-react';

interface ModernResumeTemplateProps extends ResumeFormData {}

const SectionTitle: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3 flex items-center gap-2">
        {icon}{children}
    </h2>
);

const SkillBar: React.FC<{ skill: string }> = ({ skill }) => (
  <div className="flex items-center gap-2 text-sm">
    <Star className="w-3 h-3 text-primary flex-shrink-0" />
    <span>{skill}</span>
  </div>
);

export const ModernResumeTemplate: React.FC<ModernResumeTemplateProps> = (props) => {
  const {
    fullName,
    desiredJob,
    email,
    phone,
    linkedin,
    github,
    portfolio,
    summary,
    experiences,
    projects,
    education,
    skills,
  } = props;
  
  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white text-gray-700 font-sans text-sm" style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="p-8">
            {/* Header */}
            <header className="flex items-center justify-between pb-4 border-b-2 border-primary">
                <div>
                    <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">{fullName}</h1>
                    <h2 className="text-2xl font-semibold text-primary mt-1">{desiredJob}</h2>
                </div>
                <div className="text-right text-xs space-y-1">
                    {email && <a href={`mailto:${email}`} className="flex items-center justify-end gap-2 hover:text-primary"><span className="font-semibold">{email}</span><Mail size={14} /></a>}
                    {phone && <p className="flex items-center justify-end gap-2"><span className="font-semibold">{phone}</span><Phone size={14} /></p>}
                    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-end gap-2 hover:text-primary"><span className="font-semibold">LinkedIn</span><Linkedin size={14} /></a>}
                    {github && <a href={github} target="_blank" rel="noreferrer" className="flex items-center justify-end gap-2 hover:text-primary"><span className="font-semibold">GitHub</span><Github size={14} /></a>}
                    {portfolio && <a href={portfolio} target="_blank" rel="noreferrer" className="flex items-center justify-end gap-2 hover:text-primary"><span className="font-semibold">Portfolio</span><Globe size={14} /></a>}
                </div>
            </header>

            <main className="mt-6 grid grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                    <section>
                        <p className="leading-relaxed">{summary}</p>
                    </section>

                    <section>
                        <SectionTitle icon={<Briefcase size={20} />}>Work Experience</SectionTitle>
                        <div className="space-y-4">
                            {experiences.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-base text-gray-900">{exp.jobTitle}</h3>
                                        <div className="text-xs font-medium text-gray-500">{exp.startDate} – {exp.endDate}</div>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-primary">{exp.company}</p>
                                        <p className="text-xs font-medium text-gray-500">{exp.location}</p>
                                    </div>
                                    <p className="mt-1 text-xs leading-normal whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionTitle icon={<Construction size={20} />}>Projects</SectionTitle>
                         <div className="space-y-4">
                            {projects?.map((proj, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-base text-gray-900">{proj.name}</h3>
                                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">View Project</a>}
                                    </div>
                                    <p className="font-semibold text-gray-600 text-xs">{proj.technologies}</p>
                                    <p className="mt-1 text-xs leading-normal whitespace-pre-wrap">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="col-span-1 space-y-6">
                    <section>
                        <SectionTitle icon={<Code size={20} />}>Skills</SectionTitle>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {skillList.map(skill => <SkillBar key={skill} skill={skill} />)}
                        </div>
                    </section>

                    <section>
                        <SectionTitle icon={<GraduationCap size={20} />}>Education</SectionTitle>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-base text-gray-900">{edu.institution}</h3>
                                    <p className="font-semibold text-primary">{edu.degree}</p>
                                    <p className="text-xs text-gray-500">Graduated: {edu.graduationDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </div>
  );
};
