import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/ui/particle-background";
import { TopBar, type TabId } from "@/components/ui/top-bar";
import { Gamepad2, Globe, LayoutGrid, MoreHorizontal, MessageSquare, Sun, Moon, Palette, Shield, Disc, Maximize2, Info, X } from "lucide-react";
// @ts-ignore
import { games, apps } from "@/lib/index";

type Theme = 'default' | 'light' | 'dark';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [runningItem, setRunningItem] = useState<{ name: string; link: string } | null>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('pulse-theme') as Theme) || 'default');
  const [panicEnabled, setPanicEnabled] = useState(() => localStorage.getItem('pulse-panic-enabled') === 'true');
  const [panicKey, setPanicKey] = useState(() => localStorage.getItem('pulse-panic-key') || 'Escape');
  const [panicUrl, setPanicUrl] = useState(() => localStorage.getItem('pulse-panic-url') || 'https://clever.com');
  const [isSettingPanicKey, setIsSettingPanicKey] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    const hasSeenAnnouncement = sessionStorage.getItem('pulse-announcement-seen');
    if (!hasSeenAnnouncement) {
      setShowAnnouncement(true);
      sessionStorage.setItem('pulse-announcement-seen', 'true');
    }
  }, []);

  const news = [
    {
      id: 1,
      title: "Pulse Launch",
      date: "Feb 26, 2026",
      content: "Welcome to Pulse V2.0.0. For now, sites will still be named officialsw, and will eventully be stopped soon and no longer be avalible."
    },
    {
      id: 2,
      title: "Vercel",
      date: "Feb 25, 2026",
      content: "The main site has been blocked in my county."
    },
    {
      id: 3,
      title: "Incompatible Games",
      date: "Feb 24, 2026",
      content: "The following games have been removed due to incompatibility: A bite at freddy's, bow masters, google fued, buckshot roulette. Please let me know on the discord if you find any other games that are incompatible. (If it crashed)" 
    },
  ];

  useEffect(() => {
    localStorage.setItem('pulse-theme', theme);
    localStorage.setItem('pulse-panic-enabled', panicEnabled.toString());
    localStorage.setItem('pulse-panic-key', panicKey);
    localStorage.setItem('pulse-panic-url', panicUrl);
  }, [theme, panicEnabled, panicKey, panicUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSettingPanicKey) {
        setPanicKey(e.key);
        setIsSettingPanicKey(false);
        e.preventDefault();
        return;
      }
      if (panicEnabled && e.key === panicKey) {
        window.location.replace(panicUrl);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicEnabled, panicKey, isSettingPanicKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const handleLaunch = (item: { name: string; link: string }) => {
    setRunningItem(item);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (runningItem) {
    return (
      <div ref={containerRef} className="fixed inset-0 bg-black z-[100] flex flex-col">
        <div className="p-2 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="text-white font-mono text-sm uppercase tracking-widest">{runningItem.name}</span>
            <button 
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              setRunningItem(null);
            }}
            className="px-4 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            EXIT
          </button>
        </div>
        <iframe 
          src={runningItem.link} 
          className="flex-1 w-full h-full border-0"
          title={runningItem.name}
          allow="fullscreen"
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full text-foreground relative overflow-hidden flex flex-row">
      <ParticleBackground />
      
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 min-h-0 relative ml-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto px-8 pt-12 pb-12 scroll-smooth"
            >
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center min-h-[80vh]">
                <div className="flex-1 space-y-8 lg:sticky lg:top-12 self-center lg:self-auto text-center lg:text-left">
                  <div className="relative inline-block">
                    <motion.h1 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#3500ff] to-[#af00ff] tracking-tighter drop-shadow-[0_0_30px_rgba(53,0,255,0.5)] font-display"
                    >
                      PULSE
                      <span className="text-2xl md:text-3xl ml-4 align-top text-accent tracking-widest font-light opacity-80">
                        [BETA]
                      </span>
                    </motion.h1>
                  </div>
                  
                  <div className="flex flex-col lg:items-start items-center gap-4">
                    <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(53,0,255,0.2)]">
                      <span className="font-mono text-primary/80 tracking-[0.2em] text-sm">
                        V2.0.0
                      </span>
                    </div>
                    
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
                    
                    <p className="text-xl md:text-2xl font-light tracking-wide text-blue-200/80 font-display">
                      Given away to Trenton
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-96 space-y-6">
                  <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 px-2 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    Latest News
                  </h3>
                  <div className="flex flex-col gap-4">
                    {news.map((item) => (
                      <div key={item.id} className="glass-panel p-6 rounded-3xl hover:bg-white/5 transition-all border border-white/10 bg-white/5 group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.title}</h4>
                          <span className="text-[10px] font-mono text-white/30 uppercase">{item.date}</span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed relative z-10">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gaming' && (
            <motion.div 
              key="gaming"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 overflow-y-auto px-8 pt-12 pb-12 scroll-smooth"
            >
              <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 mb-2 uppercase tracking-tight">Game Center</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Selected Titles for Trenton</p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-10 max-w-full">
                  {games.map((game: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleLaunch(game)}
                      className="group relative flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-2 w-full"
                    >
                      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 glass-panel group-hover:border-primary/50 transition-all shadow-2xl group-hover:shadow-primary/20">
                        <img src={game.img} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <span className="text-[10px] font-mono text-white tracking-[0.4em] uppercase">Launch</span>
                        </div>
                      </div>
                      <span className="text-white/60 font-display text-sm md:text-base uppercase tracking-widest group-hover:text-primary group-hover:text-glow transition-all text-center px-2 truncate w-full">
                        {game.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'browser' && (
            <motion.div 
              key="browser"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col pt-8 pb-8 px-8"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                <iframe 
                  src="https://ultraviolet-vercel-five.vercel.app" 
                  className="w-full h-full border-0"
                  title="Internet Browser"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'app' && (
            <motion.div 
              key="app"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 overflow-y-auto px-8 pt-12 pb-12 scroll-smooth"
            >
              <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 mb-2 uppercase tracking-tight">Applications</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Utility & Entertainment Suite</p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-10 max-w-full">
                  {apps.map((app: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleLaunch(app)}
                      className="group relative flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-2 w-full"
                    >
                      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 glass-panel group-hover:border-primary/50 transition-all shadow-2xl group-hover:shadow-primary/20">
                        <img src={app.img} alt={app.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <span className="text-[10px] font-mono text-white tracking-[0.4em] uppercase">Open App</span>
                        </div>
                      </div>
                      <span className="text-white/60 font-display text-sm md:text-base uppercase tracking-widest group-hover:text-primary group-hover:text-glow transition-all text-center px-2 truncate w-full">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col pt-8 pb-8 px-8"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <iframe 
                  src="https://officialsc.vercel.app" 
                  className="w-full h-full border-0"
                  title="Shadow Chat"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'more' && (
            <motion.div 
              key="more"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col pt-12 pb-12 px-8 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-10 rounded-[2.5rem]">
                  <div className="flex items-center gap-3 mb-8">
                    <Palette className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold font-display uppercase tracking-tight">Interface</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => setTheme('default')}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all ${theme === 'default' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5'} border-2`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3500ff] to-[#af00ff] border border-white/20 shadow-[0_0_10px_rgba(53,0,255,0.5)]" />
                        <span className="font-display uppercase text-sm tracking-widest">Pulse V2</span>
                      </div>
                      {theme === 'default' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                    <button 
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all ${theme === 'light' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5'} border-2`}
                    >
                      <div className="flex items-center gap-4">
                        <Sun className="w-6 h-6 text-yellow-500" />
                        <span className="font-display uppercase text-sm tracking-widest">Solarized</span>
                      </div>
                      {theme === 'light' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all ${theme === 'dark' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5'} border-2`}
                    >
                      <div className="flex items-center gap-4">
                        <Moon className="w-6 h-6 text-white" />
                        <span className="font-display uppercase text-sm tracking-widest">Deep Space</span>
                      </div>
                      {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] flex flex-col justify-center gap-6">
                  <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-red-500" />
                        <span className="font-display uppercase text-sm tracking-widest">Panic System</span>
                      </div>
                      <button 
                        onClick={() => setPanicEnabled(!panicEnabled)}
                        className={`w-14 h-7 rounded-full transition-all relative ${panicEnabled ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 bottom-1 w-5 rounded-full bg-white transition-all ${panicEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    {panicEnabled && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col gap-4 pt-4 border-t border-white/5"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Stealth Redirect URL</label>
                          <input 
                            type="text"
                            value={panicUrl}
                            onChange={(e) => setPanicUrl(e.target.value)}
                            placeholder="https://google.com"
                            className="w-full bg-white/5 border-2 border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-primary/50 transition-all font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                          <span className="text-xs text-white/60 uppercase tracking-widest font-display">Trigger Key</span>
                          <button 
                            onClick={() => setIsSettingPanicKey(true)}
                            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono transition-all border border-primary/20"
                          >
                            {isSettingPanicKey ? 'WAITING...' : panicKey.toUpperCase()}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => window.open('https://discord.gg/MqcHwuaYfM1', '_blank')}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-[#5865F2] hover:bg-[#4752C4] transition-all text-white shadow-xl hover:shadow-[#5865F2]/20"
                    >
                      <Disc className="w-8 h-8" />
                      <span className="font-display text-[10px] uppercase tracking-widest font-bold">Discord</span>
                    </button>
                    <button 
                      onClick={() => {
                        const dmcaText = `DMCA Policy: Please note that I don't claim ownership for any games...`;
                        alert(dmcaText);
                      }}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-white"
                    >
                      <Shield className="w-8 h-8" />
                      <span className="font-display text-[10px] uppercase tracking-widest font-bold">DMCA</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showAnnouncement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass-panel p-8 rounded-[3rem] relative border-2 border-primary/20 shadow-[0_0_50px_rgba(53,0,255,0.3)]"
            >
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-black border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(53,0,255,0.5)] animate-pulse">
                  <span className="text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-[#3500ff] to-[#af00ff]">P</span>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-display text-white tracking-tight uppercase">Shadow is now Pulse!</h2>
                  <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
                </div>
                
                <p className="text-white/60 leading-relaxed">
                  We've upgraded our systems to bring you a faster, more secure, and more beautiful experience. Welcome to the future of web gaming.
                </p>
                
                <button 
                  onClick={() => setShowAnnouncement(false)}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-bold font-display uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}