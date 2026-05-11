import { Task, CATEGORIES } from '../types';
import { Card } from './ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Trophy, Zap, Target, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface StatsViewProps {
  tasks: Task[];
}

export function StatsView({ tasks }: StatsViewProps) {
  const completedTasks = tasks.filter(t => t.status === 'done');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const categoryData = Object.keys(CATEGORIES).map(cat => ({
    name: CATEGORIES[cat as keyof typeof CATEGORIES].label,
    value: tasks.filter(t => t.category === cat).length,
    color: CATEGORIES[cat as keyof typeof CATEGORIES].color
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6 pb-24">
      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
        Productivity Radar
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Completed</p>
          <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
          <div className="mt-2 text-[10px] text-emerald-400 font-medium">Updated just now</div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Total Tasks</p>
          <p className="text-2xl font-bold text-white">{totalTasks}</p>
          <div className="mt-2 text-[10px] text-accent-primary font-medium">{tasks.filter(t => t.priority === 'high').length} High Priority</div>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Weekly Progress</span>
          <span className="text-white font-bold">{completionRate}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            className="h-full bg-accent-primary shadow-[0_0_8px_rgba(129,140,248,0.5)]" 
          />
        </div>
      </Card>

      <Card>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[10px] bg-white/5 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name}</span>
              </div>
              <span className="font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
      
    </div>
  );
}
