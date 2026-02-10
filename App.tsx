
import React, { useState } from 'react';
import { synthesizeProfile } from './services/geminiService';
import { UserProfile, ViewState } from './types';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import { Sparkles, Upload, FileText, LayoutDashboard, BrainCircuit, Globe, ChevronRight, Github, Twitter, Linkedin, FileUp } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleSynthesize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const result = await synthesizeProfile(inputText);
      setProfile(result);
      setView('dashboard');
    } catch (error) {
      console.error("Synthesis failed", error);
      alert("Failed to analyze profile. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPdf(file);
        setInputText(text);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setInputText(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Error reading file:", err);
      alert("Failed to read file. Please ensure it's a valid PDF or text file.");
    } finally {
      setIsParsing(false);
    }
  };

  // Skip rendering the main nav and footer if in portfolio view to give it a clean, full-page feel
  if (view === 'portfolio' && profile) {
    return <Portfolio profile={profile} onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center glow-shadow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">CVLenz</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">How it works</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Enterprise</a>
          </div>
          <button 
            onClick={() => setView('uploading')}
            className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-cyan-50 transition-all flex items-center gap-2 shadow-lg"
          >
            Launch Builder
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {view === 'landing' && (
          <div className="relative isolate pt-14">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#06b6d4] to-[#a855f7] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>

            <div className="py-24 sm:py-32 lg:pb-40">
              <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1 rounded-full mb-8">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-xs font-medium text-cyan-400">Powered by Gemini 3 Flash</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                  Transform static resumes into <br />
                  <span className="gradient-text">Dynamic AI Profiles</span>
                </h1>
                <p className="text-lg leading-8 text-slate-400 max-w-2xl mx-auto mb-10">
                  CVLenz goes beyond words. Our AI synthesizes your bio into a multi-dimensional platform featuring trajectory analytics, network graphs, and deep professional insights.
                </p>
                <div className="flex items-center justify-center gap-6">
                  <button 
                    onClick={() => setView('uploading')}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl"
                  >
                    Get Started Free
                  </button>
                  <button className="text-slate-300 font-bold hover:text-white transition-colors flex items-center gap-2">
                    View Demo Dashboard
                  </button>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass p-8 rounded-3xl text-left border-l-4 border-l-cyan-500">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6">
                      <BrainCircuit className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Synthesis</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Advanced parsing of raw bio text into structured JSON models using the latest generative intelligence.
                    </p>
                  </div>
                  <div className="glass p-8 rounded-3xl text-left border-l-4 border-l-purple-500">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                      <LayoutDashboard className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Visual Dashboard</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Beautiful analytics, momentum trackers, and career trajectory timelines presented in a professional UI.
                    </p>
                  </div>
                  <div className="glass p-8 rounded-3xl text-left border-l-4 border-l-rose-500">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6">
                      <Globe className="w-6 h-6 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Network Mapping</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Visualize your professional reach with connection graphs based on your company history and skill stack.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'uploading' && (
          <div className="max-w-4xl mx-auto py-20 px-4">
            <div className="glass rounded-[2rem] p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500"></div>
                <h2 className="text-3xl font-bold mb-4">Feed the AI</h2>
                <p className="text-slate-400 mb-8">Paste your resume text or upload a PDF/TXT to build your dynamic profile</p>
                
                <div className="space-y-6">
                    <div className="relative">
                      <textarea 
                          className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                          placeholder="Paste your professional summary, experience history, and skills here..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                      />
                      {isParsing && (
                        <div className="absolute inset-0 bg-slate-900/80 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm animate-in fade-in">
                          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-cyan-400 font-bold">Extracting text from PDF...</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative">
                            <input 
                                type="file" 
                                id="resume-upload" 
                                className="hidden" 
                                onChange={handleFileUpload}
                                accept=".pdf,.txt"
                            />
                            <label 
                                htmlFor="resume-upload"
                                className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
                            >
                                <FileUp className="w-4 h-4 text-cyan-400" />
                                Upload PDF or TXT
                            </label>
                        </div>
                        
                        <button 
                            onClick={handleSynthesize}
                            disabled={isLoading || isParsing || !inputText.trim()}
                            className="w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                    Synthesizing...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit className="w-5 h-5" />
                                    Generate Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && profile && (
          <Dashboard 
            profile={profile} 
            onViewPortfolio={() => setView('portfolio')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CVLenz</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Empowering professionals with AI-driven dynamic presence. Built for the modern talent economy.
            </p>
            <div className="flex gap-4">
                <Twitter className="w-5 h-5 text-slate-500 hover:text-cyan-400 cursor-pointer" />
                <Github className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-slate-500 hover:text-cyan-600 cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Stay Updated</h4>
            <p className="text-xs text-slate-500 mb-4">Get the latest career intelligence insights.</p>
            <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-500 w-full" />
                <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
          © 2025 CVLenz AI Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
