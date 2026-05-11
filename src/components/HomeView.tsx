import { useState } from 'react';
import { Task, Category, Priority, CATEGORIES } from '../types';
import { Search, Filter, SlidersHorizontal, ChevronRight, Quote } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface HomeViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onEdit: (task: Task) => void;
  quote: string;
}

export function HomeView({ tasks, onToggle, onDelete, onDuplicate, onArchive, onEdit, quote }: HomeViewProps) {
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'upcoming' | 'done'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'newest'>('deadline');

  const filteredTasks = tasks.filter(task => {
    // Basic search
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    // Category filter
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

    // Archive check (Don't show archived in home unless explicit)
    if (task.status === 'archived') return false;

    // Tabs
    const today = new Date().toISOString().split('T')[0];
    const taskDate = task.deadline.split('T')[0];

    if (filterTab === 'today') return taskDate === today && task.status !== 'done';
    if (filterTab === 'upcoming') return taskDate > today && task.status !== 'done';
    if (filterTab === 'done') return task.status === 'done';
    
    return true;
  }).sort((a, b) => {
    if (sortBy === 'deadline') return a.deadline.localeCompare(b.deadline);
    if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
    if (sortBy === 'priority') {
      const pMap = { high: 0, medium: 1, low: 2 };
      return pMap[a.priority] - pMap[b.priority];
    }
    return 0;
  });

  return (
    <div className="pb-32">
      {/* Header & Quote */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">Selamat Datang!</h1>
        <div className="bg-accent-primary/5 border border-accent-primary/10 rounded-2xl p-6 flex gap-4 transition-colors">
          <Quote className="w-8 h-8 text-accent-primary shrink-0 opacity-50" />
          <p className="text-slate-500 dark:text-slate-400 italic text-sm leading-relaxed">
            "{quote}"
          </p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks, tags, or deadlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <SortButton active={sortBy === 'deadline'} onClick={() => setSortBy('deadline')} label="Deadline" />
          <SortButton active={sortBy === 'priority'} onClick={() => setSortBy('priority')} label="Prioritas" />
          <SortButton active={sortBy === 'newest'} onClick={() => setSortBy('newest')} label="Terbaru" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <TabButton active={filterTab === 'all'} onClick={() => setFilterTab('all')} label="All Items" />
        <TabButton active={filterTab === 'today'} onClick={() => setFilterTab('today')} label="Today" />
        <TabButton active={filterTab === 'upcoming'} onClick={() => setFilterTab('upcoming')} label="Upcoming" />
        <TabButton active={filterTab === 'done'} onClick={() => setFilterTab('done')} label="Archive" />
      </div>

      {/* Categories Horizontal */}
      <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            "shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
            categoryFilter === 'all' 
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white" 
              : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500"
          )}
        >
          Semua
        </button>
        {(Object.keys(CATEGORIES) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
              categoryFilter === cat 
                ? "bg-blue-600 text-white border-blue-600" 
                : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500"
            )}
          >
            {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <TaskCard
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onArchive={onArchive}
                  onEdit={onEdit}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Tidak ada tugas</h3>
              <p className="text-gray-400 text-sm">Coba ubah filter atau cari dengan kata kunci lain.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  function TabButton({ active, onClick, label, count, color }: { active: boolean, onClick: () => void, label: string, count?: number, color?: string }) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0",
          active 
            ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-lg shadow-black/5" 
            : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
        )}
      >
        {label}
      </button>
    );
  }

  function SortButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2",
          active 
            ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary shadow-sm" 
            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
        )}
      >
        <SlidersHorizontal className="w-3 h-3" />
        {label}
      </button>
    );
  }
}
