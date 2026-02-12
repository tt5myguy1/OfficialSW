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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pb-2">
      <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative group flex items-center justify-center p-2 rounded-full transition-all duration-300",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )}
              aria-label={tab.label}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]",
                  isActive ? "scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" : "opacity-80 group-hover:opacity-100"
                )} 
              />
              
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-white/70 font-display">
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
