"use client";

import { Send, X, MessageSquare, BotIcon, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useRef, useEffect } from "react";

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
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm Sanicle's women's health assistant. I'm here to chat with you about physiological and psychological health topics. How can I support you today?",
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

  // Non-streaming API implementation
  async function handleSubmitStandard(e: React.FormEvent) {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
    debugLog("Submitting message via standard API", { message: input });
    
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      debugLog("Fetching from /api/watsonx-chat endpoint");
      const startTime = Date.now();
      
      const response = await fetch("/api/watsonx-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          streaming: false,
        }),
      });
      
      const endTime = Date.now();
      debugLog(`API request completed in ${endTime - startTime}ms with status ${response.status}`);
      
      if (!response.ok) {
        // Handle HTTP errors gracefully
        debugLog("API Error response", { 
          status: response.status, 
          statusText: response.statusText 
        });
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      debugLog("API response received", data);
      
      // Adjust parsing logic based on watsonx.ai response structure
      let assistantMessage = "Sorry, I couldn't process your request. Please try again.";
      
      // Add logging based on error messages
      if (data.error) {
        debugLog("Error from API", { error: data.error, details: data.details });
        
        // Handle specific deployment not found error with a helpful message
        if (data.details && data.details.includes("deployment_not_found")) {
          assistantMessage = "I'm sorry, but the WatsonX AI service is currently unavailable. The deployment configuration needs to be updated.";
        } else {
          assistantMessage = `I encountered an issue: ${data.error}. Please try again later.`;
        }
      } else {
        // Check different possible response structures - prioritize the sample project's expected format
        debugLog("Parsing response data structure");
        
        if (data.results && Array.isArray(data.results) && data.results[0]?.generated_text) {
          debugLog("Found response in data.results[0].generated_text");
          assistantMessage = data.results[0].generated_text;
        } else if (data.generated_text) {
          debugLog("Found response in data.generated_text");
          assistantMessage = data.generated_text;
        } else if (data.result && data.result.generated_text) {
          debugLog("Found response in data.result.generated_text");
          assistantMessage = data.result.generated_text;
        } else if (data.choices && data.choices[0]?.message?.content) {
          debugLog("Found response in data.choices[0].message.content");
          assistantMessage = data.choices[0].message.content;
        } else {
          debugLog("WARNING: Could not find response in any expected location", data);
        }

        // Log the parsed message
        debugLog("Parsed assistant message:", assistantMessage.substring(0, 50) + "...");
      }
      
      // Make sure we have a valid message to display
      if (!assistantMessage || assistantMessage.trim() === "") {
        debugLog("WARNING: Empty response received");
        assistantMessage = "I received your message but couldn't generate a proper response. Please try again.";
      }
      
      setMessages((prev: Message[]) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      debugLog("Error during API call", { 
        message: error instanceof Error ? error.message : String(error),
        error 
      });
      
      // Provide a fallback response when API is unavailable
      const fallbackResponses = [
        "I'm sorry, but I'm having trouble connecting to my backend services. Please try again later.",
        "The WatsonX AI service is currently unavailable. This may be due to missing or invalid API credentials.",
        "I encountered a network issue. The system administrator needs to check the WatsonX API configuration.",
        "I apologize for the inconvenience, but I can't process your request right now due to a service configuration issue."
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      debugLog("Using fallback response", { response: randomFallback });
      
      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          content: randomFallback,
        },
      ]);
    } finally {
      setIsLoading(false);
      debugLog("Request handling completed");
    }
  }

  // Streaming API implementation
  async function handleSubmitStreaming(e: React.FormEvent) {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
    debugLog("Submitting message via streaming API", { message: input });
    
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Create an initial AI response message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);
    
    try {
      debugLog("Fetching from streaming API endpoint");
      const startTime = Date.now();
      
      const response = await fetch("/api/watsonx-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          streaming: true,
        }),
      });
      
      const endTime = Date.now();
      debugLog(`Streaming API request initiated in ${endTime - startTime}ms with status ${response.status}`);
      
      if (!response.ok) {
        // Handle HTTP errors gracefully
        debugLog("API Error response", { 
          status: response.status, 
          statusText: response.statusText 
        });
        throw new Error(`API Error: ${response.status}`);
      }
      
      // Handle SSE response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is null");
      
      let partialResponse = "";
      let chunkCounter = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          debugLog("Stream completed after receiving", { 
            chunkCount: chunkCounter,
            totalResponseLength: partialResponse.length
          });
          break;
        }
        
        // Decode chunk
        const chunk = new TextDecoder().decode(value);
        chunkCounter++;
        
        // Parse SSE data
        const lines = chunk.split('\n');
        let parsedChunk = "";
        
        debugLog(`Processing chunk #${chunkCounter}`, { chunkSize: chunk.length });
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const jsonData = JSON.parse(line.substring(5));
              debugLog("Parsed SSE JSON data", { dataKeys: Object.keys(jsonData) });
              
              if (jsonData.generated_text) {
                parsedChunk += jsonData.generated_text;
              } else if (jsonData.results && Array.isArray(jsonData.results) && jsonData.results[0]?.generated_text) {
                parsedChunk += jsonData.results[0].generated_text;
              } else if (jsonData.choices && jsonData.choices[0]?.delta?.content) {
                parsedChunk += jsonData.choices[0].delta.content;
              } else if (jsonData.error) {
                debugLog("Error in stream", { error: jsonData.error });
                throw new Error(jsonData.error);
              }
            } catch (e) {
              debugLog("Failed to parse JSON from SSE", {
                error: e instanceof Error ? e.message : String(e), 
                line: line.substring(0, 100) + "..."
              });
            }
          }
        }
        
        // Update partialResponse
        partialResponse += parsedChunk;
        debugLog("Updated partial response", { 
          newContentLength: parsedChunk.length,
          totalLength: partialResponse.length 
        });
        
        // Update the last message
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: partialResponse || "Processing your request...",
          };
          return updatedMessages;
        });
      }

      // If we ended up with an empty response, provide a fallback
      if (!partialResponse || partialResponse.trim() === "") {
        debugLog("WARNING: Empty streaming response received");
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: "I received your message but couldn't generate a proper response. Please try again.",
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      debugLog("Error during streaming API call", { 
        message: error instanceof Error ? error.message : String(error),
        error 
      });
      
      // Provide a fallback response when API is unavailable
      const fallbackResponses = [
        "I'm sorry, but I'm having trouble connecting to my backend services. Please try again later.",
        "The WatsonX AI service is currently unavailable. This may be due to missing or invalid API credentials.",
        "I encountered a network issue. The system administrator needs to check the WatsonX API configuration.",
        "I apologize for the inconvenience, but I can't process your request right now due to a service configuration issue."
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      debugLog("Using fallback streaming response", { response: randomFallback });
      
      // Update error message
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          role: "assistant",
          content: randomFallback,
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
      debugLog("Streaming request handling completed");
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
            "w-[340px] sm:w-[400px] p-0 rounded-2xl shadow-2xl border-0 overflow-hidden",
            "transition-all duration-300 ease-in-out",
            isDarkTheme 
              ? "bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md" 
              : "bg-gradient-to-b from-white/98 to-gray-50/98 backdrop-blur-md"
          )}
          side="top"
          align="end"
          sideOffset={20}
        >
          <div className="flex flex-col h-[500px] sm:h-[550px]">
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