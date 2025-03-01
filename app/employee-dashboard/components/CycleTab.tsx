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
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Calendar */}
        <Card className="bg-white shadow-sm border-neutral-100 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Period Calendar</CardTitle>
                <CardDescription className="text-muted-foreground mt-0.5">
                  Track and predict your menstrual cycle
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-3 flex items-center gap-1 text-xs bg-primary/5 text-primary border-primary/20">
                <TrendingUp className="h-3 w-3" />
                <span>Next Period: {periodStats.nextPeriodDate || '--'}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-72 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p>Loading calendar data...</p>
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
          <Card className="bg-white shadow-sm border-neutral-100 mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Cycle Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {periodStats ? (
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Average Cycle</p>
                      <p className="text-xl font-bold">{periodStats.avgCycleLength || '--'} <span className="text-xs font-normal">days</span></p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Period Length</p>
                      <p className="text-xl font-bold">{periodStats.avgPeriodLength || '--'} <span className="text-xs font-normal">days</span></p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fertility Window</p>
                      <p className="text-sm font-semibold pt-0.5">Mar 3 - Mar 8</p>
                    </div>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-1">
                    <p>Last period started on <span className="font-medium text-foreground">{periodStats.lastPeriodDate || '--'}</span></p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center text-sm py-2">Add more period records to see cycle analysis</p>
              )}
            </CardContent>
          </Card>
          
          {/* Common Symptoms Card */}
          <Card className="bg-white shadow-sm border-neutral-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Common Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {frequentSymptoms.length > 0 ? (
                <div className="space-y-2.5">
                  {frequentSymptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center">
                      <p className="text-xs font-medium w-20">{symptom.label}</p>
                      <div className="flex-1 mx-2">
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${symptom.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{symptom.percentage}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <p className="text-muted-foreground text-center text-sm">Add period records to track symptoms</p>
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