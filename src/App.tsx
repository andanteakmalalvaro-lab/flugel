/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Task, UserProfile, Tab, Note, ScheduleItem } from './types';
import { db } from './services/db';
import { aiService } from './services/ai';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { StatsView } from './components/StatsView';
import { ProfileView } from './components/ProfileView';
import { CalendarView } from './components/CalendarView';
import { NotesView } from './components/NotesView';
import { ScheduleView } from './components/ScheduleView';
import { TaskEditor } from './components/TaskEditor';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Download, Filter, Bird } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(db.getProfile());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [quote, setQuote] = useState('Semangat belajarnya!');

  useEffect(() => {
    const loadedTasks = db.getTasks();
    const loadedNotes = db.getNotes();
    const loadedSchedule = db.getSchedule();
    setTasks(loadedTasks);
    setNotes(loadedNotes);
    setSchedule(loadedSchedule);
    
    const fetchQuote = async () => {
      const q = await aiService.getDailyQuote();
      setQuote(q);
    };
    fetchQuote();

    if (profile.isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Simulate loading for aesthetic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    db.saveTasks(newTasks);
  };

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    db.saveNotes(newNotes);
  };

  const saveSchedule = (newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    db.saveSchedule(newSchedule);
  };

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title || '',
      description: taskData.description || '',
      category: taskData.category || 'personal',
      priority: taskData.priority || 'medium',
      deadline: taskData.deadline || new Date().toISOString(),
      isRecurring: false,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTasks([newTask, ...tasks]);
  };

  const addNote = (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: noteData.title || '',
      content: noteData.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const addScheduleItem = (itemData: Partial<ScheduleItem>) => {
    const newItem: ScheduleItem = {
      id: crypto.randomUUID(),
      subject: itemData.subject || '',
      day: itemData.day || 'Senin',
      startTime: itemData.startTime || '08:00',
    };
    saveSchedule([...schedule, newItem]);
  };

  const deleteScheduleItem = (id: string) => {
    saveSchedule(schedule.filter(s => s.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const duplicateTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newTask = { 
        ...task, 
        id: crypto.randomUUID(), 
        title: `${task.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveTasks([newTask, ...tasks]);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Flügel - Daftar Tugas', 20, 20);
    doc.setFontSize(12);
    
    tasks.forEach((t, i) => {
      const y = 40 + (i * 10);
      doc.text(`${i + 1}. [${t.status.toUpperCase()}] ${t.title} - ${t.deadline.split('T')[0]}`, 20, y);
    });
    
    doc.save('flugel_export.pdf');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-center text-white mb-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 to-transparent" />
            <Bird className="w-12 h-12 text-white relative z-10" />
          </motion.div>
          <h2 className="text-4xl font-black mb-2 text-white tracking-tighter uppercase italic animate-pulse">Flügel</h2>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-6">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-full h-full bg-accent-primary"
            />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <HomeView 
            tasks={tasks}
            onToggle={(id) => {
              const t = tasks.find(x => x.id === id);
              updateTask(id, { status: t?.status === 'done' ? 'todo' : 'done' });
            }}
            onDelete={deleteTask}
            onDuplicate={duplicateTask}
            onArchive={(id) => updateTask(id, { status: 'archived' })}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditorOpen(true);
            }}
            quote={quote}
          />
        );
      case 'notes':
        return (
          <NotesView 
            notes={notes}
            onAdd={addNote}
            onDelete={deleteNote}
            onUpdate={updateNote}
          />
        );
      case 'schedule':
        return (
          <ScheduleView 
            schedule={schedule}
            onAdd={addScheduleItem}
            onDelete={deleteScheduleItem}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            tasks={tasks} 
            onToggle={(id) => {
              const t = tasks.find(x => x.id === id);
              updateTask(id, { status: t?.status === 'done' ? 'todo' : 'done' });
            }}
            onDelete={deleteTask}
            onDuplicate={duplicateTask}
            onArchive={(id) => updateTask(id, { status: 'archived' })}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditorOpen(true);
            }}
          />
        );
      case 'stats':
        return <StatsView tasks={tasks} />;
      case 'profile':
        return (
          <ProfileView 
            profile={profile} 
            onUpdate={(p) => { setProfile(p); db.saveProfile(p); }} 
            onClearData={() => {
              localStorage.clear();
              setTasks([]);
              setProfile(db.getProfile());
              alert('Semua data telah dihapus.');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-bg-main text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <div className="max-w-lg mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-900 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/5 dark:shadow-black/20">
              <Bird className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">Flügel</h1>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.34em]">Premium</span>
            </div>
          </div>
          {((!isLoading)) && (
            <button 
              onClick={exportToPDF}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLoading ? 'loading' : activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isLoading && (
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onPlusClick={() => {
            setEditingTask(null);
            setIsEditorOpen(true);
          }}
        />
      )}

      <TaskEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialTask={editingTask}
        onSave={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data as Task);
          } else {
            addTask(data);
          }
        }}
      />
    </div>
  );
}
