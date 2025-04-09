import endent from "endent";
import { NextRequest, NextResponse } from "next/server";

// Import these modules from lib
import { WATSONX_CONFIG } from '@/lib/env';
import { getWatsonxResponse, ChatMessage } from "@/lib/watsonx";

// Enable detailed debugging for deployed environments
const DEBUG = true;

function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[WATSONX_API_DEBUG] ${message}`, data || '');
  }
}

// System message guiding the AI to use correct Markdown formatting
const SYSTEM_MESSAGE: ChatMessage = {
  role: "system",
  content: `You are Sanicle's WatsonX AI assistant. Format your responses using Markdown:
  - Use proper headers with ## for main titles and ### for subtitles
  - Format lists correctly with proper spacing
  - Use **bold** for emphasis
  - Separate paragraphs with blank lines
  - Use bullet points with * or - followed by a space
  - Number lists with 1. 2. etc. followed by a space
  - Format your response clearly and concisely`
};

export async function POST(req: NextRequest) {
  debugLog("API route called");
  const startTime = Date.now();
  
  try {
    // Parse the request
    const body = await req.json();
    const { messages, streaming = false } = body;
    
    debugLog("Request received", { 
      messageCount: messages?.length || 0,
      streaming,
      bodyKeys: Object.keys(body)
    });
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      debugLog("Invalid messages format", { messages });
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }
    
    // Extract the last user message for logging
    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage.content || "";
    
    debugLog("Processing user input", { userInput: userInput.substring(0, 100) + "..." });
    
    // Get API key for WatsonX
    const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
    const MOCK_API = process.env.MOCK_API === "true";
    
    debugLog("Environment", { 
      apiKeyExists: !!WATSONX_API_KEY,
      mockApi: MOCK_API,
      mockApiEnv: process.env.MOCK_API
    });
    
    // Force mock mode during development to avoid API errors
    const forceMockMode = false;  // Set to false in production
    
    // When running in mock mode or API key is missing, return a mock response
    if (forceMockMode || MOCK_API || !WATSONX_API_KEY) {
      debugLog("Using mock response", { 
        reason: forceMockMode ? "Force mock mode enabled" : 
                MOCK_API ? "MOCK_API enabled" : 
                "API key missing" 
      });
      
      return generateMockResponse(userInput, streaming);
    }
    
    // Add system message to guide AI's markdown formatting
    const messagesWithSystem = [
      SYSTEM_MESSAGE,
      ...messages
    ];
    
    debugLog("Prepared messages for API call", { 
      totalMessages: messagesWithSystem.length,
      hasSystemMessage: messagesWithSystem[0].role === 'system'
    });
    
    // Call WatsonX API
    debugLog("Calling WatsonX API");
    
    try {
      const response = await getWatsonxResponse(messagesWithSystem, streaming);
      
      if (!response.ok) {
        const errorResponse = await response.text();
        debugLog("WatsonX API error", { 
          status: response.status, 
          statusText: response.statusText,
          errorResponse
        });
        
        // Extract error details if possible
        let errorDetails = errorResponse;
        try {
          const errorJson = JSON.parse(errorResponse);
          errorDetails = errorJson.error || 
                       (errorJson.errors && errorJson.errors[0]?.message) ||
                       errorJson.message ||
                       errorResponse;
        } catch (e) {
          // Not JSON, use raw response
        }
        
        debugLog("Falling back to mock mode due to API error", { 
          status: response.status,
          errorDetails
        });
        
        // Fall back to mock mode for any API error
        return generateMockResponse(userInput, streaming);
      }

      // Return streaming response directly
      if (streaming) {
        debugLog("Returning streaming response from WatsonX");
        return new NextResponse(response.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
      
      // Handle standard response
      debugLog("Processing standard response from WatsonX");
      const responseData = await response.json();
      debugLog("Received response data", { 
        dataKeys: Object.keys(responseData),
        responseType: typeof responseData
      });
      
      const endTime = Date.now();
      debugLog(`Request completed in ${endTime - startTime}ms`);
      
      return NextResponse.json(responseData);
    } catch (error) {
      // Handle any errors that occurred during the API call
      const endTime = Date.now();
      debugLog(`Request failed after ${endTime - startTime}ms`, { 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      debugLog("Falling back to mock mode due to API error", { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Fall back to mock mode
      return generateMockResponse(userInput, streaming);
    }
  } catch (error) {
    const endTime = Date.now();
    debugLog(`Request failed after ${endTime - startTime}ms`, { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    // Fall back to mock mode for any error
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Extract mock response generation to a separate function that handles streaming too
function generateMockResponse(userInput: string, streaming: boolean = false): NextResponse {
  const mockResponseText = generateMockResponseText(userInput);
  
  // Delay response to simulate API call
  // Note: In a real implementation, we'd use await, but for streaming we handle delays differently
  
  if (streaming) {
    debugLog("Returning streaming mock response");
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const parts = mockResponseText.split(' ');
        let delay = 0;
        
        parts.forEach((part, index) => {
          delay += 30 + Math.random() * 70;
          setTimeout(() => {
            const packet = {
              generated_text: part + (index < parts.length - 1 ? ' ' : '')
            };
            const data = `data: ${JSON.stringify(packet)}\n\n`;
            controller.enqueue(encoder.encode(data));
            
            if (index === parts.length - 1) {
              debugLog("Mock streaming completed");
              controller.close();
            }
          }, delay);
        });
      }
    });
    
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } else {
    // For non-streaming, simulate a delay
    debugLog("Returning standard mock response");
    return NextResponse.json({
      results: [{ generated_text: mockResponseText }]
    });
  }
}

// Generate a mock response text based on the input
function generateMockResponseText(input: string): string {
  debugLog("Generating mock response for input", { 
    input: input.substring(0, 50) + (input.length > 50 ? "..." : "") 
  });
  
  // Check for common questions
  const inputLower = input.toLowerCase();
  
  if (inputLower.includes("hello") || inputLower.includes("hi")) {
    return "Hello! I'm the Sanicle AI assistant. How can I help you today?";
  }
  
  if (inputLower.includes("who are you") || inputLower.includes("what are you")) {
    return "I'm an AI assistant powered by IBM's WatsonX technology. I'm here to help with information about Sanicle Health.";
  }
  
  if (inputLower.includes("sanicle") || inputLower.includes("company") || inputLower.includes("business")) {
    return "Sanicle is a healthcare technology company focused on improving clinical workflows and enhancing patient care through innovative AI solutions.";
  }
  
  if (inputLower.includes("watsonx") || inputLower.includes("model")) {
    return "I'm powered by IBM's WatsonX, an enterprise-grade AI platform that provides robust, secure, and scalable AI capabilities for businesses.";
  }
  
  if (inputLower.includes("help") || inputLower.includes("support")) {
    return "I can help answer questions about Sanicle, our services, and how our technology works. What specific information are you looking for?";
  }
  
  if (inputLower.includes("contact") || inputLower.includes("email") || inputLower.includes("phone")) {
    return "You can contact the Sanicle team through the contact form on our website, or by emailing info@sanicle.ai";
  }
  
  // Generic responses for other inputs
  const genericResponses = [
    "That's an interesting question. While I'm just a demo assistant, the actual Sanicle AI platform provides advanced clinical decision support.",
    "The Sanicle platform uses AI to analyze clinical data and provide actionable insights to healthcare providers.",
    "Sanicle's technology helps reduce administrative burden for healthcare professionals, allowing them to focus more on patient care.",
    "As a demo, I have limited knowledge. But Sanicle's actual AI solutions are designed to improve clinical workflows and patient outcomes.",
    "Sanicle's mission is to enhance healthcare delivery through intelligent technology solutions that support clinical decision-making."
  ];
  
  // Return a response based on input length to create some variability
  const index = (input.length % genericResponses.length);
  return genericResponses[index];
} 