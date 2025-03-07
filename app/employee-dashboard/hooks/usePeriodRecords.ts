import { format } from 'date-fns';
import { useState, useEffect } from 'react';

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

export function usePeriodRecords() {
  const [periodRecords, setPeriodRecords] = useState<PeriodRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch period records
  const fetchPeriodRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching period records...");
      const response = await fetch('/api/health-records/period');
      const result = await response.json();
      
      console.log("Fetched period records result:", result);
      
      if (result.data) {
        // Ensure date format is consistent
        const formattedRecords = result.data.map((record: any) => {
          // Ensure date format is YYYY-MM-DD
          let formattedDate;
          if (typeof record.date === 'string') {
            // Use string date directly to avoid timezone issues
            formattedDate = record.date;
          } else {
            // Manually format date to avoid timezone issues
            const dateObj = new Date(record.date);
            formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
          }
          
          // Ensure periodFlow is valid
          const periodFlow = record.periodFlow !== null && record.periodFlow !== undefined 
            ? record.periodFlow 
            : 0;
          
          // Ensure symptoms are valid
          const symptoms = record.symptoms 
            ? (typeof record.symptoms === 'string' ? JSON.parse(record.symptoms) : record.symptoms) 
            : [];
          
          // Ensure mood is valid
          const mood = record.mood || "none";
          
          // Ensure sleepHours is valid - check API returned field name
          const sleepHours = (record.sleepHours !== null && record.sleepHours !== undefined)
            ? record.sleepHours
            : (record.sleep_hours !== null && record.sleep_hours !== undefined)
              ? record.sleep_hours
              : 0;
          
          // Ensure stressLevel is valid - check API returned field name
          const stressLevel = (record.stressLevel !== null && record.stressLevel !== undefined)
            ? record.stressLevel
            : (record.stress_level !== null && record.stress_level !== undefined)
              ? record.stress_level
              : 0;
          
          // Ensure notes are valid
          const notes = record.notes || "";
          
          console.log(`Formatting record for date ${formattedDate}:`, {
            id: record.id,
            date: formattedDate,
            periodFlow,
            symptoms,
            mood,
            sleepHours,
            stressLevel,
            notes
          });
          
          return {
            id: record.id,
            date: formattedDate,
            periodFlow,
            symptoms,
            mood,
            sleepHours,
            stressLevel,
            notes
          };
        });
        
        console.log("Formatted period records:", formattedRecords);
        setPeriodRecords(formattedRecords);
      }
    } catch (error) {
      console.error('Failed to fetch period records:', error);
      setError('Failed to fetch period records');
    } finally {
      setIsLoading(false);
    }
  };

  // Save period record
  const savePeriodRecord = async (record: PeriodRecord) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ensure sleepHours and stressLevel fields are correctly passed even if they are 0
      const recordToSave = {
        ...record,
        sleepHours: record.sleepHours !== undefined ? record.sleepHours : 0,
        stressLevel: record.stressLevel !== undefined ? record.stressLevel : 0
      };
      
      console.log("Saving period record:", recordToSave);
      const response = await fetch('/api/health-records/period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordToSave),
      });
      
      const responseData = await response.json();
      console.log("Save period record response:", responseData);
      
      if (response.ok) {
        // Fetch records again
        await fetchPeriodRecords();
        return true;
      } else {
        console.error("Failed to save period record:", responseData.error);
        setError('Failed to save period record: ' + (responseData.error || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Error saving period record:', error);
      setError('Error occurred while saving period record');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete period record
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
        // Fetch records again
        await fetchPeriodRecords();
        return true;
      } else {
        console.error("Failed to delete period record:", responseData.error);
        setError('Failed to delete period record: ' + (responseData.error || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Error deleting period record:', error);
      setError('Error occurred while deleting period record');
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

// Demo data - can be removed in actual application
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
    { label: 'Cramps', percentage: 50 },
    { label: 'Mood Swings', percentage: 40 },
    { label: 'Fatigue', percentage: 30 },
    { label: 'Spasms', percentage: 20 },
    { label: 'Swelling', percentage: 10 }
  ];
}; 