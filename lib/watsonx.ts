// This file handles the API interactions with IBM WatsonX AI

import { WATSONX_CONFIG } from './env';

// Define message format for the WatsonX chat API
export interface ChatMessage {
  role: string;
  content: string;
}

// Debugging utility 
const DEBUG = true;
function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[WATSONX_LIB_DEBUG] ${message}`, data || '');
  }
}

/**
 * Gets an IAM token from IBM Cloud using the API key
 */
async function getIBMCloudToken(): Promise<string> {
  if (!WATSONX_CONFIG.API_KEY) {
    throw new Error('WatsonX API key is not configured');
  }
  
  debugLog("Getting IBM Cloud token");
  
  try {
    const response = await fetch(WATSONX_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_CONFIG.API_KEY}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      debugLog("Token fetch error", { status: response.status, error: errorText });
      throw new Error(`Failed to get IAM token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    debugLog("Token received successfully");
    return data.access_token;
  } catch (error) {
    debugLog("Token fetch exception", { error });
    throw error;
  }
}

/**
 * Make a request to the WatsonX AI service using the chat API
 */
export async function getWatsonxResponse(
  messages: ChatMessage[],
  streaming: boolean = false
): Promise<Response> {
  debugLog("Preparing WatsonX request", { 
    streaming, 
    messageCount: messages.length 
  });
  
  if (!WATSONX_CONFIG.DEPLOYMENT_ID) {
    throw new Error('WatsonX deployment ID is not configured');
  }
  
  try {
    // Get IBM Cloud token
    const token = await getIBMCloudToken();
    
    // Determine endpoint URL based on streaming mode
    const endpointUrl = streaming
      ? `${WATSONX_CONFIG.API_URL}/${WATSONX_CONFIG.DEPLOYMENT_ID}/ai_service_stream?version=${WATSONX_CONFIG.VERSION}`
      : `${WATSONX_CONFIG.API_URL}/${WATSONX_CONFIG.DEPLOYMENT_ID}/ai_service?version=${WATSONX_CONFIG.VERSION}`;
    
    debugLog("Calling WatsonX API endpoint", { 
      url: endpointUrl, 
      deploymentId: WATSONX_CONFIG.DEPLOYMENT_ID,
      messageCount: messages.length
    });
    
    // Prepare the payload
    const payload = { messages };
    
    debugLog("Request payload", { 
      payload: { 
        messages: messages.map(m => ({
          role: m.role,
          content: m.content.length > 50 ? 
            m.content.substring(0, 50) + "..." : 
            m.content
        }))
      } 
    });
    
    // Make request to WatsonX API
    return fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': streaming ? 'text/event-stream' : 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    debugLog("Error in getWatsonxResponse", { error });
    throw error;
  }
} 