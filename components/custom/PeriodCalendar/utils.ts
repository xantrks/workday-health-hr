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
    content += `Flow: ${flowStyle?.label || 'Light'}\n`;
  }
  
  if (record.symptoms && record.symptoms.length > 0) {
    const symptomLabels = record.symptoms.map(s => {
      const symptom = SYMPTOM_ICONS[s] || SYMPTOM_ICONS.default;
      return symptom.label;
    });
    content += `Symptoms: ${symptomLabels.join(", ")}\n`;
  }
  
  if (record.mood && record.mood !== "none") {
    const moodInfo = MOOD_ICONS[record.mood] || MOOD_ICONS.default;
    content += `Mood: ${moodInfo.label}\n`;
  }
  
  if (record.sleepHours) {
    content += `Sleep: ${record.sleepHours} hours\n`;
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
  const existingIndicators = el.querySelectorAll('.flow-indicator, .symptom-indicator, .mood-indicator, .data-indicator');
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
      
      // 创建流量指示器容器
      const dataIndicator = document.createElement('div');
      dataIndicator.className = 'data-indicator absolute bottom-1 left-0 right-0 flex items-center justify-center gap-1';
      
      // 添加流量指示点
      let dots = '';
      const dotCount = Math.min(Math.ceil(record.periodFlow), 3);
      for (let i = 0; i < dotCount; i++) {
        dots += `<span class="inline-block w-1.5 h-1.5 rounded-full ${flowStyle.dotClass}"></span>`;
      }
      
      dataIndicator.innerHTML = dots;
      
      if (dayContentEl) {
        dayContentEl.appendChild(dataIndicator);
      }
    }
  }
  
  // 添加顶部数据指示栏
  const topIndicator = document.createElement('div');
  topIndicator.className = 'absolute top-1 right-1 flex items-center justify-end gap-1';
  
  let hasIndicators = false;
  
  // 添加症状图标
  if (record.symptoms && record.symptoms.length > 0) {
    const primarySymptom = getPrimarySymptom(record.symptoms);
    const symptomInfo = SYMPTOM_ICONS[primarySymptom] || SYMPTOM_ICONS.default;
    
    // 创建症状图标
    const symptomIcon = document.createElement('div');
    symptomIcon.className = `symptom-indicator w-5 h-5 flex items-center justify-center rounded-full ${symptomInfo.color}`;
    symptomIcon.setAttribute('title', `Symptoms: ${record.symptoms.join(', ')}`);
    symptomIcon.innerHTML = symptomInfo.icon;
    
    topIndicator.appendChild(symptomIcon);
    hasIndicators = true;
  }
  
  // 添加情绪指示图标
  if (record.mood && record.mood !== "none") {
    const moodInfo = MOOD_ICONS[record.mood] || MOOD_ICONS.default;
    
    // 创建情绪图标
    const moodIcon = document.createElement('div');
    moodIcon.className = `mood-indicator w-5 h-5 flex items-center justify-center rounded-full ${moodInfo.color}`;
    moodIcon.setAttribute('title', `Mood: ${moodInfo.label}`);
    moodIcon.innerHTML = moodInfo.icon;
    
    topIndicator.appendChild(moodIcon);
    hasIndicators = true;
  }
  
  // 只有存在指示器时才添加到DOM
  if (hasIndicators) {
    el.appendChild(topIndicator);
  }
  
  // 为单元格添加强调效果
  if (record.periodFlow || record.symptoms?.length || (record.mood && record.mood !== "none")) {
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