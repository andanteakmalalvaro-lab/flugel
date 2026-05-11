import { UserProfile } from '../types';
import { db } from '../services/db';
import { Card } from './ui/Card';
import { User, Shield, Bell, Moon, Sun, Palette, LogOut, Camera, ChevronRight, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface ProfileViewProps {
  profile: any; // Using any for simplicity in this demo profile
  onUpdate: (profile: any) => void;
  onClearData: () => void;
}

export function ProfileView({ profile, onUpdate, onClearData }: ProfileViewProps) {
  const [isDarkMode, setIsDarkMode] = useState(profile.isDarkMode);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(profile.notificationsEnabled ?? true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedAvatar, setEditedAvatar] = useState(profile.avatar || '');

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    onUpdate({ ...profile, isDarkMode: newMode });
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const toggleNotifications = async () => {
    const newMode = !isNotificationsEnabled;
    
    if (newMode) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setIsNotificationsEnabled(true);
          onUpdate({ ...profile, notificationsEnabled: true });
          new Notification("Flügel", { 
            body: "Notifikasi telah diaktifkan! Anda akan menerima update dari aplikasi.",
            icon: "/favicon.ico"
          });
        } else {
          alert("Izin notifikasi ditolak. Silakan aktifkan di pengaturan browser Anda.");
        }
      } else {
        alert("Browser Anda tidak mendukung notifikasi.");
      }
    } else {
      setIsNotificationsEnabled(false);
      onUpdate({ ...profile, notificationsEnabled: false });
    }
  };

  const handleSave = () => {
    onUpdate({ ...profile, name: editedName, avatar: editedAvatar });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col items-center py-8">
        <div className="relative mb-4 group">
          <div className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden bg-slate-100 dark:bg-white/10 flex items-center justify-center">
            {editedAvatar || profile.avatar ? (
              <img src={editedAvatar || profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent-primary/20 text-accent-primary text-4xl font-black italic">
                {(editedName || profile.name)[0]}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-1 right-1 bg-slate-900 dark:bg-white text-white dark:text-black p-2 rounded-full shadow-lg border border-white/5 hover:scale-110 transition-transform"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {isEditing ? (
          <div className="w-full max-w-xs space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Username</label>
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full py-3 px-4 text-sm text-slate-900 dark:text-white rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                placeholder="Enter your name..."
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Avatar URL</label>
              <input 
                type="text" 
                value={editedAvatar} 
                onChange={(e) => setEditedAvatar(e.target.value)}
                className="w-full py-3 px-4 text-sm text-slate-900 dark:text-white rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-accent-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-accent-primary/20 active:scale-95 transition-all"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(profile.name);
                  setEditedAvatar(profile.avatar || '');
                }}
                className="px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-bold border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center group cursor-pointer" onClick={() => setIsEditing(true)}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              {profile.name}
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Productivity Enthusiast</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Settings</h3>
        
        <Card className="p-0 overflow-hidden bg-white dark:bg-bg-sidebar border border-slate-100 dark:border-white/5">
          <MenuLink icon={<Moon className="text-indigo-500 dark:text-indigo-400" size={18} />} label="Dark Appearance" toggle active={isDarkMode} onToggle={toggleDarkMode} />
          <Divider />
          <MenuLink icon={<Palette className="text-rose-500 dark:text-rose-400" size={18} />} label="Accent Palette" value="Indigo" />
          <Divider />
          <MenuLink icon={<Bell className="text-amber-500 dark:text-amber-400" size={18} />} label="Notifications" toggle active={isNotificationsEnabled} onToggle={toggleNotifications} />
        </Card>

        <button className="w-full py-4 flex items-center justify-center gap-2 text-rose-500 font-bold border border-rose-500/20 rounded-2xl mt-8 active:scale-[0.98] transition-all bg-rose-500/5 hover:bg-rose-500/10 dark:hover:bg-rose-500/10">
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>

      <div className="text-center py-8 text-gray-400 text-xs">
        <p>Flügel v1.0.0 (Premium)</p>
        <p>© 2026 Creative Academy Project</p>
      </div>
    </div>
  );

  function MenuLink({ icon, label, value, toggle, active, onToggle, onClick, className }: any) {
    return (
      <div 
        onClick={onClick}
        className={cn(
          "px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
            {icon}
          </div>
          <span className="font-semibold dark:text-gray-200">{label}</span>
        </div>
        
        {toggle ? (
           <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={cn(
              "w-12 h-7 rounded-full p-1 transition-colors",
              active ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            )}
           >
             <div className={cn("w-5 h-5 bg-white rounded-full transition-transform", active && "translate-x-5")} />
           </button>
        ) : (
          <div className="flex items-center gap-2">
            {value && <span className="text-sm text-gray-400">{value}</span>}
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        )}
      </div>
    );
  }

  function Divider() {
    return <div className="h-px bg-gray-100 dark:bg-gray-800 mx-6" />;
  }
}
