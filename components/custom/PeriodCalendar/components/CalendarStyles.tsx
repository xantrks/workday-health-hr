"use client";

import React from "react";

export const CalendarStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* 基础日历容器样式 */
      .fc {
        --fc-border-color: rgba(203, 213, 225, 0.5);
        --fc-today-bg-color: rgba(219, 234, 254, 0.4);
        --fc-neutral-bg-color: #ffffff;
        --fc-list-event-hover-bg-color: rgba(239, 246, 255, 0.7);
        --fc-page-bg-color: #ffffff;
        font-family: inherit;
      }
      
      /* 暗色模式下的基础日历容器样式 */
      .dark .fc {
        --fc-border-color: rgba(203, 213, 225, 0.15);
        --fc-today-bg-color: rgba(29, 78, 216, 0.2);
        --fc-neutral-bg-color: rgba(30, 41, 59, 0.8);
        --fc-list-event-hover-bg-color: rgba(30, 58, 138, 0.3);
        --fc-page-bg-color: transparent;
      }
      
      /* 标题和工具栏样式 */
      .fc .fc-toolbar-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: hsl(var(--foreground));
      }
      
      .fc .fc-button {
        background-color: hsl(var(--primary) / 0.1);
        border-color: transparent;
        color: hsl(var(--primary));
        font-weight: 500;
        text-transform: capitalize;
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 0.375rem;
        transition: all 0.15s ease;
      }
      
      .fc .fc-button:hover {
        background-color: hsl(var(--primary) / 0.2);
        border-color: transparent;
      }
      
      .fc .fc-button-primary:not(:disabled).fc-button-active,
      .fc .fc-button-primary:not(:disabled):active {
        background-color: hsl(var(--primary));
        border-color: transparent;
        color: hsl(var(--primary-foreground));
      }
      
      /* 暗色模式下按钮样式增强 */
      .dark .fc .fc-button {
        background-color: hsl(var(--primary) / 0.2);
        color: hsl(var(--primary-foreground));
      }
      
      .dark .fc .fc-button:hover {
        background-color: hsl(var(--primary) / 0.3);
      }
      
      .dark .fc .fc-button-primary:not(:disabled).fc-button-active,
      .dark .fc .fc-button-primary:not(:disabled):active {
        background-color: hsl(var(--primary) / 0.8);
      }
      
      .fc-header-toolbar {
        margin-bottom: 1.25rem !important;
        padding: 0.25rem 0;
      }
      
      /* 日期单元格样式 */
      .fc-daygrid-day-frame {
        padding: 0.25rem !important;
        min-height: 60px !important;
        transition: all 0.2s ease;
      }
      
      .fc-day {
        position: relative;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      
      .fc-day-today {
        background-color: var(--fc-today-bg-color) !important;
      }
      
      .fc-day:hover {
        transform: scale(1.015);
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        cursor: pointer;
      }
      
      /* 暗色模式下日期单元格的悬停效果 */
      .dark .fc-day:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      /* 日期数字样式 */
      .fc .fc-daygrid-day-top {
        justify-content: center;
        padding-top: 0.25rem;
      }
      
      .fc-daygrid-day-number {
        font-size: 0.875rem;
        font-weight: 500;
        color: hsl(var(--foreground));
        padding: 0.25rem !important;
        width: 1.75rem;
        height: 1.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        transition: all 0.15s ease;
      }
      
      /* 经期日样式 */
      .period-day .fc-daygrid-day-number {
        color: #e11d48 !important;
        font-weight: 600;
        background-color: rgba(225, 29, 72, 0.1);
      }
      
      /* 暗色模式下经期日样式调整 */
      .dark .period-day .fc-daygrid-day-number {
        background-color: rgba(225, 29, 72, 0.2);
      }
      
      /* 事件样式 */
      .fc-event {
        border: none !important;
        background: transparent !important;
        margin: 0.25rem !important;
        border-radius: 0.25rem;
        overflow: hidden;
      }
      
      .fc-event-main {
        padding: 0.125rem 0.25rem;
      }
      
      /* 数据指示器样式 */
      .data-indicator {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 9999px;
        z-index: 2;
      }
      
      .has-data {
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        z-index: 5;
      }
      
      /* 暗色模式下指示器阴影调整 */
      .dark .has-data {
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      }
      
      /* 渐变背景效果 */
      .flow-level-1 {
        background-color: rgba(254, 226, 226, 0.6) !important;
      }
      
      .flow-level-2 {
        background-color: rgba(254, 202, 202, 0.6) !important;
      }
      
      .flow-level-3 {
        background-color: rgba(252, 165, 165, 0.6) !important;
      }
      
      .flow-level-4 {
        background-color: rgba(248, 113, 113, 0.6) !important;
      }
      
      .flow-level-5 {
        background-color: rgba(239, 68, 68, 0.6) !important;
      }
      
      /* 暗色模式下渐变背景效果 */
      .dark .flow-level-1 {
        background-color: rgba(254, 226, 226, 0.15) !important;
      }
      
      .dark .flow-level-2 {
        background-color: rgba(254, 202, 202, 0.2) !important;
      }
      
      .dark .flow-level-3 {
        background-color: rgba(252, 165, 165, 0.25) !important;
      }
      
      .dark .flow-level-4 {
        background-color: rgba(248, 113, 113, 0.3) !important;
      }
      
      .dark .flow-level-5 {
        background-color: rgba(239, 68, 68, 0.35) !important;
      }
      
      /* 工具提示样式 */
      .period-tooltip {
        border-radius: 0.5rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        border: 1px solid rgba(var(--card-border) / 0.2);
        padding: 0.5rem;
        max-width: 14rem;
        z-index: 50;
      }
      
      /* 暗色模式下工具提示样式 */
      .dark .period-tooltip {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        background-color: hsl(var(--card));
      }
      
      /* 暗黑模式下表格线颜色调整 */
      .dark .fc-theme-standard .fc-scrollgrid,
      .dark .fc-theme-standard td,
      .dark .fc-theme-standard th {
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      /* 暗黑模式下表头文字颜色 */
      .dark .fc-col-header-cell-cushion {
        color: hsl(var(--muted-foreground));
      }
      
      /* 响应式调整 */
      @media (max-width: 640px) {
        .fc-header-toolbar {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .fc-toolbar-chunk {
          display: flex;
          justify-content: center;
        }
        
        .fc-daygrid-day-frame {
          min-height: 50px !important;
        }
      }
    `}</style>
  );
}; 