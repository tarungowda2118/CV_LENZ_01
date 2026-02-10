
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Connection } from '../types';
import { Search, Users, X, Briefcase, Network, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkGraphProps {
  connections: Connection[];
  userName: string;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ connections, userName }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const filteredConnections = useMemo(() => {
    return connections.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [connections, searchQuery]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;

    const nodes = [
      { id: userName, group: 0, size: 12, role: 'Me', type: 'Primary' },
      ...filteredConnections.map((c) => ({ 
        id: c.name, 
        group: 1, 
        size: 6, 
        role: c.role,
        type: c.type,
        strength: c.strength,
        raw: c 
      }))
    ];

    const links = filteredConnections.map(c => ({
      source: userName,
      target: c.name,
      value: c.strength,
      type: c.type
    }));

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);
    
    // Clear previous if structure changes significantly, otherwise D3 handles it
    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current);

    svg.append("defs").append("style").text(`
      @keyframes pulse {
        0% { r: 12; opacity: 0.6; }
        50% { r: 24; opacity: 0.2; }
        100% { r: 12; opacity: 0.6; }
      }
      .node-pulse {
        animation: pulse 2s infinite ease-in-out;
      }
    `);

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.4) 
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-pointer")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Fade-in animation
    node.attr("opacity", 0).transition().duration(500).attr("opacity", 1);

    node.filter(d => d.group === 0)
      .append("circle")
      .attr("r", 12)
      .attr("fill", "#06B6D4")
      .attr("class", "node-pulse")
      .style("pointer-events", "none");

    node.append("circle")
      .attr("r", d => d.size * 2)
      .attr("fill", d => d.group === 0 ? "#06B6D4" : "#A855F7")
      .attr("class", "glow-shadow transition-all duration-300")
      .attr("stroke", d => d.group === 0 ? "rgba(6, 182, 212, 0.4)" : "rgba(168, 85, 247, 0.4)")
      .attr("stroke-width", 3);

    const textGroup = node.append("g")
      .attr("transform", "translate(15, 5)");

    textGroup.append("text")
      .text(d => d.id)
      .style("font-size", "11px")
      .style("fill", "#F8FAFC")
      .style("font-weight", "700");

    textGroup.append("text")
      .text(d => d.role)
      .attr("dy", "12px")
      .style("font-size", "9px")
      .style("fill", "#94A3B8")
      .style("font-weight", "500");

    node.on("mouseover", (event, d: any) => {
      node.style("opacity", (n: any) => (n === d || n.id === userName) ? 1 : 0.2);
      link.style("stroke-opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1);
      
      if (d.group !== 0) {
        tooltip
          .style("opacity", 1)
          .html(`
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between gap-4">
                <span class="font-bold text-white text-sm">${d.id}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold uppercase">${d.type}</span>
              </div>
              <div class="text-xs text-slate-400 font-medium">${d.role}</div>
              <div class="text-[10px] text-cyan-400 font-black mt-2">CLICK TO VIEW INSIGHTS</div>
            </div>
          `);
      }
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 15) + "px");
    })
    .on("mouseout", () => {
      node.style("opacity", 1);
      link.style("stroke-opacity", 0.4);
      tooltip.style("opacity", 0);
    })
    .on("click", (event, d: any) => {
      if (d.group !== 0 && d.raw) {
        setSelectedConnection(d.raw);
      }
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [filteredConnections, userName]);

  return (
    <div className="w-full h-full glass rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden group">
      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="fixed pointer-events-none opacity-0 glass px-4 py-3 rounded-xl border border-white/10 shadow-2xl z-[100] min-w-[200px] transition-opacity duration-200"
        style={{ backdropFilter: 'blur(16px)' }}
      />

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedConnection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-[#0F172A]/85 backdrop-blur-lg p-8 flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/20 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedConnection(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-3xl font-bold shadow-xl">
                  {selectedConnection.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight">{selectedConnection.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">{selectedConnection.type}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-xs text-slate-500 font-bold">Connection</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                    Current Status
                  </div>
                  <p className="text-slate-100 font-semibold text-lg">{selectedConnection.role}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                    <History className="w-3.5 h-3.5 text-purple-500" />
                    Trajectory
                  </div>
                  <div className="space-y-3">
                    {selectedConnection.roleHistory.map((role, i) => (
                      <div key={i} className="flex items-start gap-4 text-sm text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2 shrink-0" />
                        <span className="leading-tight">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                    <Network className="w-3.5 h-3.5 text-rose-500" />
                    Mutual Network
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedConnection.sharedConnections.map((name, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-700 text-[10px] font-bold text-slate-300 hover:border-slate-500 transition-colors cursor-default">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-2 border-t border-white/5">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                    <span>Proximity Strength</span>
                    <span className="text-cyan-400">{selectedConnection.strength}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[2px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedConnection.strength}%` }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-purple-500/10 transition-colors duration-1000"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Connection Network
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-[0.15em] font-bold flex items-center gap-2">
            <span className="text-cyan-400">{filteredConnections.length}</span> Active Nodes
            <span className="w-1 h-1 rounded-full bg-slate-800"></span>
            <span className="text-slate-400/60">Dynamic Graph Integration</span>
          </p>
        </div>

        <div className="relative w-full sm:w-72 group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/search:text-cyan-400 transition-colors" />
          <input 
            type="text"
            placeholder="Find connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-10 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 relative min-h-[400px] border border-white/5 rounded-[2rem] bg-black/10 overflow-hidden">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        <AnimatePresence>
          {filteredConnections.length === 0 && searchQuery && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none"
            >
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800">
                <Users className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm font-bold tracking-tight">No connections found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-xs font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors pointer-events-auto"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-6 left-6 flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-950/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
            <span>Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
            <span>Network Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
