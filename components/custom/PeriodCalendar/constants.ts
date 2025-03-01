import { FlowLevel, IconInfo } from './types';

// 症状图标映射
export const SYMPTOM_ICONS: Record<string, IconInfo> = {
  cramps: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M8 13V9l-2 1"></path><path d="m2 7 4 2"></path><path d="M14 13V9l2 1"></path><path d="m22 7-4 2"></path><path d="M8 17a4 4 0 0 1 8 0"></path><path d="M17 12a5 5 0 0 0-10 0"></path></svg>`,
    label: "Cramps",
    color: "text-red-500 bg-red-100"
  },
  headache: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="8" r="6"></circle><path d="M12 14v8"></path><path d="M8 22h8"></path></svg>`,
    label: "Headache",
    color: "text-orange-500 bg-orange-100"
  },
  bloating: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M6.8 21.7a2.4 2.4 0 0 1 0-3.4l4.6-4.6a1 1 0 0 1 1.4 0l2.4 2.4a1 1 0 0 1 0 1.4l-4.6 4.6a2.4 2.4 0 0 1-3.4 0Z"></path><path d="m14.1 7.1 2.9 2.9"></path><path d="m21 2-6 6"></path><path d="M11.5 11.5 3 3"></path></svg>`,
    label: "Bloating",
    color: "text-blue-500 bg-blue-100"
  },
  fatigue: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 15h8"></path><path d="M9 9h.01"></path><path d="M15 9h.01"></path></svg>`,
    label: "Fatigue",
    color: "text-purple-500 bg-purple-100"
  },
  default: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,
    label: "Symptoms",
    color: "text-indigo-500 bg-indigo-100"
  }
};

// 情绪图标映射
export const MOOD_ICONS: Record<string, IconInfo> = {
  happy: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    label: "Happy",
    color: "text-green-500 bg-green-100"
  },
  sad: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    label: "Sad",
    color: "text-blue-500 bg-blue-100"
  },
  irritated: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 15h8"></path><line x1="15" y1="9" x2="15.01" y2="9"></line><line x1="9" y1="9" x2="9.01" y2="9"></line></svg>`,
    label: "Irritated",
    color: "text-amber-500 bg-amber-100"
  },
  anxious: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line><path d="M12 12v.01"></path></svg>`,
    label: "Anxious",
    color: "text-purple-500 bg-purple-100"
  },
  default: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    label: "Mood",
    color: "text-yellow-500 bg-yellow-100"
  }
};

// 流量级别定义
export const FLOW_LEVELS: FlowLevel[] = [
  { value: 1, label: "Light Flow", color: "rgba(254, 226, 226, 0.8)", dotClass: "bg-red-400" },
  { value: 3, label: "Medium Flow", color: "rgba(254, 202, 202, 0.8)", dotClass: "bg-red-500" },
  { value: 5, label: "Heavy Flow", color: "rgba(252, 165, 165, 0.8)", dotClass: "bg-red-600" }
]; 