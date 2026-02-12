import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/ui/particle-background";
import { TopBar, type TabId } from "@/components/ui/top-bar";
import { Gamepad2, Globe, LayoutGrid, MoreHorizontal, Construction, MessageSquare, Sun, Moon, Palette, Shield, Disc } from "lucide-react";
import { games, apps } from "@/lib/index";

type Theme = 'default' | 'light' | 'dark';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [runningItem, setRunningItem] = useState<{ name: string; link: string } | null>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('shadow-theme') as Theme) || 'default');
  const [panicEnabled, setPanicEnabled] = useState(() => localStorage.getItem('shadow-panic-enabled') === 'true');
  const [panicKey, setPanicKey] = useState(() => localStorage.getItem('shadow-panic-key') || 'Escape');
  const [isSettingPanicKey, setIsSettingPanicKey] = useState(false);

  useEffect(() => {
    localStorage.setItem('shadow-theme', theme);
    localStorage.setItem('shadow-panic-enabled', panicEnabled.toString());
    localStorage.setItem('shadow-panic-key', panicKey);
  }, [theme, panicEnabled, panicKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSettingPanicKey) {
        setPanicKey(e.key);
        setIsSettingPanicKey(false);
        e.preventDefault();
        return;
      }
      if (panicEnabled && e.key === panicKey) {
        window.location.replace('https://clever.com');
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

  if (runningItem) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col">
        <div className="p-2 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md">
          <span className="text-white font-mono text-sm uppercase tracking-widest">{runningItem.name}</span>
          <button 
            onClick={() => setRunningItem(null)}
            className="px-4 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            EXIT
          </button>
        </div>
        <iframe 
          src={runningItem.link} 
          className="flex-1 w-full h-full border-0"
          title={runningItem.name}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full text-foreground relative overflow-hidden flex flex-col">
      <ParticleBackground />
      
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center p-12 overflow-y-auto"
            >
              <div className="text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />

                <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter drop-shadow-2xl mb-2 font-display">
                  SHADOW
                  <span className="text-2xl md:text-3xl ml-4 align-top text-primary tracking-widest font-light opacity-80">
                    [BETA]
                  </span>
                </h1>
                
                <div className="flex flex-col items-center gap-4 mt-8">
                  <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                    <span className="font-mono text-primary/80 tracking-[0.2em] text-sm">
                      V1.0.3
                    </span>
                  </div>
                  
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
                  
                  <p className="text-xl md:text-2xl font-light tracking-wide text-blue-200/80 font-display">
                    Given away to Trenton
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gaming' && (
            <motion.div 
              key="gaming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 overflow-y-auto px-8 pt-24 pb-12 scroll-smooth"
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-8 max-w-full">
                {games.map((game: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleLaunch(game)}
                    className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 w-full"
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-white/10 bg-white/5 glass-panel group-hover:border-white/30 transition-all shadow-xl">
                      <img src={game.img} alt={game.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white/80 font-display text-xs md:text-sm uppercase tracking-widest group-hover:text-white transition-colors text-center px-2 truncate w-full">
                      {game.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'browser' && (
            <motion.div 
              key="browser"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col pt-24 pb-8 px-8"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 overflow-y-auto px-8 pt-24 pb-12 scroll-smooth"
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-8 max-w-full">
                {apps.map((app: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleLaunch(app)}
                    className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 w-full"
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-white/10 bg-white/5 glass-panel group-hover:border-white/30 transition-all shadow-xl">
                      <img src={app.img} alt={app.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white/80 font-display text-xs md:text-sm uppercase tracking-widest group-hover:text-white transition-colors text-center px-2 truncate w-full">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col pt-24 pb-8 px-8"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
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
              className="absolute inset-0 flex flex-col pt-24 pb-12 px-8 overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold font-display">Theme Customizer</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => setTheme('default')}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${theme === 'default' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-transparent'} border`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#080c16] border border-white/20" />
                        <span>Default (Shadow)</span>
                      </div>
                      {theme === 'default' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                    <button 
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${theme === 'light' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-transparent'} border`}
                    >
                      <div className="flex items-center gap-3">
                        <Sun className="w-4 h-4" />
                        <span>Light Mode</span>
                      </div>
                      {theme === 'light' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${theme === 'dark' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-transparent'} border`}
                    >
                      <div className="flex items-center gap-3">
                        <Moon className="w-4 h-4" />
                        <span>Dark Mode</span>
                      </div>
                      {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center gap-4">
                  <div className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-red-500" />
                        <span className="font-bold">Panic Key</span>
                      </div>
                      <button 
                        onClick={() => setPanicEnabled(!panicEnabled)}
                        className={`w-12 h-6 rounded-full transition-all relative ${panicEnabled ? 'bg-red-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all ${panicEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    {panicEnabled && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-sm text-white/60">Trigger Key:</span>
                        <button 
                          onClick={() => setIsSettingPanicKey(true)}
                          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors border border-white/10"
                        >
                          {isSettingPanicKey ? 'PRESS ANY KEY...' : panicKey.toUpperCase()}
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => window.open('https://discord.gg/MqcHwuaYfM1', '_blank')}
                    className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] transition-all text-white font-bold"
                  >
                    <Disc className="w-5 h-5" />
                    <span>Join Discord</span>
                  </button>
                  <button 
                    onClick={() => {
                      const dmcaText = `DMCA Policy: Please note that I don't claim ownership for any games. If you believe that any copyright infringement exists on the Site, please use the following process to notify us. We will act expeditiously to remove infringing material once informed. All claims of copyright infringement should be in writing and should be directed to: E-mail: swsite@outlook.com Your notice must contain the following information: 

1) Your physical or electronic signature (as either the owner of an exclusive right that is allegedly infringed or as a person authorized to act on behalf of such owner). 
2) Identification of the copyrighted work claimed to have been infringed or, if multiple copyrighted works at a single online site are covered by a single claim, a representative list of such works at that online site. 
3) Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled and information reasonably sufficient to permit us to locate the material. 
4) Information reasonably sufficient to permit us to contact you, such as an address, telephone number and, if available, an electronic mail address. 
5) A statement that you believe in good faith that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law. 
6) A statement that the information in the notice is accurate and that, under penalty of perjury, you are the owner of an exclusive right that is allegedly infringed or are authorized to act on behalf of such owner.`;
                      alert(dmcaText);
                    }}
                    className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                  >
                    <Shield className="w-5 h-5" />
                    <span>DMCA Policy</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

function SectionPlaceholder({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center p-8 glass-panel rounded-3xl max-w-lg mx-4 border-white/5"
    >
      <div className="inline-flex p-6 rounded-full bg-white/5 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <Icon className="w-12 h-12 text-white/80" />
      </div>
      <h2 className="text-3xl font-bold mb-3 font-display text-white">{title}</h2>
      <p className="text-muted-foreground font-light">{description}</p>
      
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/80 text-xs font-mono">
          <Construction className="w-4 h-4" />
          <span>UNDER CONSTRUCTION</span>
        </div>
      </div>
    </motion.div>
  );
}
