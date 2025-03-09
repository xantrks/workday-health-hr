import { FlowLevel, IconInfo } from './types';

// 症状图标映射
export const SYMPTOM_ICONS: Record<string, IconInfo> = {
  cramps: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-1.5-4.5 0-6.5"></path><path d="M15.5 14.5A2.5 2.5 0 0 1 13 12c0-1.38.5-2 1-3 1.072-2.143 1.5-4.5 0-6.5"></path><path d="M8 9h8"></path><path d="M8 6h8"></path><path d="M8 19a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1Z"></path></svg>`,
    label: "Cramps",
    color: "text-red-500 bg-red-100"
  },
  headache: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M16 12v4"></path><path d="M12 12v4"></path><path d="M8 12v4"></path><path d="M20 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z"></path><path d="M16 6V4.5C16 3.1 14.9 2 13.5 2h-3C9.1 2 8 3.1 8 4.5V6"></path><path d="M8 10a4 4 0 0 1 8 0"></path><path d="M8 18H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"></path></svg>`,
    label: "Headache",
    color: "text-accent bg-accent/10"
  },
  bloating: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 15v1a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-1"></path><circle cx="12" cy="12" r="4"></circle><path d="M9 10v1"></path><path d="M15 10v1"></path></svg>`,
    label: "Bloating",
    color: "text-blue-500 bg-blue-100"
  },
  fatigue: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>`,
    label: "Fatigue",
    color: "text-purple-500 bg-purple-100"
  },
  mood: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 13v-1h6v1"></path><path d="M11 16v-4"></path><path d="M9 16h4"></path></svg>`,
    label: "Mood Swings",
    color: "text-pink-500 bg-pink-100"
  },
  appetite: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>`,
    label: "Appetite Changes",
    color: "text-green-500 bg-green-100"
  },
  swelling: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M10 2h4"></path><path d="M12 14v-4"></path><path d="M4 14a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8z"></path><circle cx="12" cy="14" r="4"></circle></svg>`,
    label: "Swelling",
    color: "text-orange-500 bg-orange-100"
  },
  default: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7a5 5 0 0 0-5-5 8 8 0 0 1-5-2 8 8 0 0 1-5 2 5 5 0 0 0-5 5Z"></path></svg>`,
    label: "Symptoms",
    color: "text-indigo-500 bg-indigo-100"
  }
};

// 情绪图标映射
export const MOOD_ICONS: Record<string, IconInfo> = {
  happy: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><path d="M10 9h.01"></path><path d="M14 9h.01"></path></svg>`,
    label: "Happy",
    color: "text-primary bg-primary/10"
  },
  calm: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="m3 17 2 2 4-4"></path><path d="m9 11 2 2 4-4"></path><path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="M9 6v12"></path><path d="M9 10a3 3 0 0 0-3 3c0 2.8 2 6 6 6s6-3.2 6-6a3 3 0 0 0-3-3h-6Z"></path></svg>`,
    label: "Calm",
    color: "text-sky-500 bg-sky-100"
  },
  sad: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><path d="M10 9h.01"></path><path d="M14 9h.01"></path></svg>`,
    label: "Sad",
    color: "text-blue-500 bg-blue-100"
  },
  anxious: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M14.15 4.74 12 2.59l-2.15 2.15L8.67 3.56 12 .23l3.33 3.33Z"></path><path d="m16.79 10.85 2.15-2.15-2.15-2.15 1.18-1.18 3.33 3.33-3.33 3.33Z"></path><path d="m3.85 10.85 2.15-2.15-2.15-2.15L5.03 5.37 8.36 8.7 5.03 12.03Z"></path><path d="M14.15 19.26 12 21.41l-2.15-2.15-1.18 1.18L12 23.77l3.33-3.33Z"></path><line x1="12" x1="12" y1="8" y2="16"></line><line x1="8" x1="16" y1="12" y2="12"></line></svg>`,
    label: "Anxious",
    color: "text-purple-500 bg-purple-100"
  },
  irritable: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M8 2h8"></path><path d="M12 14v-4"></path><path d="M9 14h6"></path><path d="M5 22 2 19"></path><path d="M22 2 2 22"></path><path d="m17 7 3 3"></path><path d="m14 10 6 6"></path><path d="M7 17a5 5 0 0 0-5 5"></path></svg>`,
    label: "Irritable",
    color: "text-amber-500 bg-amber-100"
  },
  tired: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path><path d="M8 7h6"></path><path d="M8 11h8"></path></svg>`,
    label: "Tired",
    color: "text-teal-500 bg-teal-100"
  },
  default: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-1.5-4.5 0-6.5"></path><path d="M15.5 14.5A2.5 2.5 0 0 1 13 12c0-1.38.5-2 1-3 1.072-2.143 1.5-4.5 0-6.5"></path><path d="M8 9h8"></path><path d="M8 6h8"></path><path d="M9 22h6"></path><path d="M12 17v5"></path></svg>`,
    label: "Mood",
    color: "text-yellow-500 bg-yellow-100"
  }
};

// 流量级别定义
export const FLOW_LEVELS: FlowLevel[] = [
  { value: 1, label: "Light", color: "rgba(254, 226, 226, 0.8)", dotClass: "bg-red-400" },
  { value: 2, label: "Moderate Light", color: "rgba(254, 215, 215, 0.8)", dotClass: "bg-red-450" },
  { value: 3, label: "Moderate", color: "rgba(254, 202, 202, 0.8)", dotClass: "bg-red-500" },
  { value: 4, label: "Moderate Heavy", color: "rgba(253, 180, 180, 0.8)", dotClass: "bg-red-550" },
  { value: 5, label: "Heavy", color: "rgba(252, 165, 165, 0.8)", dotClass: "bg-red-600" }
]; 