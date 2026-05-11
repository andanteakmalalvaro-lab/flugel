/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, UserProfile, Note, ScheduleItem } from '../types';

const STORAGE_KEYS = {
  TASKS: 'velotask_tasks',
  NOTES: 'velotask_notes',
  SCHEDULE: 'velotask_schedule',
  PROFILE: 'velotask_profile',
};

export const db = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getSchedule: (): ScheduleItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveSchedule: (schedule: ScheduleItem[]) => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },

  getProfile: (): UserProfile => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const defaultProfile: UserProfile = {
      name: 'User',
      dailyTarget: 5,
      themeColor: '#3B82F6',
      isDarkMode: false,
    };
    if (!data) return defaultProfile;
    try {
      return { ...defaultProfile, ...JSON.parse(data) };
    } catch {
      return defaultProfile;
    }
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },
};
