/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Note } from '../types';
import { Card } from './ui/Card';
import { Plus, Trash2, StickyNote, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface NotesViewProps {
  notes: Note[];
  onAdd: (note: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, note: Partial<Note>) => void;
}

export function NotesView({ notes, onAdd, onDelete, onUpdate }: NotesViewProps) {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    
    if (editingNote) {
      onUpdate(editingNote.id, { title, content });
    } else {
      onAdd({ title, content });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingNote(null);
    setIsAdding(false);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Notes</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari catatan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-input py-2.5 pl-12 pr-4 text-sm text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card 
                onClick={() => openEdit(note)}
                className="relative group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white truncate pr-8">{note.title || "Tanpa Judul"}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/10 rounded-lg transition-all text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-slate-400 line-clamp-3 mb-4">{note.content || "Tidak ada konten"}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <StickyNote size={10} />
                  {format(new Date(note.updatedAt), 'd MMM yyyy, HH:mm', { locale: id })}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNotes.length === 0 && !isAdding && (
         <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <StickyNote className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-slate-500 text-sm">Belum ada catatan.</p>
         </div>
      )}

      {/* Note Form Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0A0A0B] border-t border-white/5 rounded-t-[32px] p-8 z-[111] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">{editingNote ? 'Edit Catatan' : 'Catatan Baru'}</h2>
                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Judul catatan..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-700 text-white"
                />
                
                <textarea
                  placeholder="Tulis sesuatu..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[300px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-accent-primary/30 text-slate-300 resize-none"
                />

                <button
                  onClick={handleSave}
                  className="w-full py-4 bg-accent-primary text-white rounded-2xl font-bold shadow-lg shadow-accent-primary/20 active:scale-[0.98] transition-all"
                >
                  Simpan Catatan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
