// This file handles the API interactions with IBM WatsonX AI

import endent from "endent";
import { NextResponse } from "next/server";

import { WATSONX_CONFIG } from './env';

// Define message format for the WatsonX chat API
export interface ChatMessage {
  role: string;
  content: string;
}

// Define the default system message for WatsonX AI
export const DEFAULT_SYSTEM_MESSAGE: ChatMessage = {
  role: "system",
  content: `You are Sanicle's women's health assistant powered by WatsonX AI. Your role is to provide supportive conversations about women's physiological and psychological health. Focus on these key areas:

  1. Menstrual health: Provide evidence-based information about cycle tracking, symptoms, and wellness tips
  2. Reproductive health: Discuss general topics around fertility, pregnancy, and reproductive conditions
  3. Mental wellbeing: Offer supportive conversation about mood changes, stress management, and emotional health
  4. General wellness: Provide guidance on nutrition, exercise, and lifestyle choices that support women's health
  5. Leave management: Help employees create and submit leave requests

  Guidelines for your responses:
  - Provide compassionate, judgment-free support
  - Base all health information on established medical knowledge
  - Clarify that you're not providing medical diagnosis or treatment
  - Encourage users to consult healthcare providers for personal medical concerns
  - Respect privacy and maintain a supportive tone
  - Format your responses using proper Markdown
  - Use proper headers with ## for main titles and ### for subtitles
  - Format lists correctly with proper spacing
  - Use **bold** for emphasis
  - Separate paragraphs with blank lines`
};

// Debugging utility 
const DEBUG = true;
function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[WATSONX_LIB_DEBUG] ${message}`, data || '');
  }
}

// Function to get WatsonX response
export async function getWatsonxResponse(
  messages: ChatMessage[],
  streaming: boolean = false
): Promise<Response> {
  const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
  const WATSONX_API_URL = process.env.NEXT_PUBLIC_WATSONX_API_URL || 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments';
  const WATSONX_DEPLOYMENT_ID = process.env.WATSONX_DEPLOYMENT_ID || '';

  if (!WATSONX_API_KEY) {
    throw new Error("WatsonX API key is not configured");
  }

  debugLog("Preparing WatsonX request", { 
    streaming, 
    messageCount: messages.length,
    deploymentId: WATSONX_DEPLOYMENT_ID
  });

  try {
    // Convert messages to WatsonX format
    const formattedMessages = messages.map(message => ({
      role: message.role,
      content: message.content
    }));

    // Create model payload
    const payload = {
      model_id: "meta-llama/llama-3-70b-instruct",
      input: formattedMessages,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 1024,
        min_new_tokens: 0,
        temperature: 0.7,
        ...(streaming ? { stream: true } : {})
      }
    };

    // API headers
    const headers = {
      "Content-Type": "application/json",
      "Accept": streaming ? "text/event-stream" : "application/json",
      "Authorization": `Bearer ${WATSONX_API_KEY}`
    };

    // Construct the URL with deployment ID
    const apiUrl = `${WATSONX_API_URL}/${WATSONX_DEPLOYMENT_ID}/chat/completions`;
    
    debugLog("Calling WatsonX API", { 
      url: apiUrl,
      streaming,
      headerKeys: Object.keys(headers)
    });

    // Make the API call
    return fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
  } catch (error) {
    debugLog("Error in getWatsonxResponse", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
}

// Helper functions for leave request functionality
export async function generateLeaveTypeOptions() {
  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Personal Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Medical Leave",
    "Family Leave",
    "Bereavement Leave"
  ];
  
  return { leaveTypes };
}

export async function generateLeaveReasonSuggestions(leaveType: string) {
  let suggestions = [];
  
  switch(leaveType) {
    case "Annual Leave":
      suggestions = ["Vacation", "Personal time off", "Family holiday", "Rest and recharge"];
      break;
    case "Sick Leave":
      suggestions = ["Feeling unwell", "Doctor's appointment", "Recovery from illness", "Medical procedure"];
      break;
    case "Personal Leave":
      suggestions = ["Personal matter", "Family emergency", "House move", "Administrative errands"];
      break;
    case "Maternity Leave":
      suggestions = ["Childbirth", "Prenatal care", "Postnatal recovery", "Newborn care"];
      break;
    case "Paternity Leave":
      suggestions = ["Birth of child", "Supporting partner", "Newborn care", "Family bonding"];
      break;
    case "Medical Leave":
      suggestions = ["Scheduled surgery", "Medical treatment", "Specialist appointment", "Medical recovery"];
      break;
    case "Family Leave":
      suggestions = ["Care for family member", "Family emergency", "Childcare", "Elder care"];
      break;
    case "Bereavement Leave":
      suggestions = ["Loss of family member", "Funeral attendance", "Grief period", "Family support"];
      break;
    default:
      suggestions = ["Time off request", "Personal day", "Scheduled absence"];
  }
  
  return { suggestions };
}

export async function validateLeaveRequest(startDate: string, endDate: string, leaveType: string, reason: string) {
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  // Basic validation
  const isValid = 
    start instanceof Date && !isNaN(start.getTime()) &&
    end instanceof Date && !isNaN(end.getTime()) &&
    start <= end &&
    leaveType && leaveType.trim() !== "" &&
    reason && reason.trim() !== "";
  
  // Additional validations
  const messages = [];
  
  if (start < today) {
    messages.push("Start date cannot be in the past");
  }
  
  if (end < start) {
    messages.push("End date must be after start date");
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (leaveType === "Sick Leave" && diffDays > 14) {
    messages.push("Sick leave requests exceeding 14 days require medical documentation");
  }
  
  if (leaveType === "Annual Leave" && diffDays > 30) {
    messages.push("Annual leave requests exceeding 30 days require manager pre-approval");
  }
  
  return {
    isValid: isValid && messages.length === 0,
    messages: messages.length > 0 ? messages : ["Leave request is valid"]
  };
} 