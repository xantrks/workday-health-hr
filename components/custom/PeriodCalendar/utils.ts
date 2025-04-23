import { format } from "date-fns";
import { createRoot } from "react-dom/client";

import { FLOW_LEVELS, SYMPTOM_ICONS, MOOD_ICONS } from "./constants";
import { PeriodRecord } from "./types";

// TooltipData接口定义
export interface TooltipData {
  date: string;
  content: string;
  id?: string;
}

// 格式化日期为ISO字符串
export const formatDateToISO = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// 获取一个症状数组的主要症状
export const getPrimarySymptom = (symptoms?: string[]): string => {
  if (!symptoms || symptoms.length === 0) return 'default';
  
  // 按优先级排序症状
  const prioritySymptoms = ['cramps', 'headache', 'bloating', 'fatigue'];
  
  for (const priority of prioritySymptoms) {
    if (symptoms.includes(priority)) {
      return priority;
    }
  }
  
  return symptoms[0] || 'default';
};

// 获取指定经期流量级别的样式
export const getFlowLevelStyle = (flowLevel?: number) => {
  if (!flowLevel || flowLevel <= 0) return null;
  
  // 现在直接使用流量级别作为索引(减去1因为索引从0开始)
  const index = Math.min(Math.max(Math.floor(flowLevel) - 1, 0), FLOW_LEVELS.length - 1);
  return FLOW_LEVELS[index];
};

// 查找特定日期的记录
export const getRecordForDate = (date: Date, records: PeriodRecord[]): PeriodRecord | undefined => {
  const formattedDate = formatDateToISO(date);
  
  // 查找匹配此日期的所有记录
  const matchingRecords = records.filter(record => {
    // 确保记录日期格式一致
    const recordDate = typeof record.date === 'string' 
      ? record.date 
      : formatDateToISO(record.date as unknown as Date);
    
    // 直接比较字符串日期以避免时区问题
    return recordDate === formattedDate;
  });
  
  if (matchingRecords.length === 0) {
    return undefined;
  }
  
  // 如果存在多个记录，返回具有非空periodFlow的记录
  const validRecord = matchingRecords.find(r => r.periodFlow !== null && r.periodFlow !== undefined && r.periodFlow > 0);
  
  if (validRecord) {
    return validRecord;
  }
  
  return matchingRecords[0];
};

// 将经期记录转换为FullCalendar事件
export const convertRecordsToEvents = (records: PeriodRecord[]) => {
  return records
    .filter(record => record.periodFlow && record.periodFlow > 0)
    .map(record => ({
      id: record.id || record.date,
      start: record.date,
      allDay: true,
      display: 'background',
      classNames: ['period-event'],
      backgroundColor: getFlowLevelStyle(record.periodFlow)?.color || 'rgba(254, 226, 226, 0.4)',
      extendedProps: {
        periodFlow: record.periodFlow,
        symptoms: record.symptoms,
        mood: record.mood,
        notes: record.notes
      }
    }));
};

// 生成工具提示内容数据
export const generateTooltipContent = (record: PeriodRecord): TooltipData => {
  let content = "";
  
  if (record.periodFlow && record.periodFlow > 0) {
    const flowStyle = getFlowLevelStyle(record.periodFlow);
    content += `Period Flow: ${flowStyle?.label || 'Light'}\n`;
  }
  
  if (record.sleepHours) {
    content += `Sleep Duration: ${record.sleepHours} hours\n`;
  }
  
  if (record.stressLevel) {
    content += `Stress Level: ${record.stressLevel}/5\n`;
  }
  
  if (record.notes) {
    content += `Notes: ${record.notes}`;
  }
  
  return {
    date: record.date,
    content,
    id: record.id
  };
};

