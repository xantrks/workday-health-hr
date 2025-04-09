import { WATSONX_CONFIG } from '@/lib/env';

// Define message type interface
interface ChatMessage {
  role: string;
  content: string;
}

// System message from environment variables
const SYSTEM_MESSAGE = {
  role: "system",
  content: WATSONX_CONFIG.SYSTEM_MESSAGE || `You are Sanicle's WatsonX AI assistant. Format your responses using Markdown:
  - Use proper headers with ## for main titles and ### for subtitles
  - Format lists correctly with proper spacing
  - Use **bold** for emphasis
  - Separate paragraphs with blank lines
  - Use bullet points with * or - followed by a space
  - Number lists with 1. 2. etc. followed by a space
  - Format your response clearly and concisely
  - Always identify yourself as the WatsonX AI assistant when introducing yourself`
};

// Mock responses to use when the API is unavailable
const MOCK_RESPONSES: {[key: string]: string} = {
  "hi": "Hello! I'm the Sanicle WatsonX AI assistant. While I'm currently in offline mode due to configuration issues, I'd be happy to assist you once the system is properly set up.",
  "hello": "Hi there! I'm the Sanicle WatsonX AI assistant. I'm currently operating in fallback mode as my main services are being configured. Please check back later when I'm fully operational.",
  "how are you": "I'm functioning in limited capacity at the moment due to some configuration issues with my WatsonX AI services. Thank you for your patience!",
  "help": "I'm the Sanicle WatsonX AI assistant, currently in offline mode. Once fully configured, I'll be able to assist with various health and wellness questions.",
  "default": "Thank you for your message. I'm the Sanicle WatsonX AI assistant, but I'm currently running in offline mode due to configuration issues. Please contact the system administrator to update the WatsonX API credentials."
};

// Function to get a mock response based on user input
function getMockResponse(userMessage: string): string {
  const lowercaseMessage = userMessage.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lowercaseMessage.includes(key)) {
      return response;
    }
  }
  
  return MOCK_RESPONSES.default;
}

export async function POST(req: Request) {
  try {
    const { messages, streaming = false } = await req.json();
    
    // Get the last user message for fallback responses
    const lastUserMessage = messages.filter((msg: ChatMessage) => msg.role === "user").pop()?.content || "";
    
    // Check if API key and deployment ID are properly configured
    if (!WATSONX_CONFIG.API_KEY || !WATSONX_CONFIG.DEPLOYMENT_ID) {
      console.warn("WatsonX API key or deployment ID is missing. Using fallback response.");
      const mockResponse = getMockResponse(lastUserMessage);
      
      if (streaming) {
        // Simulate a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ generated_text: mockResponse })}\n\n`));
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        });
      } else {
        return Response.json({ generated_text: mockResponse });
      }
    }
    
    try {
      // Get IBM Cloud IAM token
      const tokenResponse = await fetch(WATSONX_CONFIG.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_CONFIG.API_KEY}`
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get IAM token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Choose the correct endpoint URL (streaming or non-streaming)
      const endpointUrl = streaming
        ? `${WATSONX_CONFIG.API_URL}/${WATSONX_CONFIG.DEPLOYMENT_ID}/ai_service_stream?version=${WATSONX_CONFIG.VERSION}`
        : `${WATSONX_CONFIG.API_URL}/${WATSONX_CONFIG.DEPLOYMENT_ID}/ai_service?version=${WATSONX_CONFIG.VERSION}`;

      console.log("Using endpoint URL:", endpointUrl);

      // Add the system message at the beginning to guide AI to use correct Markdown format
      const messagesWithSystem = [SYSTEM_MESSAGE, ...messages];
      
      console.log("Sending to IBM watsonx.ai:", JSON.stringify({ messages: messagesWithSystem }));

      // Call watsonx ai interface
      const watsonxResponse = await fetch(
        endpointUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ messages: messagesWithSystem })
        }
      );

      if (!watsonxResponse.ok) {
        const errorText = await watsonxResponse.text();
        console.error("watsonx.ai error response:", errorText);
        throw new Error(`Failed to get response from watsonx ai: ${watsonxResponse.status} ${errorText}`);
      }

      // Handle response based on whether it's a streaming request
      if (streaming) {
        // If streaming, return the response stream directly
        return new Response(watsonxResponse.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        });
      } else {
        // If not streaming, return the JSON response
        const responseData = await watsonxResponse.json();
        console.log("watsonx.ai response:", JSON.stringify(responseData));
        return Response.json(responseData);
      }
    } catch (error: any) {
      console.error('Error calling WatsonX API:', error);
      
      // Return a fallback response
      const mockResponse = getMockResponse(lastUserMessage);
      
      if (streaming) {
        // Simulate a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ generated_text: mockResponse })}\n\n`));
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        });
      } else {
        return Response.json({ generated_text: mockResponse });
      }
    }
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: 'Failed to get AI response', details: errorMessage },
      { status: 500 }
    );
  }
} 