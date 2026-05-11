import { LayoutDashboard, Calendar, BarChart2, User, Plus, StickyNote, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onPlusClick: () => void;
}

export function Navigation({ activeTab, onTabChange, onPlusClick }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-50 flex justify-center pointer-events-none">
      <div className="bg-[#0A0A0B]/80 backdrop-blur-2xl rounded-2xl px-4 py-2 flex items-center shadow-2xl border border-white/5 pointer-events-auto">
        <NavButton active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} icon={<LayoutDashboard size={20} />} label="Home" />
        <NavButton active={activeTab === 'calendar'} onClick={() => onTabChange('calendar')} icon={<Calendar size={20} />} label="Jadwal" />
        <NavButton active={activeTab === 'notes'} onClick={() => onTabChange('notes')} icon={<StickyNote size={20} />} label="Notes" />
        
        <button 
          onClick={onPlusClick}
          className="mx-2 w-12 h-12 bg-accent-primary hover:bg-accent-secondary text-white rounded-xl flex items-center justify-center shadow-lg shadow-accent-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>

        <NavButton active={activeTab === 'stats'} onClick={() => onTabChange('stats')} icon={<BarChart2 size={20} />} label="Stats" />
        <NavButton active={activeTab === 'schedule'} onClick={() => onTabChange('schedule')} icon={<BookOpen size={20} />} label="Mapel" />
        <NavButton active={activeTab === 'profile'} onClick={() => onTabChange('profile')} icon={<User size={20} />} label="Profil" />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all",
        active ? "text-white" : "text-slate-500 hover:text-slate-300"
      )}
    >
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 bg-white/5 rounded-xl -z-10"
        />
      )}
      <div className={cn("transition-transform flex items-center gap-2", active && "scale-105")}>
        {active && <div className="w-1 h-1 rounded-full bg-accent-primary absolute -bottom-1" />}
        {icon}
      </div>
      <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">{label}</span>
    </button>
  );
}
