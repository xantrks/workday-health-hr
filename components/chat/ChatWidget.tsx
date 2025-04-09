"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, Message } from "./ChatMessage";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm Sanicle's WatsonX AI assistant. How can I help you today?",
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
    
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
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
      
      if (!response.ok) {
        // Handle HTTP errors gracefully
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data); // Log complete response
      
      // Adjust parsing logic based on watsonx.ai response structure
      let assistantMessage = "Sorry, I couldn't process your request. Please try again.";
      
      // Add logging based on error messages
      if (data.error) {
        console.error("Error from API:", data.error, data.details);
        
        // Handle specific deployment not found error with a helpful message
        if (data.details && data.details.includes("deployment_not_found")) {
          assistantMessage = "I'm sorry, but the WatsonX AI service is currently unavailable. The deployment configuration needs to be updated.";
        } else {
          assistantMessage = `I encountered an issue: ${data.error}. Please try again later.`;
        }
      } else {
        // Check different possible response structures - prioritize the sample project's expected format
        if (data.results && Array.isArray(data.results) && data.results[0]?.generated_text) {
          assistantMessage = data.results[0].generated_text;
        } else if (data.generated_text) {
          assistantMessage = data.generated_text;
        } else if (data.result && data.result.generated_text) {
          assistantMessage = data.result.generated_text;
        } else if (data.choices && data.choices[0]?.message?.content) {
          assistantMessage = data.choices[0].message.content;
        }

        // Log the parsed message
        console.log("Parsed assistant message:", assistantMessage);
      }
      
      // Make sure we have a valid message to display
      if (!assistantMessage || assistantMessage.trim() === "") {
        assistantMessage = "I received your message but couldn't generate a proper response. Please try again.";
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      
      // Provide a fallback response when API is unavailable
      const fallbackResponses = [
        "I'm sorry, but I'm having trouble connecting to my backend services. Please try again later.",
        "The WatsonX AI service is currently unavailable. This may be due to missing or invalid API credentials.",
        "I encountered a network issue. The system administrator needs to check the WatsonX API configuration.",
        "I apologize for the inconvenience, but I can't process your request right now due to a service configuration issue."
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: randomFallback,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Streaming API implementation
  async function handleSubmitStreaming(e: React.FormEvent) {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
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
      
      if (!response.ok) {
        // Handle HTTP errors gracefully
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.status}`);
      }
      
      // Handle SSE response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is null");
      
      let partialResponse = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode chunk
        const chunk = new TextDecoder().decode(value);
        console.log("Streaming chunk:", chunk); // Log streaming response
        
        // Parse SSE data
        const lines = chunk.split('\n');
        let parsedChunk = "";
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const jsonData = JSON.parse(line.substring(5));
              if (jsonData.generated_text) {
                parsedChunk += jsonData.generated_text;
              } else if (jsonData.results && Array.isArray(jsonData.results) && jsonData.results[0]?.generated_text) {
                parsedChunk += jsonData.results[0].generated_text;
              } else if (jsonData.choices && jsonData.choices[0]?.delta?.content) {
                parsedChunk += jsonData.choices[0].delta.content;
              } else if (jsonData.error) {
                console.error("Error in stream:", jsonData.error);
                throw new Error(jsonData.error);
              }
            } catch (e) {
              console.error("Failed to parse JSON from SSE", e);
            }
          }
        }
        
        // Update partialResponse
        partialResponse += parsedChunk;
        
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
      console.error("Error:", error);
      
      // Provide a fallback response when API is unavailable
      const fallbackResponses = [
        "I'm sorry, but I'm having trouble connecting to my backend services. Please try again later.",
        "The WatsonX AI service is currently unavailable. This may be due to missing or invalid API credentials.",
        "I encountered a network issue. The system administrator needs to check the WatsonX API configuration.",
        "I apologize for the inconvenience, but I can't process your request right now due to a service configuration issue."
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
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
    }
  }

  // Use streaming API for better interactive experience
  const handleSubmit = handleSubmitStreaming;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className={cn(
              "h-14 w-14 rounded-full shadow-button hover:shadow-button-hover transition-all duration-300",
              "bg-primary hover:bg-primary-deep text-white",
              "flex items-center justify-center relative",
              !isOpen && "animate-bounce-subtle"
            )}
          >
            {isOpen ? (
              <X className="h-6 w-6 transition-transform duration-300" />
            ) : (
              <div className="relative">
                <MessageSquare className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          align="end" 
          className={cn(
            "w-[350px] sm:w-[450px] h-[500px] p-0 overflow-hidden flex flex-col",
            "border border-primary/20 shadow-card-hover rounded-xl",
            "animate-slide-up",
            isDarkTheme ? "bg-neutral-900" : "bg-white"
          )}
        >
          <div className={cn(
            "p-4 text-white font-semibold rounded-t-xl flex justify-between items-center",
            isDarkTheme 
              ? "bg-primary-deep" 
              : "bg-gradient-to-r from-primary to-primary-deep"
          )}>
            <div className="flex items-center gap-2">
              <BotIcon className="h-5 w-5" />
              <span>Sanicle WatsonX AI Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          
          <form 
            onSubmit={handleSubmit} 
            className="p-4 border-t border-primary/10 bg-background/80 flex gap-2"
          >
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={cn(
                "flex-1",
                isDarkTheme ? "bg-neutral-800 border-neutral-700" : "bg-white border-primary/20"
              )}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || input.trim() === ""}
              className={cn(
                "shrink-0 rounded-full",
                "bg-primary hover:bg-primary-deep text-white"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted px-4 py-2 rounded-lg flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-primary-deep/70 animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary-deep/70 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary-deep/70 animate-bounce" style={{ animationDelay: "600ms" }}></div>
      </div>
    </div>
  );
} 