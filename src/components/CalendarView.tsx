import { Task } from '../types';
import { Card } from './ui/Card';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function CalendarView({ tasks, onToggle, onDelete, onDuplicate, onArchive, onEdit }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  const selectedTasks = tasks.filter(t => isSameDay(new Date(t.deadline), selectedDate) && t.status !== 'archived');

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold dark:text-white">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 mb-4">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const hasTask = tasks.some(t => isSameDay(new Date(t.deadline), day) && t.status !== 'archived');
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all",
                  i === 0 && `col-start-${day.getDay() + 1}`,
                  isSelected 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
              >
                <span className="text-sm font-bold">{format(day, 'd')}</span>
                {hasTask && !isSelected && (
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <h3 className="font-bold dark:text-white">
            Tugas untuk {format(selectedDate, 'd MMMM', { locale: id })}
          </h3>
        </div>

        {selectedTasks.length > 0 ? (
          selectedTasks.map(task => (
            <div key={task.id}>
              <TaskCard 
                task={task} 
                onToggle={onToggle} 
                onDelete={onDelete} 
                onDuplicate={onDuplicate} 
                onArchive={onArchive} 
                onEdit={onEdit} 
              />
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm italic">
            Tidak ada tugas untuk hari ini.
          </div>
        )}
      </div>
    </div>
  );
}
