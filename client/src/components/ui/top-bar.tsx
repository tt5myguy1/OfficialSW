import { motion } from "framer-motion";
import { Home, Gamepad2, Globe, LayoutGrid, MoreHorizontal, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = 'home' | 'gaming' | 'browser' | 'app' | 'chat' | 'more';

interface TopBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  const tabs: Array<{ id: TabId; icon: React.ElementType; label: string }> = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming' },
    { id: 'browser', icon: Globe, label: 'Browser' },
    { id: 'app', icon: LayoutGrid, label: 'Apps' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-center pl-4 pr-2">
      <div className="glass-panel py-6 px-3 rounded-full flex flex-col items-center gap-6 border-2 border-primary/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative group flex items-center justify-center p-3 rounded-full transition-all duration-300",
                isActive ? "bg-primary/20 shadow-[0_0_20px_rgba(53,0,255,0.3)]" : "hover:bg-white/5"
              )}
              aria-label={tab.label}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive ? "text-primary scale-125 drop-shadow-[0_0_15px_rgba(53,0,255,0.7)]" : "text-white/60 group-hover:text-white group-hover:opacity-100"
                )} 
              />
              
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -right-1 w-1 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(53,0,255,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-black/90 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white font-display font-bold">
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}