import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export interface PeriodRecord {
  id?: string;
  date: string;
  periodFlow?: number;
  symptoms?: string[];
  notes?: string;
}

export function usePeriodRecords() {
  const [periodRecords, setPeriodRecords] = useState<PeriodRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取经期记录
  const fetchPeriodRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching period records...");
      const response = await fetch('/api/health-records/period');
      const result = await response.json();
      
      console.log("Fetched period records result:", result);
      
      if (result.data) {
        // 确保日期格式一致
        const formattedRecords = result.data.map((record: any) => {
          // 确保日期格式为 YYYY-MM-DD
          let formattedDate;
          if (typeof record.date === 'string') {
            // 直接使用字符串格式的日期，避免时区问题
            formattedDate = record.date;
          } else {
            // 手动格式化日期，避免时区问题
            const dateObj = new Date(record.date);
            formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
          }
          
          // 确保 periodFlow 有效
          const periodFlow = record.periodFlow !== null && record.periodFlow !== undefined 
            ? record.periodFlow 
            : 0;
          
          // 确保 symptoms 有效
          const symptoms = record.symptoms 
            ? (typeof record.symptoms === 'string' ? JSON.parse(record.symptoms) : record.symptoms) 
            : [];
          
          // 确保 notes 有效
          const notes = record.notes || "";
          
          console.log(`Formatting record for date ${formattedDate}:`, {
            id: record.id,
            date: formattedDate,
            periodFlow,
            symptoms,
            notes
          });
          
          return {
            id: record.id,
            date: formattedDate,
            periodFlow,
            symptoms,
            notes
          };
        });
        
        console.log("Formatted period records:", formattedRecords);
        setPeriodRecords(formattedRecords);
      }
    } catch (error) {
      console.error('Failed to fetch period records:', error);
      setError('获取经期记录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存经期记录
  const savePeriodRecord = async (record: PeriodRecord) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Saving period record:", record);
      const response = await fetch('/api/health-records/period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      const responseData = await response.json();
      console.log("Save period record response:", responseData);
      
      if (response.ok) {
        // 重新获取记录
        await fetchPeriodRecords();
        return true;
      } else {
        console.error("Failed to save period record:", responseData.error);
        setError('保存经期记录失败: ' + (responseData.error || '未知错误'));
        return false;
      }
    } catch (error) {
      console.error('Error saving period record:', error);
      setError('保存经期记录时发生错误');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 删除经期记录
  const deletePeriodRecord = async (recordId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Deleting period record:", recordId);
      const response = await fetch(`/api/health-records/period/${recordId}`, {
        method: 'DELETE',
      });
      
      const responseData = await response.json();
      console.log("Delete period record response:", responseData);
      
      if (response.ok) {
        // 重新获取记录
        await fetchPeriodRecords();
        return true;
      } else {
        console.error("Failed to delete period record:", responseData.error);
        setError('删除经期记录失败: ' + (responseData.error || '未知错误'));
        return false;
      }
    } catch (error) {
      console.error('Error deleting period record:', error);
      setError('删除经期记录时发生错误');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    periodRecords,
    isLoading,
    error,
    fetchPeriodRecords,
    savePeriodRecord,
    deletePeriodRecord
  };
}

// 演示数据 - 可以在实际应用中移除
export const getPeriodStats = () => {
  return {
    avgCycleLength: 28,
    avgPeriodLength: 5,
    nextPeriodDate: '2024-03-15',
    lastPeriodDate: '2024-02-10'
  };
};

export const getFrequentSymptoms = () => {
  return [
    { label: '腹痛', percentage: 50 },
    { label: '情绪波动', percentage: 40 },
    { label: '疲劳', percentage: 30 },
    { label: '痉挛', percentage: 20 },
    { label: '水肿', percentage: 10 }
  ];
}; 