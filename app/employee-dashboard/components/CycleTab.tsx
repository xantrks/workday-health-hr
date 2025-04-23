import { format } from 'date-fns';
import { TrendingUp } from "lucide-react";
import { useState, useEffect } from 'react';

import { PeriodCalendar } from "@/components/custom/PeriodCalendar";
import { PeriodRecordDialog } from "@/components/custom/PeriodRecordDialog";
import { Badge } from "@/components/ui/badge";
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

/**
 * CycleTab component for tracking menstrual cycles
 * Enhanced for mobile responsiveness
 */
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
  
  // Load period records when component mounts
  useEffect(() => {
    console.log("CycleTab - Fetching period records...");
    fetchPeriodRecords();
  }, []);
  
  // Monitor periodRecords changes
  useEffect(() => {
    console.log("CycleTab - Period records updated:", periodRecords);
  }, [periodRecords]);
  
  // Select date
  const handleDateSelect = (date: Date) => {
    console.log("CycleTab - Date selected:", date.toISOString());
    
    // Find record for selected date
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("Selected date:", formattedDate);
    console.log("All records:", periodRecords);
    
    const matchingRecords = periodRecords.filter(record => {
      const recordDate = typeof record.date === 'string' 
        ? record.date 
        : format(new Date(record.date), "yyyy-MM-dd");
      
      console.log("Comparing:", recordDate, formattedDate, recordDate === formattedDate);
      return recordDate === formattedDate;
    });
    
    console.log("Matching records:", matchingRecords);
    
    // Ensure selected date is not affected by timezone
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    setSelectedDate(localDate);
    
    if (matchingRecords.length > 0) {
      setSelectedRecord(matchingRecords[0]);
      setShowPeriodDialog(true);
    } else {
      // If no record found, create a new one
      setSelectedRecord({
        id: "",
        date: formattedDate,
        periodFlow: 0,
        symptoms: [],
        mood: "none",
        sleepHours: 0,
        stressLevel: 0,
        notes: ""
      });
      setShowPeriodDialog(true);
    }
  };
  
  // Save period record
  const handleSavePeriodRecord = async (record: PeriodRecord) => {
    console.log("CycleTab - Saving period record:", record);
    const success = await savePeriodRecord(record);
    console.log("CycleTab - Save result:", success);
    if (success) {
      setShowPeriodDialog(false);
      // Refresh records
      await fetchPeriodRecords();
    }
  };

  // Handle record deletion
  const handleDeleteRecord = async (recordId: string) => {
    if (!recordId) return;
    
    try {
      await deletePeriodRecord(recordId);
      setShowPeriodDialog(false);
      console.log("Record successfully deleted");
      // Show success message
      alert("Period record successfully deleted");
    } catch (error) {
      console.error("Failed to delete record:", error);
      // Show error message
      alert("Unable to delete period record, please try again later");
    }
  };

  // Get demo data
  const periodStats = getPeriodStats();
  const frequentSymptoms = getFrequentSymptoms();
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Left Column - Calendar */}
        <Card className="border-border shadow-md dark:shadow-primary/5 lg:col-span-2 backdrop-blur-sm dark:bg-card/95">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-foreground">Period Calendar</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Track and predict your menstrual cycle
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 flex items-center gap-1 text-xs bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 self-start sm:self-auto">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] sm:text-xs">Next Period: {periodStats.nextPeriodDate || '--'}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-3 px-2 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-56 sm:h-72 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                  <p className="text-xs sm:text-sm">Loading calendar data...</p>
                </div>
              </div>
            ) : (
              <PeriodCalendar
                records={periodRecords}
                onSelectDate={handleDateSelect}
                onAddRecord={() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  handleDateSelect(today);
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Right Column - Analysis & Symptoms Combined */}
        <div className="lg:col-span-1">
          {/* Cycle Analysis Card */}
          <Card className="border-border shadow-md dark:shadow-primary/5 mb-3 sm:mb-4 backdrop-blur-sm dark:bg-card/95">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
              <CardTitle className="text-sm sm:text-base font-semibold text-foreground">Cycle Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-3 sm:px-6 pb-3 sm:pb-4">
              {periodStats ? (
                <div className="w-full space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                    <div className="bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-lg transition-colors">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Average Cycle</p>
                      <p className="text-base sm:text-xl font-bold text-foreground">{periodStats.avgCycleLength || '--'} <span className="text-[10px] sm:text-xs font-normal">days</span></p>
                    </div>
                    <div className="bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-lg transition-colors">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Period Length</p>
                      <p className="text-base sm:text-xl font-bold text-foreground">{periodStats.avgPeriodLength || '--'} <span className="text-[10px] sm:text-xs font-normal">days</span></p>
                    </div>
                    <div className="bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-lg transition-colors">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Fertility Window</p>
                      <p className="text-[11px] sm:text-sm font-semibold pt-0.5 text-foreground">Mar 3 - Mar 8</p>
                    </div>
                  </div>
                  <div className="text-center text-[10px] sm:text-xs text-muted-foreground mt-1">
                    <p>Last period started on <span className="font-medium text-foreground">{periodStats.lastPeriodDate || '--'}</span></p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center text-xs sm:text-sm py-2">Add more period records to see cycle analysis</p>
              )}
            </CardContent>
          </Card>
          
          {/* Common Symptoms Card */}
          <Card className="border-border shadow-md dark:shadow-primary/5 backdrop-blur-sm dark:bg-card/95">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
              <CardTitle className="text-sm sm:text-base font-semibold text-foreground">Common Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 px-3 sm:px-6 pb-3 sm:pb-4">
              {frequentSymptoms.length > 0 ? (
                <div className="space-y-2 sm:space-y-2.5">
                  {frequentSymptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center">
                      <p className="text-[10px] sm:text-xs font-medium w-16 sm:w-20 text-foreground">{symptom.label}</p>
                      <div className="flex-1 mx-1 sm:mx-2">
                        <div className="h-1 sm:h-1.5 rounded-full bg-muted dark:bg-muted/40 overflow-hidden">
                          <div 
                            className="h-full bg-primary dark:bg-primary/80 transition-all" 
                            style={{ width: `${symptom.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground w-6 sm:w-8 text-right">{symptom.percentage}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-3 sm:py-4">
                  <p className="text-muted-foreground text-center text-xs sm:text-sm">Add period records to track symptoms</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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