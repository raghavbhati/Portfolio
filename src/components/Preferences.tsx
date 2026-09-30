import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface Preferences {
  theme: 'dark' | 'light' | 'system';
  font: 'editorial' | 'sans' | 'serif' | 'mono';
  background: 'neutral' | 'warm' | 'blue' | 'green';
  timezone: string;
}
interface PreferencesContextValue {
  preferences: Preferences;
  update: (key: keyof Preferences, value: string) => void;
  reset: () => void;
  status: string;
}
export const defaults: Preferences = {
  theme: 'dark',
  font: 'editorial',
  background: 'neutral',
  timezone: 'Asia/Kolkata',
};
const storageKey = 'portfolio-visitor-settings-v1';
const allowed: Record<keyof Preferences, readonly string[]> = {
  theme: ['dark', 'light', 'system'],
  font: ['editorial', 'sans', 'serif', 'mono'],
  background: ['neutral', 'warm', 'blue', 'green'],
  timezone: [
    'Asia/Kolkata',
    'local',
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
  ],
};
const fonts = {
  editorial: ["'DM Sans',Arial,sans-serif", "'Instrument Serif',Georgia,serif"],
  sans: ["'DM Sans',Arial,sans-serif", "'DM Sans',Arial,sans-serif"],
  serif: ['Georgia,serif', 'Georgia,serif'],
  mono: ['ui-monospace,Consolas,monospace', 'ui-monospace,Consolas,monospace'],
};
const colours = {
  neutral: ['#000000', '#fafaf9'],
  warm: ['#17120f', '#f7f0e6'],
  blue: ['#0d151d', '#edf3fa'],
  green: ['#101813', '#eef5ef'],
};
const PreferencesContext = createContext<PreferencesContextValue | null>(null);
export function readPreferences() {
  const result = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    (Object.keys(allowed) as (keyof Preferences)[]).forEach((key) => {
      if (saved && typeof saved[key] === 'string' && allowed[key].includes(saved[key]))
        Object.assign(result, { [key]: saved[key] });
    });
  } catch {}
  return result;
}
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPreferences);
  const [status, setStatus] = useState('Preferences are saved in this browser.');
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const light =
        preferences.theme === 'light' || (preferences.theme === 'system' && query.matches);
      document.body.dataset.theme = light ? 'light' : 'dark';
      document.body.style.setProperty('--bg', colours[preferences.background][light ? 1 : 0]);
      document.body.style.setProperty('--sans', fonts[preferences.font][0]);
      document.body.style.setProperty('--serif', fonts[preferences.font][1]);
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [preferences]);
  function save(next: Preferences, message: string) {
    setPreferences(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStatus(message);
    } catch {
      setStatus('Applied for this visit. Browser storage is unavailable.');
    }
  }
  function update(key: keyof Preferences, value: string) {
    if (allowed[key]?.includes(value))
      save({ ...preferences, [key]: value }, 'Preferences saved in this browser.');
  }
  function reset() {
    save({ ...defaults }, 'All preferences reset to the original design.');
  }
  return (
    <PreferencesContext.Provider value={{ preferences, update, reset, status }}>
      {children}
    </PreferencesContext.Provider>
  );
}
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('PreferencesProvider is required');
  return context;
}
