/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'school' | 'personal' | 'org' | 'work' | 'project' | 'exam';
export type TaskStatus = 'todo' | 'done' | 'archived';
export type Tab = 'dashboard' | 'calendar' | 'notes' | 'schedule' | 'stats' | 'profile';

export interface ScheduleItem {
  id: string;
  subject: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  startTime: string; // HH:mm
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  deadline: string; // ISO string
  reminderTime?: string; // ISO string
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  status: TaskStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface UserProfile {
  name: string;
  avatar?: string;
  dailyTarget: number;
  themeColor: string;
  isDarkMode: boolean;
}

export const CATEGORIES: Record<Category, { label: string; color: string; icon: string }> = {
  school: { label: 'Study', color: '#818CF8', icon: 'BookOpen' },
  personal: { label: 'Self', color: '#10B981', icon: 'User' },
  org: { label: 'Teams', color: '#818CF8', icon: 'Users' },
  work: { label: 'Design', color: '#F59E0B', icon: 'Briefcase' },
  project: { label: 'Projects', color: '#F43F5E', icon: 'Layers' },
  exam: { label: 'Exams', color: '#F43F5E', icon: 'FileText' },
};

export const PRIORITIES: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: '#94A3B8' },
  medium: { label: 'Medium', color: '#F59E0B' },
  high: { label: 'High', color: '#F43F5E' },
};
