
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { UserProfile, TrajectoryPoint, Skill } from '../types';
import NetworkGraph from './NetworkGraph';
import { 
  TrendingUp, Award, Briefcase, Zap, Star, ShieldCheck, Heart, Info, X, Target, 
  MousePointer2, Flag, ArrowUpRight, Globe, Sparkles, Rocket, GraduationCap,
  CircleDashed,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  profile: UserProfile;
  onViewPortfolio?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onViewPortfolio }) => {
  const { personal, experience, skills, trajectory, connections, analysis } = profile;
  
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const stats = useMemo(() => {
    const current = trajectory[trajectory.length - 1]?.momentum || 0;
    const peak = Math.max(...trajectory.map(t => t.momentum));
    const start = trajectory[0]?.momentum || 0;
    const delta = current - start;
    return { current, peak, delta };
  }, [trajectory]);

  const getColorByIndex = (index: number) => {
    const colors = [
      { border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10', text: 'text-emerald-400', marker: 'bg-emerald-500' },
      { border: 'border-purple-500/30', glow: 'shadow-purple-500/10', text: 'text-purple-400', marker: 'bg-purple-500' },
      { border: 'border-cyan-500/30', glow: 'shadow-cyan-500/10', text: 'text-cyan-400', marker: 'bg-cyan-500' },
      { border: 'border-indigo-500/30', glow: 'shadow-indigo-500/10', text: 'text-indigo-400', marker: 'bg-indigo-500' },
    ];
    return colors[index % colors.length];
  };

  const getIconByYear = (year: string) => {
    const y = parseInt(year);
    if (isNaN(y)) return <Briefcase className="w-4 h-4" />;
    if (y > 2023) return <TrendingUp className="w-4 h-4" />;
    if (y === 2023) return <Rocket className="w-4 h-4" />;
    if (y < 2022) return <GraduationCap className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-700">
      
      {/* REBUILT PROFILE HEADER: Refined Hero Dimensions */}
      <div className="glass rounded-[3rem] p-10 md:p-14 flex flex-col lg:flex-row items-center lg:items-start gap-12 relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-cyan-500/5 rounded-full blur-[140px] -mr-96 -mt-96 pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
        
        {/* REBUILT Profile Picture: Expanded to 160px for Hero Presence */}
        <div className="relative shrink-0">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-[0_25px_60px_rgba(6,182,212,0.4)] border border-white/20 relative z-10"
          >
            {personal.name.charAt(0)}
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-2xl border-[5px] border-[#0F172A] shadow-2xl z-20"
          >
            <ShieldCheck className="w-6 h-6 text-white" />
          </motion.div>
          {/* Enhanced Aura */}
          <div className="absolute inset-0 bg-cyan-400/25 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </div>

        {/* REBUILT Bio & Description Content: Strategic Width Constraints */}
        <div className="flex-1 text-center lg:text-left z-10 pt-2">
          <div className="flex flex-col items-center lg:items-start gap-3 mb-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
              {personal.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
              <span className="px-4 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-black text-xs uppercase tracking-[0.2em] border border-cyan-500/20">
                {personal.title}
              </span>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-900/50 px-3 py-1 rounded-lg border border-white/5">
                <MapPin className="w-4 h-4 text-slate-600" />
                {personal.location}
              </div>
            </div>
          </div>
          
          {/* Description: Width constrained to 800px for optimal reading experience */}
          <div className="max-w-3xl">
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium opacity-80 mb-10">
              {personal.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-cyan-500 text-[#0F172A] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-cyan-500/20">
              <Briefcase className="w-4 h-4" />
              Recruit Agent
            </button>
            <button 
              onClick={onViewPortfolio}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Full Portfolio
            </button>
          </div>
        </div>

        {/* REBUILT Metric Sidebar: Compact & Balanced */}
        <div className="flex gap-4 lg:flex-col lg:gap-5 shrink-0">
            <div className="glass p-6 rounded-[2rem] text-center min-w-[160px] border-white/5 bg-slate-900/60 shadow-inner group/card hover:border-cyan-500/30 transition-colors">
                <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2 opacity-50 group-hover/card:opacity-100 transition-opacity">Market Fit</p>
                <p className="text-3xl font-black text-cyan-400 tracking-tight">{analysis.marketFit}</p>
            </div>
            <div className="glass p-6 rounded-[2rem] text-center min-w-[160px] border-white/5 bg-slate-900/60 shadow-inner group/card hover:border-rose-500/30 transition-colors">
                <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2 opacity-50 group-hover/card:opacity-100 transition-opacity">Well-being</p>
                <div className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
                    <p className="text-3xl font-black text-slate-100 tracking-tight">{analysis.wellBeingMetric}%</p>
                </div>
            </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CAREER TRAJECTORY TIMELINE */}
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 flex flex-col bg-slate-950/20 border border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                <CircleDashed className="w-8 h-8 animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white leading-tight">Career Trajectory</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.15em] mt-1">Professional footprints & milestones</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Score</p>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black">
                <TrendingUp className="w-4 h-4" />
                <span>+{stats.delta}%</span>
              </div>
            </div>
          </div>

          <div className="relative pl-12 space-y-8">
            <div className="absolute left-[23px] top-2 bottom-2 w-px bg-slate-800"></div>

            {trajectory.map((point, index) => {
              const theme = getColorByIndex(index);
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -left-[37px] top-6 z-10">
                    <div className={`w-12 h-12 rounded-full border-2 border-[#0F172A] flex items-center justify-center bg-[#0F172A]`}>
                      <div className={`w-5 h-5 rounded-full border-4 border-[#0F172A] ring-2 ring-cyan-500/50 ${theme.marker}`}></div>
                    </div>
                  </div>

                  <div className={`glass p-6 rounded-[2rem] border ${theme.border} ${theme.glow} hover:bg-white/[0.04] transition-all duration-500 group-hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500`}>
                        {getIconByYear(point.date)}
                        {point.date}
                      </span>
                      {index < 2 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    </div>
                    
                    <h4 className="text-2xl font-black text-white tracking-tight mb-1">{point.title}</h4>
                    <p className={`text-sm font-bold ${theme.text} mb-4`}>{point.subtitle}</p>
                    
                    <p className="text-base text-slate-400 font-medium leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <button className="text-[10px] font-black text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
              View Full History Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skill Momentum / Surges */}
        <div className="glass rounded-[3rem] p-10 relative flex flex-col border border-white/5">
          <h3 className="text-2xl font-black flex items-center gap-4 mb-4">
            <Zap className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-xl" />
            Skill Momentum
          </h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.15em] mb-10">Relative expertise vs Global Market Benchmark</p>
          
          <div className="flex-1 min-h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={skills} 
                layout="vertical" 
                margin={{ left: -30, right: 10 }}
                onClick={(data) => data && data.activePayload && setSelectedSkill(data.activePayload[0].payload)}
              >
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={110} 
                  stroke="#64748b" 
                  fontSize={11} 
                  fontWeight={800}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass px-4 py-2 rounded-xl border-white/20 shadow-2xl pointer-events-none">
                          <p className="text-sm font-black text-white">{payload[0].payload.name}</p>
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Index: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="level" 
                  radius={[0, 10, 10, 0]} 
                  barSize={20}
                >
                  {skills.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.surge ? 'url(#skillSurgeGradientRedesign)' : '#1e293b'} 
                      stroke={entry.surge ? 'rgba(6,182,212,0.5)' : 'transparent'}
                      className="cursor-pointer hover:brightness-150 transition-all duration-300"
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="skillSurgeGradientRedesign" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>

            <AnimatePresence>
              {selectedSkill && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="absolute inset-0 z-30 glass m-2 p-8 rounded-[2rem] border-white/20 shadow-2xl flex flex-col bg-slate-900/90 backdrop-blur-3xl"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-3xl font-black text-white tracking-tight leading-none">{selectedSkill.name}</h4>
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mt-3">{selectedSkill.category}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedSkill(null)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-8 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Capability Level</span>
                      <span className="text-4xl font-black text-white">{selectedSkill.level}<span className="text-lg text-slate-500 ml-1">%</span></span>
                    </div>
                    
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-1">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSkill.level}%` }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                       />
                    </div>

                    <div className="bg-slate-950/40 p-6 rounded-[1.5rem] border border-white/5">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className={`w-5 h-5 ${selectedSkill.surge ? 'text-amber-400' : 'text-slate-700'}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Momentum Status</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-300 leading-relaxed">
                        {selectedSkill.surge 
                          ? "Dynamic acceleration detected. This skill represents a high-impact growth area currently driving career leverage." 
                          : "Core operational competency. Maintaining consistent benchmark performance at senior levels."}
                      </p>
                    </div>
                  </div>

                  <button 
                    className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
                    onClick={() => setSelectedSkill(null)}
                  >
                    Return to Overview
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
               <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse"></div>
               <span className="tracking-widest">Momentum Detected</span>
            </div>
            <Info className="w-4 h-4 text-slate-700 hover:text-cyan-400 cursor-help transition-colors" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network Graph */}
        <NetworkGraph connections={connections} userName={personal.name} />

        {/* Consultancy Report */}
        <div className="glass rounded-[3rem] p-10 relative overflow-hidden group border border-white/5">
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] transition-all duration-1000"></div>
            
            <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/5">
                  <Briefcase className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Strategic Analysis</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Deep-Tech Profile Benchmarks</p>
                </div>
            </div>
            
            <div className="space-y-10 relative">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Education Trajectory</h4>
                    </div>
                    <div className="relative pl-8 border-l border-slate-800">
                      <p className="text-base text-slate-300 leading-relaxed font-medium italic">
                          "{analysis.educationDeepDive}"
                      </p>
                      <Star className="absolute top-0 -left-[9px] w-4 h-4 text-amber-500 bg-[#0F172A] p-0.5" />
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-500">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Market Valuation</p>
                        <p className="text-4xl font-black text-emerald-400 tracking-tight">{analysis.salaryEstimate}</p>
                        <div className="mt-4 flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black">PREMIUM TIER</span>
                        </div>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-purple-500/40 hover:shadow-2xl transition-all duration-500">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Impact Quotient</p>
                        <p className="text-4xl font-black text-purple-400 tracking-tight">V-Scale 9</p>
                        <div className="mt-4 flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[8px] font-black">STRATEGIC NODE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 text-xs text-slate-500 bg-slate-950/40 p-6 rounded-[1.5rem] border border-white/5">
                    <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">
                      AI-generated insights derived from cross-referencing global talent datasets and current market trends for <span className="text-white font-black">{personal.title}</span> specializations.
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Pulse Feed */}
      <div className="glass rounded-[3rem] p-10 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black text-white">Pulse Feed</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.15em] mt-2">Iterative professional history and milestone tracking</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">
            Export History
          </button>
        </div>

        <div className="space-y-8">
          {experience.map((exp, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-8 items-start p-8 hover:bg-white/[0.04] rounded-[2.5rem] transition-all border border-transparent hover:border-white/10 group cursor-default"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-500">
                <Award className="w-8 h-8 text-cyan-500/60 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
                  <div>
                    <h4 className="font-black text-2xl tracking-tight text-white mb-1">{exp.role}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-500 text-sm font-black uppercase tracking-[0.1em]">@ {exp.company}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                      <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">{exp.period}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-400 text-[9px] font-black uppercase border border-white/5">Verified Node</span>
                  </div>
                </div>
                <div className="relative">
                   <p className="text-base text-slate-400 leading-relaxed font-medium bg-slate-950/30 p-6 rounded-[1.5rem] border border-white/5 group-hover:text-slate-200 transition-colors">
                     {exp.impact}
                   </p>
                   <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-800 hidden lg:block" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