// 将样式应用到日历单元格
export const applyRecordStyles = (
  el: HTMLElement, 
  record: PeriodRecord, 
  onSelectDate: (date: Date) => void,
  renderTooltip: (tooltipElement: HTMLElement, tooltipData: TooltipData, onSelectDate: (date: Date) => void) => void
) => {
  // 找到日期单元格内的具体内容容器
  const dayNumberEl = el.querySelector('.fc-daygrid-day-top');
  const dayContentEl = el.querySelector('.fc-daygrid-day-frame');
  
  // 清除可能已存在的指示器，避免重复添加
  const existingIndicators = el.querySelectorAll('.flow-indicator, .symptom-indicator, .mood-indicator, .data-indicator, .simplified-indicator, .corner-indicator');
  existingIndicators.forEach(indicator => indicator.remove());
  
  // 添加经期背景色 - 整个单元格
  if (record.periodFlow && record.periodFlow > 0) {
    // 添加基本样式类
    el.classList.add('period-day');
    
    // 获取流量级别样式
    const flowStyle = getFlowLevelStyle(record.periodFlow);
    if (flowStyle) {
      // 添加背景色
      el.style.backgroundColor = flowStyle.color;
      
      // 为日期数字添加明显的样式
      if (dayNumberEl) {
        dayNumberEl.classList.add('font-medium');
        
        const dateNum = dayNumberEl.querySelector('a');
        if (dateNum) {
          dateNum.style.color = '#e11d48'; // text-rose-600
        }
      }
    }
  }
  
  // 1. Period Flow - 左上角 - 使用更合适的水滴图标
  if (record.periodFlow && record.periodFlow > 0) {
    const flowIndicator = document.createElement('div');
    flowIndicator.className = 'corner-indicator top-left left-1 top-1 absolute flex items-center gap-1 text-xs';
    
    // 更合适的流量图标 - 使用水滴图标
    const dropIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 text-rose-500 mr-0.5">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
    </svg>`;
    
    flowIndicator.innerHTML = `${dropIcon} <span class="font-medium text-rose-500">${record.periodFlow}</span>`;
    el.appendChild(flowIndicator);
  }
  
  // 2. Sleep Duration - 右上角 - 保持月亮图标不变
  if (record.sleepHours) {
    const sleepIndicator = document.createElement('div');
    sleepIndicator.className = 'corner-indicator top-right right-1 top-1 absolute flex items-center gap-1 text-xs';
    
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-indigo-500 mr-0.5">
      <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
    </svg>`;
    
    sleepIndicator.innerHTML = `${moonIcon} <span class="font-medium text-indigo-500">${record.sleepHours}</span>`;
    el.appendChild(sleepIndicator);
  }
  
  // 3. Stress Level - 左下角 - 使用更合适的压力图标
  if (record.stressLevel) {
    const stressIndicator = document.createElement('div');
    stressIndicator.className = 'corner-indicator bottom-left left-1 bottom-1 absolute flex items-center gap-1 text-xs';
    
    // 更合适的压力图标 - 使用活动/心跳图标
    const stressIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 text-amber-500 mr-0.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>`;
    
    stressIndicator.innerHTML = `${stressIcon} <span class="font-medium text-amber-500">${record.stressLevel}</span>`;
    el.appendChild(stressIndicator);
  }
  
  // 为单元格添加强调效果
  if (record.periodFlow || record.sleepHours || record.stressLevel) {
    el.classList.add('has-data');
  }
  
  // 添加工具提示
  addTooltip(el, record, onSelectDate, renderTooltip);
};

// 添加工具提示函数
export const addTooltip = (
  el: HTMLElement, 
  record: PeriodRecord, 
  onSelectDate: (date: Date) => void,
  renderTooltip: (tooltipElement: HTMLElement, tooltipData: TooltipData, onSelectDate: (date: Date) => void) => void
) => {
  // 删除可能存在的旧工具提示
  const oldTooltip = el.querySelector('.period-tooltip-container');
  if (oldTooltip) {
    const oldElement = oldTooltip.querySelector('div');
    if (oldElement && (oldElement as any)._root) {
      (oldElement as any)._root.unmount();
    }
    oldTooltip.remove();
  }
  
  // 添加新工具提示
  if (record.periodFlow || (record.symptoms && record.symptoms.length > 0) || record.mood || record.notes) {
    const tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('period-tooltip-container', 'absolute', 'inset-0', 'z-10');
    
    // Create React tooltip component
    const tooltipElement = document.createElement('div');
    tooltipContainer.appendChild(tooltipElement);
    el.appendChild(tooltipContainer);
    
    // 生成工具提示数据
    const tooltipData = generateTooltipContent(record);
    
    // 使用提供的渲染函数渲染工具提示
    renderTooltip(tooltipElement, tooltipData, onSelectDate);
  }
}; 