import { Task, CATEGORIES, PRIORITIES } from '../types';
import { Card } from './ui/Card';
import { CheckCircle2, Circle, Clock, MoreVertical, Copy, RotateCcw, Archive, Trash2, Edit2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onEdit: (task: Task) => void;
  onRestore?: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete, onDuplicate, onArchive, onEdit, onRestore }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const category = CATEGORIES[task.category];
  const priority = PRIORITIES[task.priority];
  const deadlineDate = new Date(task.deadline);
  const daysLeft = differenceInDays(deadlineDate, new Date());
  
  const isExpired = daysLeft < 0 && task.status !== 'done';
  const isUrgent = daysLeft >= 0 && daysLeft <= 2 && task.status !== 'done';

  return (
    <Card className={cn(
      "relative overflow-hidden group",
      task.status === 'done' && "opacity-60"
    )}>
      <div className="flex items-start gap-4">
        <button 
          onClick={() => onToggle(task.id)}
          className="mt-1 transition-transform active:scale-90"
        >
          {task.status === 'done' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-white/20 hover:border-accent-primary transition-all group-hover:bg-accent-primary/10" />
          )}
        </button>

        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.label}
            </span>
            <span 
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${priority.color}20`, color: priority.color }}
            >
              {priority.label}
            </span>
          </div>

          <h3 className={cn(
            "text-base font-medium text-slate-900 dark:text-white mb-1 transition-colors",
            task.status === 'done' && "line-through text-slate-400 dark:text-white/50"
          )}>
            {task.title}
          </h3>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className={cn(
              "flex items-center gap-1",
              isExpired ? "text-rose-400" : isUrgent ? "text-amber-400" : "text-slate-500"
            )}>
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">{format(deadlineDate, 'd MMM yyyy', { locale: id })}</span>
              {daysLeft >= 0 && <span className="opacity-70 ml-1">({daysLeft} days)</span>}
              {isExpired && <span className="font-mono text-[10px] ml-1">[LATE]</span>}
            </div>
          </div>
        </div>

        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-rose-500/70 hover:text-rose-500"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-bg-sidebar rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 z-20 overflow-hidden"
                >
                  <MenuItem icon={<Edit2 className="w-4 h-4" />} label="Edit" onClick={() => onEdit(task)} />
                  <MenuItem icon={<Copy className="w-4 h-4" />} label="Duplicate" onClick={() => onDuplicate(task.id)} />
                  {task.status === 'archived' ? (
                    <MenuItem icon={<RotateCcw className="w-4 h-4" />} label="Restore" onClick={() => onRestore?.(task.id)} />
                  ) : (
                    <MenuItem icon={<Archive className="w-4 h-4" />} label="Archive" onClick={() => onArchive(task.id)} />
                  )}
                  <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                  <MenuItem 
                    icon={<Trash2 className="w-4 h-4 text-rose-500" />} 
                    label="Delete Forever" 
                    className="text-rose-500" 
                    onClick={() => onDelete(task.id)} 
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isUrgent && <div className="absolute top-0 right-0 w-2 h-full bg-orange-500/20" />}
      {isExpired && <div className="absolute top-0 right-0 w-2 h-full bg-red-500/20" />}
    </Card>
  );

  function MenuItem({ icon, label, onClick, className }: { icon: any, label: string, onClick: () => void, className?: string }) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); setShowMenu(false); }}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300",
          className
        )}
      >
        {icon}
        {label}
      </button>
    );
  }
}
