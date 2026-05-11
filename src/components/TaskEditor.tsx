import { useState, useEffect } from 'react';
import { Task, Category, Priority, CATEGORIES, PRIORITIES } from '../types';
import { X, Calendar, Bell, Mic, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/ai';
import { cn } from '../lib/utils';

interface TaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialTask?: Task | null;
}

export function TaskEditor({ isOpen, onClose, onSave, initialTask }: TaskEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [isListening, setIsListening] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setDeadline(initialTask.deadline.split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setCategory('personal');
      setPriority('medium');
      setDeadline(new Date().toISOString().split('T')[0]);
    }
  }, [initialTask, isOpen]);

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser Anda tidak mendukung input suara.");
      return;
    }

    // @ts-ignore
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsAiProcessing(true);
      const parsed = await aiService.parseVoiceTask(transcript);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.description) setDescription(parsed.description);
      if (parsed.category) setCategory(parsed.category as Category);
      if (parsed.priority) setPriority(parsed.priority as Priority);
      if (parsed.deadline) setDeadline(parsed.deadline);
      setIsAiProcessing(false);
    };
    recognition.start();
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title,
      description,
      category,
      priority,
      deadline: new Date(deadline).toISOString(),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0A0A0B] border-t border-white/5 rounded-t-[32px] p-8 z-[101] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {initialTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl font-semibold bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-700 text-white"
                />
                <button 
                  onClick={handleVoiceInput}
                  disabled={isAiProcessing}
                  className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
                    isListening ? "bg-rose-500 text-white animate-pulse" : "bg-accent-primary/10 text-accent-primary"
                  )}
                >
                  {isAiProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              <textarea
                placeholder="Details or description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-accent-primary/30 text-slate-300"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-indigo-400" /> Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white px-3 py-2 focus:ring-1 focus:ring-accent-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white px-3 py-2 appearance-none focus:ring-1 focus:ring-accent-primary/30"
                  >
                    {Object.entries(PRIORITIES).map(([val, info]) => (
                      <option key={val} value={val} className="bg-[#0A0A0B]">{info.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Spaces</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        category === cat 
                          ? "bg-white text-black border-white" 
                          : "bg-white/5 border-white/10 text-slate-500 hover:border-white/30"
                      )}
                    >
                      {CATEGORIES[cat].label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="w-full py-4 bg-accent-primary disabled:bg-white/5 text-white disabled:text-slate-700 rounded-2xl font-bold shadow-lg shadow-accent-primary/20 active:scale-[0.98] transition-all"
              >
                {initialTask ? 'Commit Changes' : 'Launch Task'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
