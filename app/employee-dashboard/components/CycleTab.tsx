import { useState, useEffect } from 'react';
import { format } from 'date-fns';

import { PeriodCalendar } from "@/components/custom/PeriodCalendar";
import { PeriodRecordDialog } from "@/components/custom/PeriodRecordDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { 
  usePeriodRecords, 
  PeriodRecord,
  getPeriodStats,
  getFrequentSymptoms
} from '../hooks/usePeriodRecords';

interface CycleTabProps {
  userId: string;
}

export default function CycleTab({ userId }: CycleTabProps) {
  const { 
    periodRecords, 
    isLoading, 
    error,
    fetchPeriodRecords,
    savePeriodRecord,
    deletePeriodRecord
  } = usePeriodRecords();
  
  const [showPeriodDialog, setShowPeriodDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<PeriodRecord | undefined>(undefined);
  
  // 加载组件时获取经期记录
  useEffect(() => {
    console.log("CycleTab - Fetching period records...");
    fetchPeriodRecords();
  }, []);
  
  // 监听 periodRecords 变化
  useEffect(() => {
    console.log("CycleTab - Period records updated:", periodRecords);
  }, [periodRecords]);
  
  // 选择日期
  const handleDateSelect = (date: Date) => {
    console.log("CycleTab - Date selected:", date.toISOString());
    
    // 找到选中日期的记录
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("选中日期:", formattedDate);
    console.log("所有记录:", periodRecords);
    
    const matchingRecords = periodRecords.filter(record => {
      const recordDate = typeof record.date === 'string' 
        ? record.date 
        : format(new Date(record.date), "yyyy-MM-dd");
      
      console.log("比较:", recordDate, formattedDate, recordDate === formattedDate);
      return recordDate === formattedDate;
    });
    
    console.log("匹配的记录:", matchingRecords);
    
    // 确保选中的日期不受时区影响
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    setSelectedDate(localDate);
    
    if (matchingRecords.length > 0) {
      setSelectedRecord(matchingRecords[0]);
      setShowPeriodDialog(true);
    } else {
      // 如果没有找到记录，创建一个新的记录
      setSelectedRecord({
        id: "",
        date: formattedDate,
        periodFlow: 0,
        symptoms: [],
        notes: ""
      });
      setShowPeriodDialog(true);
    }
  };
  
  // 保存经期记录
  const handleSavePeriodRecord = async (record: PeriodRecord) => {
    console.log("CycleTab - Saving period record:", record);
    const success = await savePeriodRecord(record);
    console.log("CycleTab - Save result:", success);
    if (success) {
      setShowPeriodDialog(false);
      // 重新获取记录
      await fetchPeriodRecords();
    }
  };

  // 处理删除记录
  const handleDeleteRecord = async (recordId: string) => {
    if (!recordId) return;
    
    try {
      await deletePeriodRecord(recordId);
      setShowPeriodDialog(false);
      console.log("记录已成功删除");
      // 显示成功消息
      alert("经期记录已成功删除");
    } catch (error) {
      console.error("删除记录失败:", error);
      // 显示错误消息
      alert("无法删除经期记录，请稍后再试");
    }
  };

  // 获取演示数据
  const periodStats = getPeriodStats();
  const frequentSymptoms = getFrequentSymptoms();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>经期日历</CardTitle>
          <CardDescription>
            跟踪和预测您的月经周期
          </CardDescription>
        </CardHeader>
        <CardContent className="h-auto border-t pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-72">
              <p>加载中...</p>
            </div>
          ) : (
            <div className="mb-6">
              <PeriodCalendar
                records={periodRecords}
                onSelectDate={handleDateSelect}
                onAddRecord={() => {
                  setSelectedDate(new Date());
                  setSelectedRecord(undefined);
                  setShowPeriodDialog(true);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>周期分析</CardTitle>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center border-t pt-4">
            {periodStats ? (
              <div className="w-full space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">平均周期长度</p>
                    <p className="text-2xl font-bold">{periodStats.avgCycleLength || '--'} 天</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">平均经期长度</p>
                    <p className="text-2xl font-bold">{periodStats.avgPeriodLength || '--'} 天</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">预计下次开始</p>
                    <p className="text-2xl font-bold">{periodStats.nextPeriodDate || '--'}</p>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p>最后一次经期开始于 <span className="font-medium">{periodStats.lastPeriodDate || '--'}</span></p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">添加更多经期记录以查看周期分析</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>常见症状</CardTitle>
          </CardHeader>
          <CardContent className="h-60 flex flex-col space-y-4 border-t pt-4">
            {frequentSymptoms.length > 0 ? (
              frequentSymptoms.map((symptom, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p>{symptom.label}</p>
                  <div className="flex">
                    <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${symptom.percentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">{symptom.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">添加经期记录以跟踪症状</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <PeriodRecordDialog
        open={showPeriodDialog}
        onOpenChange={setShowPeriodDialog}
        selectedDate={selectedDate}
        record={selectedRecord}
        onSave={handleSavePeriodRecord}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
} 