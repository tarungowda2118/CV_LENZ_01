
import React from 'react';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Globe, Linkedin, Github, Twitter, 
  ExternalLink, Briefcase, Award, GraduationCap, Star, Zap,
  Download, MousePointer2, Sparkles, MessageSquare, Heart, ShieldCheck,
  Mail, Phone, Laptop, Code, Cpu, Database
} from 'lucide-react';

interface PortfolioProps {
  profile: UserProfile;
  onBack: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ profile, onBack }) => {
  const { personal, experience, skills, trajectory, analysis } = profile;

  // Group skills by category for the Skills & Expertise section
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Group trajectory/projects into "Work Samples" categories
  // In a real app, Gemini would provide specific project categories.
  // Here we categorize based on skill categories for visual richness.
  const projectCategories = ["Webflow Projects", "React & Next.js Applications", "Automation Projects"];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-300 selection:bg-purple-500/30 overflow-x-hidden">
      {/* Top Back Button */}
      <div className="fixed top-8 left-8 z-50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white transition-all group uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </button>
      </div>

      {/* Hero Header */}
      <header className="pt-24 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            Available for opportunities
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 flex flex-col items-center"
          >
            <span className="text-white">{personal.name.split(' ')[0]}</span>
            <span className="text-purple-500 -mt-2">{personal.name.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto mb-4"
          >
            {personal.title}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-medium mb-10"
          >
            2+ years of experience building scalable web applications
          </motion.p>

          <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest mb-12">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 8970139581</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@cvlenz.ai</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</div>
          </div>

          <div className="flex justify-center gap-4">
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/20">
              Download Resume
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all border border-white/5">
              View Projects
            </button>
          </div>
        </div>
      </header>

      {/* Work Experience Section */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">
          <span className="text-white">Work</span> <span className="text-purple-500">Experience</span>
          <p className="text-sm font-medium text-slate-500 mt-4 normal-case tracking-normal">Professional journey building scalable web applications and managing content systems</p>
        </h2>

        <div className="space-y-8">
          {experience.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#141923] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-purple-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-black text-purple-400">{exp.company}</h3>
                    <div className="flex gap-2">
                       {skills.slice(0, 4).map((s, i) => (
                         <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">{s.name}</span>
                       ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {exp.period}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Remote</span>
                  </div>
                  
                  <ul className="space-y-4">
                    {exp.impact.split('.').filter(s => s.trim()).map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-slate-400 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
                        {bullet.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Work Samples Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-4">
          <span className="text-white">Work</span> <span className="text-purple-500">Samples</span>
        </h2>
        <p className="text-slate-500 text-center mb-24 font-medium uppercase tracking-widest text-sm">Showcasing expertise across different technologies and platforms</p>

        <div className="space-y-24">
          {projectCategories.map((category, catIdx) => (
            <div key={catIdx}>
              <h3 className="flex items-center gap-4 text-purple-400 text-xl font-black mb-12">
                <div className="p-2 rounded-lg bg-purple-500/10"><Code className="w-6 h-6" /></div>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trajectory.slice(catIdx * 2, (catIdx + 1) * 2 + 1).map((project, pIdx) => (
                  <motion.div 
                    key={pIdx}
                    whileHover={{ y: -5 }}
                    className="bg-[#141923] border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all flex flex-col h-full"
                  >
                    <div className="mb-6">
                      <h4 className="text-xl font-black text-white mb-1">{project.title}</h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">Corporate</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                       {skills.slice(pIdx, pIdx + 5).map((s, i) => (
                         <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-500 text-[9px] font-bold border border-white/5">{s.name}</span>
                       ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Expertise Section */}
      <section className="px-6 py-24 bg-[#080b0f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">
            <span className="text-white">Skills &</span> <span className="text-purple-500">Expertise</span>
            <p className="text-sm font-medium text-slate-500 mt-4 normal-case tracking-normal">Technical proficiencies and language capabilities</p>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, catSkills], idx) => (
              <div key={idx} className="bg-[#141923] border border-white/5 rounded-3xl p-10">
                <h3 className="text-slate-400 font-bold mb-8 uppercase tracking-[0.2em] text-sm border-b border-white/5 pb-4">{category}</h3>
                <div className="flex flex-wrap gap-3">
                  {catSkills.map((skill, i) => (
                    <div key={i} className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-xs font-bold text-slate-300 hover:border-purple-500/50 transition-all cursor-default">
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certification Section */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">
          <span className="text-white">Education &</span> <span className="text-purple-500">Certification</span>
          <p className="text-sm font-medium text-slate-500 mt-4 normal-case tracking-normal">Academic background and professional development</p>
        </h2>

        <div className="space-y-16">
          <div>
            <h3 className="flex items-center gap-3 text-purple-400 font-black mb-8">
              <GraduationCap className="w-6 h-6" />
              Education
            </h3>
            <div className="space-y-4">
              <div className="bg-[#141923] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h4 className="text-xl font-black text-purple-400 mb-1">Bachelor of Engineering</h4>
                  <p className="text-slate-400">Acharya Institute of Technology, Bengaluru</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="text-slate-500 text-xs font-bold bg-slate-900 px-3 py-1 rounded-lg">Engineering</span>
                  <span className="text-slate-500 text-xs font-bold">2018 - 2022</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-3 text-purple-400 font-black mb-8">
              <Award className="w-6 h-6" />
              Certification
            </h3>
            <div className="bg-[#141923] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h4 className="text-xl font-black text-purple-400 mb-1">Full Stack Developer</h4>
                <p className="text-slate-400">Industry Recognition Program</p>
              </div>
              <span className="text-slate-500 text-xs font-bold bg-slate-900 px-3 py-1 rounded-lg mt-4 md:mt-0 uppercase">Professional Certification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="px-6 py-32 bg-[#080b0f] text-center">
        <h2 className="text-5xl font-black mb-6">
          <span className="text-white">Let's</span> <span className="text-purple-500">Connect</span>
        </h2>
        <p className="text-slate-500 mb-20 max-w-lg mx-auto font-medium">Ready to bring your ideas to life? Let's discuss your next project</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {[
            { label: 'Phone', val: '8970139581', icon: Phone },
            { label: 'Email', val: 'contact@cvlenz.ai', icon: Mail },
            { label: 'Location', val: personal.location, icon: MapPin },
          ].map((item, i) => (
            <div key={i} className="bg-[#141923] border border-white/5 rounded-3xl p-10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{item.label}</p>
              <p className="text-white font-black">{item.val}</p>
            </div>
          ))}
        </div>

        <button className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-purple-600/20">
          Download Resume
        </button>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-slate-600 text-xs font-medium">
        © 2025 • Generated by CVLenz Dynamic Platform
      </footer>
    </div>
  );
};

export default Portfolio;
