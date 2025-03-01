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
      <Card>
        <CardHeader>
          <CardTitle>Period Calendar</CardTitle>
          <CardDescription>
            Track and predict your menstrual cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="h-auto border-t pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-72">
              <p>Loading...</p>
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
            <CardTitle>Cycle Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center border-t pt-4">
            {periodStats ? (
              <div className="w-full space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Cycle Length</p>
                    <p className="text-2xl font-bold">{periodStats.avgCycleLength || '--'} days</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Period Length</p>
                    <p className="text-2xl font-bold">{periodStats.avgPeriodLength || '--'} days</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Next Period Expected</p>
                    <p className="text-2xl font-bold">{periodStats.nextPeriodDate || '--'}</p>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p>Last period started on <span className="font-medium">{periodStats.lastPeriodDate || '--'}</span></p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">Add more period records to see cycle analysis</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Common Symptoms</CardTitle>
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
                <p className="text-muted-foreground text-center">Add period records to track symptoms</p>
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