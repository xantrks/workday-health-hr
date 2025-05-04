"use client";

import { format, addDays, differenceInDays, parse } from "date-fns";
import { Send, X, MessageSquare, BotIcon, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { ChatMessage } from "./ChatMessage";

// Define interface for messages
interface Message {
  role: "user" | "assistant";
  content: string;
}

// Leave Request State for conversation tracking
type LeaveRequestState = {
  active: boolean;
  stage: "type" | "startDate" | "endDate" | "reason" | "confirm" | "complete";
  leaveType: string;
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
}

// Leave type options
const leaveTypes = [
  { id: "1", name: "Annual Leave", description: "Vacation or personal time off", maxDays: 30 },
  { id: "2", name: "Sick Leave", description: "For illness or medical appointments", maxDays: 14 },
  { id: "3", name: "Personal Leave", description: "For personal matters", maxDays: 5 },
  { id: "4", name: "Family Leave", description: "To care for family members", maxDays: 10 },
  { id: "5", name: "Bereavement Leave", description: "For loss of family member", maxDays: 5 },
];

// Add detailed debug logging
const DEBUG = true;
function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[CHAT_WIDGET_DEBUG] ${message}`, data || '');
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  // Leave request conversation state
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestState>({
    active: false,
    stage: "type",
    leaveType: "",
    startDate: null,
    endDate: null,
    reason: ""
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm Sanicle's women's health assistant. I'm here to chat with you about physiological and psychological health topics and can help with leave requests. How can I support you today?",
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Component mount debugging
  useEffect(() => {
    debugLog("ChatWidget component mounted");
    return () => {
      debugLog("ChatWidget component unmounted");
    };
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper function to determine if text contains a leave request
  const isLeaveRelated = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return (
      lowerText.includes("leave") || 
      lowerText.includes("time off") || 
      lowerText.includes("vacation") || 
      lowerText.includes("sick") || 
      lowerText.includes("day off") ||
      lowerText.includes("holiday") ||
      lowerText.includes("absence")
    );
  };

  // Helper to extract date from text using various formats
  const extractDate = (text: string): Date | null => {
    // Try to find a date in various formats
    const today = new Date();
    
    // Check for "today", "tomorrow", etc
    if (text.toLowerCase().includes("today")) {
      return today;
    }
    
    if (text.toLowerCase().includes("tomorrow")) {
      return addDays(today, 1);
    }
    
    // Check for relative days ("next monday", "this friday", etc)
    const dayMatches = text.match(/(?:this|next) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
    if (dayMatches) {
      const dayMap: {[key: string]: number} = {
        monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0
      };
      
      const targetDay = dayMap[dayMatches[1].toLowerCase()];
      const currentDay = today.getDay();
      let daysToAdd = (targetDay - currentDay + 7) % 7;
      
      if (dayMatches[0].toLowerCase().startsWith("next")) {
        daysToAdd += 7;
      } else if (daysToAdd === 0) { // "this sunday" when today is sunday means next week
        daysToAdd = 7;
      }
      
      return addDays(today, daysToAdd);
    }
    
    // Try to detect common date formats
    const datePatterns = [
      // MM/DD/YYYY or DD/MM/YYYY
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      // YYYY-MM-DD
      /(\d{4})-(\d{1,2})-(\d{1,2})/,
      // Month DD, YYYY
      /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})/i,
      // DD Month YYYY
      /(\d{1,2})(?:st|nd|rd|th)? (January|February|March|April|May|June|July|August|September|October|November|December),? (\d{4})/i,
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          // Different parsing logic based on the pattern
          if (pattern === datePatterns[0]) {
            // MM/DD/YYYY or DD/MM/YYYY (assume MM/DD/YYYY for simplicity)
            return new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
          } else if (pattern === datePatterns[1]) {
            // YYYY-MM-DD
            return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
          } else if (pattern === datePatterns[2]) {
            // Month DD, YYYY
            const monthNames = ["january", "february", "march", "april", "may", "june", 
                               "july", "august", "september", "october", "november", "december"];
            const month = monthNames.indexOf(match[1].toLowerCase());
            return new Date(parseInt(match[3]), month, parseInt(match[2]));
          } else if (pattern === datePatterns[3]) {
            // DD Month YYYY
            const monthNames = ["january", "february", "march", "april", "may", "june", 
                               "july", "august", "september", "october", "november", "december"];
            const month = monthNames.indexOf(match[2].toLowerCase());
            return new Date(parseInt(match[3]), month, parseInt(match[1]));
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }
    }
    
    return null;
  };

  // Process user input during a leave request conversation
  const processLeaveRequestInput = (userInput: string): string => {
    const { stage } = leaveRequest;
    let updatedLeaveRequest = { ...leaveRequest };
    let response = "";
    
    // First, try to extract all relevant information from the input at once
    const leaveInfo = extractLeaveInformation(userInput);
    
    // If we can extract complete information in one go, skip the conversation flow
    if (leaveInfo.isComplete) {
      // Update all fields at once
      updatedLeaveRequest.leaveType = leaveInfo.leaveType || updatedLeaveRequest.leaveType;
      updatedLeaveRequest.startDate = leaveInfo.startDate || updatedLeaveRequest.startDate;
      updatedLeaveRequest.endDate = leaveInfo.endDate || updatedLeaveRequest.endDate;
      updatedLeaveRequest.reason = leaveInfo.reason || updatedLeaveRequest.reason;
      updatedLeaveRequest.stage = "confirm";
      
      // Format the summary
      const startDateStr = updatedLeaveRequest.startDate ? format(updatedLeaveRequest.startDate, "EEEE, MMMM d, yyyy") : "";
      const endDateStr = updatedLeaveRequest.endDate === updatedLeaveRequest.startDate 
        ? "Same day" 
        : updatedLeaveRequest.endDate ? format(updatedLeaveRequest.endDate, "EEEE, MMMM d, yyyy") : "";
      const days = (updatedLeaveRequest.startDate && updatedLeaveRequest.endDate) ? 
        differenceInDays(updatedLeaveRequest.endDate, updatedLeaveRequest.startDate) + 1 : 1;
      
      response = `I've prepared your leave request based on what you've told me:\n\n` +
        `- **Type:** ${updatedLeaveRequest.leaveType}\n` +
        `- **Date:** ${startDateStr}${endDateStr !== "Same day" ? ` to ${endDateStr}` : ""}\n` +
        `- **Duration:** ${days} day${days > 1 ? 's' : ''}\n` +
        `- **Reason:** ${updatedLeaveRequest.reason}\n\n` +
        `Does this look correct? I can submit it now, or you can tell me what to change.`;
        
      setLeaveRequest(updatedLeaveRequest);
      return response;
    }
    
    // Update any partial information we extracted
    if (leaveInfo.leaveType && !updatedLeaveRequest.leaveType) {
      updatedLeaveRequest.leaveType = leaveInfo.leaveType;
    }
    if (leaveInfo.startDate && !updatedLeaveRequest.startDate) {
      updatedLeaveRequest.startDate = leaveInfo.startDate;
    }
    if (leaveInfo.endDate && !updatedLeaveRequest.endDate) {
      updatedLeaveRequest.endDate = leaveInfo.endDate;
    }
    if (leaveInfo.reason && !updatedLeaveRequest.reason) {
      updatedLeaveRequest.reason = leaveInfo.reason;
    }
    
    // Now continue with the staged conversation, but try to skip steps if possible
    switch (stage) {
      case "type":
        // If we already extracted a leave type from the current input, move forward
        if (leaveInfo.leaveType) {
          updatedLeaveRequest.stage = "startDate";
          
          // If we also have start date, we can move further
          if (leaveInfo.startDate) {
            updatedLeaveRequest.stage = "endDate";
            
            // If we have end date too, move to reason
            if (leaveInfo.endDate) {
              updatedLeaveRequest.stage = "reason";
              
              // If we even have the reason, jump to confirm
              if (leaveInfo.reason) {
                updatedLeaveRequest.stage = "confirm";
                
                // Format the summary
                const startDateStr = format(updatedLeaveRequest.startDate!, "EEEE, MMMM d, yyyy");
                const endDateStr = updatedLeaveRequest.endDate === updatedLeaveRequest.startDate 
                  ? "Same day" 
                  : format(updatedLeaveRequest.endDate!, "EEEE, MMMM d, yyyy");
                const days = differenceInDays(updatedLeaveRequest.endDate!, updatedLeaveRequest.startDate!) + 1;
                
                response = `Great! I've put together your leave request:\n\n` +
                  `- **Type:** ${updatedLeaveRequest.leaveType}\n` +
                  `- **Date:** ${startDateStr}${endDateStr !== "Same day" ? ` to ${endDateStr}` : ""}\n` +
                  `- **Duration:** ${days} day${days > 1 ? 's' : ''}\n` +
                  `- **Reason:** ${updatedLeaveRequest.reason}\n\n` +
                  `Ready to submit this request?`;
                
                setLeaveRequest(updatedLeaveRequest);
                return response;
              }
              
              // If we have start/end date but no reason
              const startDateStr = format(updatedLeaveRequest.startDate!, "EEEE, MMMM d, yyyy");
              const endDateStr = updatedLeaveRequest.endDate === updatedLeaveRequest.startDate 
                ? "Same day" 
                : format(updatedLeaveRequest.endDate!, "EEEE, MMMM d, yyyy");
              const days = differenceInDays(updatedLeaveRequest.endDate!, updatedLeaveRequest.startDate!) + 1;
              
              response = `I'll request ${updatedLeaveRequest.leaveType} from ${startDateStr}${endDateStr !== "Same day" ? ` to ${endDateStr}` : ""} (${days} day${days > 1 ? 's' : ''}). Could you briefly tell me the reason for your leave?`;
              
              setLeaveRequest(updatedLeaveRequest);
              return response;
            }
            
            // If we have start date but no end date
            const startDateStr = format(updatedLeaveRequest.startDate!, "EEEE, MMMM d, yyyy");
            response = `I'll put in a request for ${updatedLeaveRequest.leaveType} starting ${startDateStr}. When will you return? (If it's just for one day, you can simply say "same day")`;
            
            setLeaveRequest(updatedLeaveRequest);
            return response;
          }
          
          // Only have leave type
          response = `I've noted you're requesting ${updatedLeaveRequest.leaveType}. When do you want to start your leave?`;
          
          setLeaveRequest(updatedLeaveRequest);
          return response;
        }
        
        // Try to identify leave type from input again
        const lowerInput = userInput.toLowerCase();
        let matchedType = "";
        
        // Check if user input matches any leave type name
        for (const type of leaveTypes) {
          if (lowerInput.includes(type.name.toLowerCase())) {
            matchedType = type.name;
            break;
          }
        }
        
        // Check for common terms if no exact match
        if (!matchedType) {
          if (lowerInput.includes("vacation") || lowerInput.includes("holiday") || lowerInput.includes("annual")) {
            matchedType = "Annual Leave";
          } else if (lowerInput.includes("sick") || lowerInput.includes("ill") || lowerInput.includes("health")) {
            matchedType = "Sick Leave";
          } else if (lowerInput.includes("personal") || lowerInput.includes("private")) {
            matchedType = "Personal Leave";
          } else if (lowerInput.includes("family") || lowerInput.includes("care")) {
            matchedType = "Family Leave";
          } else if (lowerInput.includes("bereave") || lowerInput.includes("funeral") || lowerInput.includes("death")) {
            matchedType = "Bereavement Leave";
          } else if (lowerInput.includes("day") && (lowerInput.includes("off") || lowerInput.includes("leave") || lowerInput.includes("out"))) {
            // Default to personal leave for general "day off" requests
            matchedType = "Personal Leave";
          } else if (lowerInput.includes("time") && lowerInput.includes("off")) {
            // Default to annual leave for "time off"
            matchedType = "Annual Leave";
          }
        }
        
        if (matchedType) {
          updatedLeaveRequest.leaveType = matchedType;
          updatedLeaveRequest.stage = "startDate";
          
          response = `For your ${matchedType}, when would you like to start?`;
        } else {
          // If we couldn't identify a type, list the options more conversationally
          response = "What type of leave would you like to request? Options include sick leave, annual leave, personal leave, family leave, or bereavement leave.";
        }
        break;
      
      case "startDate":
        // Try to extract a date from the input
        const startDate = leaveInfo.startDate || extractDate(userInput);
        
        if (startDate) {
          // Use the extracted date
          updatedLeaveRequest.startDate = startDate;
          updatedLeaveRequest.stage = "endDate";
          
          const formattedDate = format(startDate, "EEEE, MMMM d");
          response = `Starting ${formattedDate}. Is this just for one day or when will you return?`;
        } else {
          // If we couldn't extract a date, ask again more conversationally
          response = "I need to know when you'd like your leave to start. You can say something like 'today', 'tomorrow', 'next Monday', or a specific date.";
        }
        break;
      
      case "endDate":
        // Check for "same day" or "one day" response
        if (userInput.toLowerCase().match(/\b(same|one|1|single|just one)\s*(day)?\b/) || 
            userInput.toLowerCase().includes("just that day") ||
            userInput.toLowerCase().includes("only that day")) {
          // Use the start date as the end date
          if (updatedLeaveRequest.startDate) {
            updatedLeaveRequest.endDate = updatedLeaveRequest.startDate;
            updatedLeaveRequest.stage = "reason";
            
            const dateStr = format(updatedLeaveRequest.startDate, "MMMM d");
            response = `Got it, just for ${dateStr}. What's the reason for your leave?`;
          }
        } else {
          // Try to extract a date from the input
          const endDate = leaveInfo.endDate || extractDate(userInput);
          
          if (endDate) {
            // Check if end date is after start date
            if (updatedLeaveRequest.startDate && endDate < updatedLeaveRequest.startDate) {
              response = "The return date needs to be on or after the start date. When do you plan to return?";
            } else {
              updatedLeaveRequest.endDate = endDate;
              updatedLeaveRequest.stage = "reason";
              
              const startDateStr = format(updatedLeaveRequest.startDate!, "MMMM d");
              const endDateStr = format(endDate, "MMMM d");
              const days = differenceInDays(endDate, updatedLeaveRequest.startDate!) + 1;
              
              if (days === 1) {
                response = `Just for ${startDateStr}. What's the reason for your leave?`;
              } else {
                response = `${startDateStr} to ${endDateStr} (${days} days). What's the reason for your leave?`;
              }
            }
          } else {
            // If we couldn't extract a date, ask again more conversationally
            response = "When do you plan to return? You can say 'same day' if it's just for one day, or give me a specific date.";
          }
        }
        break;
      
      case "reason":
        // Store the reason
        if (userInput.trim() || leaveInfo.reason) {
          updatedLeaveRequest.reason = leaveInfo.reason || userInput.trim();
          updatedLeaveRequest.stage = "confirm";
          
          // Format the summary in a more conversational way
          const startDateStr = format(updatedLeaveRequest.startDate!, "MMMM d");
          const endDateStr = updatedLeaveRequest.endDate === updatedLeaveRequest.startDate 
            ? "" 
            : ` to ${format(updatedLeaveRequest.endDate!, "MMMM d")}`;
          const days = updatedLeaveRequest.endDate ? differenceInDays(updatedLeaveRequest.endDate, updatedLeaveRequest.startDate!) + 1 : 1;
          
          response = `Here's what I have: ${updatedLeaveRequest.leaveType} from ${startDateStr}${endDateStr} (${days} day${days > 1 ? 's' : ''}) for "${updatedLeaveRequest.reason}". Should I submit this request?`;
        } else {
          response = "I need a reason for your leave request. This helps your manager understand and approve it.";
        }
        break;
      
      case "confirm":
        // Check for confirmation
        if (userInput.toLowerCase().match(/\b(yes|yep|yeah|correct|right|confirm|submit|go ahead|proceed|fine|ok|okay|sounds good|approved|that's right|that's it)\b/)) {
          updatedLeaveRequest.stage = "complete";
          response = "I'm submitting your leave request now...";
        } else if (userInput.toLowerCase().match(/\b(no|nope|wrong|incorrect|not right|change|modify|edit|alter|adjust|fix|update)\b/)) {
          // If user explicitly mentions what to change, try to identify it
          if (userInput.toLowerCase().includes("type") || userInput.toLowerCase().includes("leave type")) {
            updatedLeaveRequest.stage = "type";
            response = "What type of leave would you like instead?";
          } else if (userInput.toLowerCase().includes("date") || userInput.toLowerCase().includes("start") || userInput.toLowerCase().includes("day")) {
            updatedLeaveRequest.stage = "startDate";
            response = "What's the correct start date?";
          } else if (userInput.toLowerCase().includes("end") || userInput.toLowerCase().includes("return")) {
            updatedLeaveRequest.stage = "endDate";
            response = "When will you return from leave?";
          } else if (userInput.toLowerCase().includes("reason")) {
            updatedLeaveRequest.stage = "reason";
            response = "What's the correct reason for your leave?";
          } else {
            // Start over if we can't determine what to change
            updatedLeaveRequest.stage = "type";
            response = "Let's start over. What type of leave are you requesting?";
          }
        } else {
          // Check if the input contains new information that might be updating the request
          const updateInfo = extractLeaveInformation(userInput);
          
          if (updateInfo.leaveType) {
            updatedLeaveRequest.leaveType = updateInfo.leaveType;
            response = "I've updated the leave type. Anything else you'd like to change, or shall I submit the request?";
          } else if (updateInfo.startDate) {
            updatedLeaveRequest.startDate = updateInfo.startDate;
            if (updatedLeaveRequest.endDate && updatedLeaveRequest.endDate < updateInfo.startDate) {
              updatedLeaveRequest.endDate = updateInfo.startDate;
            }
            response = "I've updated the start date. Anything else to change, or should I submit it?";
          } else if (updateInfo.endDate) {
            updatedLeaveRequest.endDate = updateInfo.endDate;
            response = "I've updated the end date. Anything else to change, or should I submit it?";
          } else if (updateInfo.reason) {
            updatedLeaveRequest.reason = updateInfo.reason;
            response = "I've updated the reason. Anything else to change, or shall I submit the request?";
          } else {
            response = "Should I submit this leave request as is? Please say 'yes' to confirm or tell me what you'd like to change.";
          }
        }
        break;
        
      case "complete":
        // This should not happen as the state will be reset after completion
        updatedLeaveRequest.active = false;
        response = "Your leave request has been processed. Is there anything else I can help you with?";
        break;
    }
    
    setLeaveRequest(updatedLeaveRequest);
    return response;
  };

  // Extract multiple pieces of leave information at once from natural language
  const extractLeaveInformation = (text: string): {
    leaveType: string | null,
    startDate: Date | null,
    endDate: Date | null,
    reason: string | null,
    isComplete: boolean
  } => {
    const lowerText = text.toLowerCase();
    let leaveType: string | null = null;
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    let reason: string | null = null;
    
    // Extract leave type using both exact matches and fuzzy matches
    for (const type of leaveTypes) {
      if (lowerText.includes(type.name.toLowerCase())) {
        leaveType = type.name;
        break;
      }
    }
    
    // Use more common keywords if no direct match
    if (!leaveType) {
      if (lowerText.includes("vacation") || lowerText.includes("holiday") || lowerText.includes("annual")) {
        leaveType = "Annual Leave";
      } else if (lowerText.includes("sick") || lowerText.includes("ill") || lowerText.includes("health") || lowerText.includes("doctor")) {
        leaveType = "Sick Leave";
      } else if (lowerText.includes("personal") || lowerText.includes("private")) {
        leaveType = "Personal Leave";
      } else if (lowerText.includes("family") || lowerText.includes("care") || lowerText.includes("relative")) {
        leaveType = "Family Leave";
      } else if (lowerText.includes("bereave") || lowerText.includes("funeral") || lowerText.includes("death")) {
        leaveType = "Bereavement Leave";
      } else if (lowerText.includes("day off") || lowerText.includes("time off")) {
        // Default to Personal Leave for general requests
        leaveType = "Personal Leave";
      }
    }
    
    // Look for date-related keywords and extract dates
    
    // Check for "today" or "tomorrow"
    if (lowerText.includes("today")) {
      startDate = new Date();
    } else if (lowerText.includes("tomorrow")) {
      startDate = addDays(new Date(), 1);
    }
    
    // If no simple keyword match, try to extract dates with more complex patterns
    if (!startDate) {
      // Common patterns like "on Monday", "next Friday", "from June 1"
      const datePatterns = [
        // "on Monday", "this Friday"
        /\b(?:on|this|next) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
        // "from June 1", "starting June 1"
        /\b(?:from|starting|start on|beginning|begin on) (?:the )?(\d{1,2}(?:st|nd|rd|th)? (?:of )?(?:january|february|march|april|may|june|july|august|september|october|november|december)|(?:january|february|march|april|may|june|july|august|september|october|november|december) \d{1,2}(?:st|nd|rd|th)?)\b/i,
        // Date formats MM/DD, MM/DD/YYYY
        /\b(\d{1,2}\/\d{1,2}(?:\/\d{4})?)\b/,
        // YYYY-MM-DD
        /\b(\d{4}-\d{1,2}-\d{1,2})\b/,
      ];
      
      for (const pattern of datePatterns) {
        const match = lowerText.match(pattern);
        if (match) {
          const extractedDate = extractDate(match[0]);
          if (extractedDate) {
            startDate = extractedDate;
            break;
          }
        }
      }
    }
    
    // Look for date ranges and end dates
    if (startDate) {
      // "until Friday", "to June 5", "through next week"
      const endDatePatterns = [
        /\b(?:until|till|to|through) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
        /\b(?:until|till|to|through) (?:the )?(\d{1,2}(?:st|nd|rd|th)? (?:of )?(?:january|february|march|april|may|june|july|august|september|october|november|december)|(?:january|february|march|april|may|june|july|august|september|october|november|december) \d{1,2}(?:st|nd|rd|th)?)\b/i,
        /\b(?:until|till|to|through) (\d{1,2}\/\d{1,2}(?:\/\d{4})?)\b/,
      ];
      
      for (const pattern of endDatePatterns) {
        const match = lowerText.match(pattern);
        if (match) {
          const extractedDate = extractDate(match[0].replace(/\b(?:until|till|to|through)\b/i, ''));
          if (extractedDate) {
            endDate = extractedDate;
            break;
          }
        }
      }
      
      // Check for "for X days"
      const durationMatch = lowerText.match(/\bfor (\d+) days?\b/i);
      if (durationMatch && startDate) {
        const days = parseInt(durationMatch[1]);
        if (!isNaN(days) && days > 0) {
          endDate = addDays(startDate, days - 1); // -1 because the start day counts
        }
      }
      
      // If we have a start date but no end date, and there's no indication it's multiple days,
      // assume it's a single day request
      if (!endDate && (
        lowerText.includes("just one day") || 
        lowerText.includes("just for one day") || 
        lowerText.includes("single day") || 
        lowerText.includes("one day") ||
        lowerText.includes("a day") ||
        (lowerText.includes("day") && !lowerText.includes("days"))
      )) {
        endDate = startDate;
      }
    }
    
    // Try to extract reason
    // This is more complex as reasons can be varied, but we can look for common patterns
    const reasonPatterns = [
      /\b(?:because|as|since|due to|for) (.*?)(?:\.|\?|$)/i, // Match "because I'm sick" or "due to illness."
      /\b(?:reason is|reason being) (.*?)(?:\.|\?|$)/i, // Match "reason is I have a doctor's appointment"
      /\bI(?:'m| am) (sick|ill|not feeling well|unwell)/i, // Match common illness phrases
      /\b(?:doctor'?s |dental |medical |family )(?:appointment|emergency)/i, // Match medical appointments
      /\b(?:family|personal) (?:matter|emergency|issue)/i, // Match personal emergencies
      /\bneed (?:to|a) (.*?)(?:\.|\?|$)/i, // Match "need to take care of something"
    ];
    
    for (const pattern of reasonPatterns) {
      const match = text.match(pattern);
      if (match) {
        reason = match[1] ? match[1].trim() : match[0].trim();
        break;
      }
    }
    
    // If we couldn't extract a specific reason but we have a leave type,
    // we can use the leave type as a basic reason
    if (!reason && leaveType) {
      // For sick leave, having "sick" is sufficient reason
      if (leaveType === "Sick Leave") {
        reason = "Sick leave";
      } else if (leaveType === "Annual Leave") {
        reason = "Annual leave";
      } else if (leaveType === "Personal Leave") {
        reason = "Personal matters";
      }
    }
    
    // Check if we have complete information to create a leave request
    const isComplete = 
      leaveType !== null && 
      startDate !== null && 
      endDate !== null && 
      reason !== null;
    
    return {
      leaveType,
      startDate,
      endDate,
      reason,
      isComplete
    };
  };

  // Submit the leave request to the database
  const submitLeaveRequest = async () => {
    try {
      const { leaveType, startDate, endDate, reason } = leaveRequest;
      
      if (!leaveType || !startDate || !endDate || !reason) {
        throw new Error("Incomplete leave request information");
      }
      
      // API call to submit leave request
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
          leaveType,
          reason,
        }),
      });
      
      // Read the response content
      const responseData = await response.json().catch(() => null);
      
      if (response.ok) {
        // Add success message
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `✅ Your leave request has been submitted successfully!\n\n` +
              `The request ID is **${responseData?.id || "Unknown"}**. Your manager will review your request soon. ` +
              `You'll receive a notification when it's approved or if any additional information is required.`
          }
        ]);
        
        // Reset leave request state
        setLeaveRequest({
          active: false,
          stage: "type",
          leaveType: "",
          startDate: null,
          endDate: null,
          reason: ""
        });
        
        toast.success("Leave request submitted successfully");
      } else {
        // Handle specific error responses
        let errorMessage = "Failed to submit leave request to the server.";
        
        if (responseData) {
          if (responseData.error === "Database error") {
            errorMessage = `There was a database error: ${responseData.details || 'Unknown database issue'}`;
            console.error("Database error details:", responseData);
          } else if (responseData.message) {
            errorMessage = responseData.message;
          }
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `❌ I'm sorry, there was an error submitting your leave request: ${error instanceof Error ? error.message : "Unknown error"}. Please try again later or contact HR directly.`
        }
      ]);
      
      toast.error("Failed to submit leave request");
      
      // Reset leave request state
      setLeaveRequest({
        active: false,
        stage: "type",
        leaveType: "",
        startDate: null,
        endDate: null,
        reason: ""
      });
    }
  };

  // Handle effect for leave request completion
  useEffect(() => {
    if (leaveRequest.active && leaveRequest.stage === "complete") {
      submitLeaveRequest();
    }
  }, [leaveRequest]);

  // Streaming API implementation
  async function handleSubmitStreaming(e: React.FormEvent) {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
    // Store user message
    const userMessage: Message = { role: "user", content: input };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Track current length which is where we'll insert the AI response
    const userMessageIndex = messages.length;
    const assistantMessageIndex = userMessageIndex + 1;
    
    // First, check if we're in an active leave request conversation
    if (leaveRequest.active) {
      // Process the input based on current stage of leave request
      const response = processLeaveRequestInput(input);
      
      // Add the response as an assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response }
      ]);
      
      setIsLoading(false);
      return;
    }
    
    // Check for leave request intent
    const lowerInput = input.toLowerCase();
    const isLeaveRequestIntent = isLeaveRelated(lowerInput);
    
    // Start a leave request conversation if detected
    if (isLeaveRequestIntent && 
        (lowerInput.includes("request") || 
         lowerInput.includes("need") || 
         lowerInput.includes("want") || 
         lowerInput.includes("take"))) {
      
      setLeaveRequest({
        ...leaveRequest,
        active: true
      });
      
      // Initial response to start the leave request process
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: "I'd be happy to help you request leave. What type of leave would you like to request? Here are the available options:\n\n" +
            leaveTypes.map(type => `- **${type.name}**: ${type.description} (Maximum ${type.maxDays} days)`).join("\n")
        }
      ]);
      
      setIsLoading(false);
      return;
    }
    
    // Create an initial AI response message with empty content
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);
    
    // Initialize accumulatedContent at the function level so it's available throughout
    let accumulatedContent = "";
    
    try {
      // Get all messages except the last empty one for context
      const conversationHistory = messages.concat(userMessage);
      
      debugLog("Sending to WatsonX API", {
        messageCount: conversationHistory.length,
        userMessage: userMessage.content.substring(0, 50) + "..."
      });
      
      // Call the API with streaming response
      const response = await fetch("/api/watsonx-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          streaming: true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            debugLog("Stream completed");
            break;
          }
          
          // Decode and parse the chunk
          const chunk = decoder.decode(value, { stream: true });
          debugLog("Received chunk", { chunkLength: chunk.length });
          
          // Process the chunk line by line
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                // Extract the JSON data
                const jsonStr = line.replace("data: ", "");
                if (jsonStr.trim() === "") continue;
                if (jsonStr === "[DONE]") break;
                
                const data = JSON.parse(jsonStr);
                const text = data.generated_text || "";
                // Use the role from the response if available, otherwise default to assistant
                const role = data.role || "assistant";
                
                if (text) {
                  accumulatedContent += text;
                  
                  // Update the AI message while preserving the user message
                  setMessages(current => {
                    // Create a copy of the current messages
                    const updated = [...current];
                    
                    // Make sure we're updating the assistant message, not overwriting the user message
                    if (updated.length > assistantMessageIndex && updated[assistantMessageIndex]) {
                      updated[assistantMessageIndex] = {
                        role: role,
                        content: accumulatedContent
                      };
                    }
                    
                    return updated;
                  });
                }
              } catch (err) {
                console.error("Error parsing streaming response:", err);
              }
            }
          }
        }
      }
      
      // Check if the generated response contains a leave request suggestion
      // If it does, we'll follow up with a more direct question
      if (isLeaveRelated(accumulatedContent) && !leaveRequest.active) {
        setTimeout(() => {
          setMessages(prev => {
            const existingMessages = [...prev];
            return [
              ...existingMessages,
              { 
                role: "assistant", 
                content: "It sounds like you might be interested in requesting leave. Would you like me to help you submit a leave request? Please respond with 'yes' if you'd like to proceed." 
              }
            ];
          });
        }, 1000);
      }
      
    } catch (error) {
      console.error("Error in chat:", error);
      
      // Add error message while preserving the user message
      setMessages(current => {
        const updated = [...current];
        
        // Make sure we're updating the assistant message at the correct index
        if (updated.length > assistantMessageIndex && updated[assistantMessageIndex].role === "assistant" && updated[assistantMessageIndex].content === "") {
          updated[assistantMessageIndex] = {
            role: "assistant",
            content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
          };
        }
        
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Use streaming API for better interactive experience
  const handleSubmit = handleSubmitStreaming;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
              isOpen
                ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 scale-95"
                : "bg-gradient-to-br from-primary to-primary-deep text-white hover:opacity-90"
            )}
            aria-label={isOpen ? "Close chat" : "Open chat"}
          >
            {isOpen ? 
              <X className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-200 ease-out" /> 
              : 
              <div className="relative">
                <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-200 ease-out" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
              </div>
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[340px] sm:w-[450px] p-0 rounded-2xl shadow-2xl border-0 overflow-hidden",
            "transition-all duration-300 ease-in-out",
            isDarkTheme 
              ? "bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md" 
              : "bg-gradient-to-b from-white/98 to-gray-50/98 backdrop-blur-md"
          )}
          side="top"
          align="end"
          sideOffset={20}
        >
          <div className="flex flex-col h-[540px] sm:h-[600px]">
            {/* Chat header */}
            <div 
              className={cn(
                "flex items-center p-4 sm:p-5 border-b",
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              )}
            >
              <div className="relative">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 mr-3 sm:mr-4 shadow-md bg-gradient-to-br from-primary to-primary-deep">
                  <AvatarFallback className="text-white">
                    <BotIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -right-1 -bottom-1 h-4 w-4 bg-accent rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-medium">Sani Assistant</h3>
                <p className="text-xs text-muted-foreground">WatsonX AI Health Assistant</p>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            
            {/* Messages container */}
            <div 
              className={cn(
                "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4",
                isDarkTheme ? "bg-gray-900/30" : "bg-gray-50/30"
              )}
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isLastMessage={index === messages.length - 1}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3 max-w-[85%] my-2">
                  <TypingIndicator />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <form 
              onSubmit={handleSubmit} 
              className={cn(
                "p-3 sm:p-4 border-t flex items-center gap-3",
                "transition-all duration-200",
                isDarkTheme ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white/50"
              )}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className={cn(
                  "flex-1 text-sm h-10 sm:h-11 bg-transparent border",
                  "rounded-full px-4 transition-all duration-200 focus-visible:ring-primary",
                  isDarkTheme ? "border-gray-700 focus-visible:border-primary" : "border-gray-300 focus-visible:border-primary"
                )}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className={cn(
                  "h-10 w-10 sm:h-11 sm:w-11 rounded-full shadow-md transition-all duration-200",
                  "bg-gradient-to-br from-primary to-primary-deep hover:opacity-90"
                )}
                disabled={isLoading || input.trim() === ""}
              >
                <Send className="h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-4 py-3 rounded-2xl flex items-center space-x-1.5">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "600ms" }}></div>
      </div>
    </div>
  );
} 