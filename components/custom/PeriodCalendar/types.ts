export interface PeriodRecord {
  id?: string;
  date: string;
  periodFlow?: number;
  symptoms?: string[];
  mood?: string;
  sleepHours: number;
  stressLevel: number;
  notes?: string;
}

export interface PeriodCalendarProps {
  records: PeriodRecord[];
  onSelectDate: (date: Date) => void;
  onAddRecord: () => void;
}

// 流量级别类型
export interface FlowLevel {
  value: number;
  label: string;
  color: string;
  dotClass: string;
}

// 图标信息类型
export interface IconInfo {
  icon: string;
  label: string;
  color: string;
} 