/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ScheduleItem } from '../types';
import { Card } from './ui/Card';
import { Plus, Trash2, Clock, X, Info, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  onAdd: (item: Partial<ScheduleItem>) => void;
  onDelete: (id: string) => void;
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

export function ScheduleView({ schedule, onAdd, onDelete }: ScheduleViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState<ScheduleItem['day']>('Senin');
  const [startTime, setStartTime] = useState('08:00');

  const handleSave = () => {
    if (!subject.trim()) return;
    onAdd({ subject, day, startTime });
    setSubject('');
    setIsAdding(false);
  };

  const groupedSchedule = DAYS.reduce((acc, d) => {
    acc[d] = schedule
      .filter(item => item.day === d)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  // Define some pastel colors for the subjects to match the "colorful grid" vibe of the image
  const cardColors = [
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'bg-violet-500/20 text-violet-300 border-violet-500/30',
    'bg-sky-500/20 text-sky-300 border-sky-500/30',
  ];

  return (
    <div className="space-y-6 pb-40">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Jadwal Pelajaran</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">School Timetable</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-accent-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Mapel</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6">
        {DAYS.map((d) => (
          <div key={d} className="space-y-2">
            <div className="bg-white/5 border border-white/10 rounded-xl py-2 text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
            </div>
            
            <div className="space-y-2 min-h-[100px]">
              {groupedSchedule[d].length > 0 ? (
                groupedSchedule[d].map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "group relative rounded-xl p-3 transition-all border",
                      cardColors[idx % cardColors.length]
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold leading-tight pr-4 uppercase tracking-tighter line-clamp-2">{item.subject}</span>
                      <div className="flex items-center gap-1 opacity-70">
                        <Clock size={8} />
                        <span className="text-[9px] font-mono font-bold">{item.startTime}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md transition-all"
                    >
                      <Trash2 size={10} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="py-4 border border-dashed border-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Kosong</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-start gap-4">
        <div className="w-8 h-8 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-white uppercase tracking-wider">Tips Manajemen Jadwal</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Geser secara horizontal untuk melihat jadwal lengkap satu minggu (Senin-Sabtu). 
            Mata pelajaran otomatis diurutkan berdasarkan waktu mulai.
          </p>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0A0A0B] border-t border-white/5 rounded-t-[40px] p-10 z-[111] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Input Mapel</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Tambah mata pelajaran baru</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: Matematika, Fisika, Seni rupa..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full glass-input py-4 px-5 text-sm text-white rounded-2xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Hari AKTIF</label>
                    <div className="relative">
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value as ScheduleItem['day'])}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl text-sm text-white px-4 py-4 appearance-none focus:ring-2 focus:ring-accent-primary/20 transition-all outline-none"
                      >
                        {DAYS.map(d => <option key={d} value={d} className="bg-[#0A0A0B]">{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Waktu Mulai</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl text-sm text-white px-4 py-4 appearance-none focus:ring-2 focus:ring-accent-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!subject.trim()}
                  className="w-full py-5 bg-accent-primary disabled:bg-white/5 text-white disabled:text-slate-700 rounded-2xl font-bold shadow-xl shadow-accent-primary/30 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                >
                  Tambahkan ke Jadwal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
