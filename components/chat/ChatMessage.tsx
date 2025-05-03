import { BotIcon, User } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define message type
export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

// Optimize markdown formatting to handle various markdown issues from IBM watsonx.ai
function formatMarkdown(text: string): string {
  if (!text) return "";

  let formattedText = text;

  // Handle ===== heading format (==== or ----- underline heading format) to ## heading
  formattedText = formattedText.replace(/\*\*(.*?)\*\*\s*\n=+/g, '## $1');
  formattedText = formattedText.replace(/\*\*(.*?)\*\*\s*\n-+/g, '### $1');

  // Handle list items missing spaces
  formattedText = formattedText.replace(/^(\d+)\.([^\s])/gm, '$1. $2');
  formattedText = formattedText.replace(/^-([^\s])/gm, '- $1');

  // Handle incorrect link format [text](url to [text](url)
  formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)(?!\))/g, '[$1]($2)');

  // Handle bold text spacing issues
  formattedText = formattedText.replace(/\*\* (.*?) \*\*/g, '**$1**');
  
  // Handle quoted code blocks, convert to standard code block format
  formattedText = formattedText.replace(/\"```([\s\S]*?)```\"/g, '```$1```');

  return formattedText;
}

export function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 sm:gap-4",
        isUser
          ? "animate-zoom-in justify-end"
          : "animate-slide-up"
      )}
    >
      {!isUser && (
        <Avatar className={cn(
          "h-8 w-8 sm:h-9 sm:w-9 shadow-lg",
          "ring-2 ring-primary/20",
          "bg-gradient-to-br from-primary to-primary-deep transition-all duration-300"
        )}>
          <AvatarFallback className="text-white">
            <BotIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[87%]",
          "transition-all duration-300 ease-in-out",
          isUser
            ? "bg-gradient-to-br from-primary to-primary-deep text-white shadow-lg"
            : isDarkTheme 
              ? "bg-neutral-800/80 border border-neutral-700/80 text-white backdrop-blur-sm shadow-md" 
              : "bg-white/90 border border-primary/10 text-slate-700 shadow-md backdrop-blur-sm"
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 
                className={cn(
                  "text-2xl font-bold my-4",
                  isUser ? "text-white" : isDarkTheme ? "text-white" : "text-primary-deep"
                )} 
                {...props} 
              />
            ),
            h2: ({ node, ...props }) => (
              <h2 
                className={cn(
                  "text-xl font-bold my-3",
                  isUser ? "text-white" : isDarkTheme ? "text-white" : "text-primary-deep"
                )} 
                {...props} 
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 
                className={cn(
                  "text-lg font-bold my-2",
                  isUser ? "text-white" : isDarkTheme ? "text-white" : "text-primary"
                )} 
                {...props} 
              />
            ),
            p: ({ node, ...props }) => (
              <p 
                className="my-2 leading-relaxed" 
                {...props} 
              />
            ),
            ul: ({ node, ...props }) => (
              <ul 
                className="list-disc pl-5 my-3 space-y-1" 
                {...props} 
              />
            ),
            ol: ({ node, ...props }) => (
              <ol 
                className="list-decimal pl-5 my-3 space-y-1" 
                {...props} 
              />
            ),
            li: ({ node, ...props }) => (
              <li 
                className="my-1 leading-relaxed" 
                {...props} 
              />
            ),
            a: ({ node, ...props }) => (
              <a 
                className={cn(
                  "underline hover:no-underline transition-colors duration-200",
                  isUser 
                    ? "text-white/90 hover:text-white" 
                    : isDarkTheme 
                      ? "text-blue-300 hover:text-blue-200" 
                      : "text-blue-600 hover:text-blue-500"
                )}
                target="_blank"
                rel="noopener noreferrer" 
                {...props} 
              />
            ),
            code: ({ node, inline, ...props }: any) => (
              inline ? (
                <code 
                  className={cn(
                    "px-1.5 py-0.5 rounded text-sm font-mono",
                    isUser 
                      ? "bg-black/20 text-white" 
                      : isDarkTheme 
                        ? "bg-neutral-700/80 text-neutral-200" 
                        : "bg-neutral-100/80 text-primary-deep"
                  )}
                  {...props} 
                />
              ) : (
                <code 
                  className={cn(
                    "block p-3 rounded-md text-sm font-mono overflow-x-auto my-3",
                    isUser 
                      ? "bg-black/20 text-white" 
                      : isDarkTheme 
                        ? "bg-neutral-900/80 text-neutral-200 border border-neutral-700/80" 
                        : "bg-neutral-100/80 text-primary-deep border border-neutral-200/80"
                  )}
                  {...props} 
                />
              )
            ),
            pre: ({ node, ...props }) => (
              <pre 
                className={cn(
                  "my-4 rounded-lg overflow-x-auto",
                  isUser 
                    ? "bg-black/20" 
                    : isDarkTheme 
                      ? "bg-neutral-900/90" 
                      : "bg-neutral-100/90"
                )}
                {...props} 
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote 
                className={cn(
                  "border-l-4 pl-4 my-4 italic",
                  isUser 
                    ? "border-white/30 text-white/90" 
                    : isDarkTheme 
                      ? "border-neutral-600 text-neutral-400" 
                      : "border-neutral-300 text-neutral-600"
                )}
                {...props} 
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4 rounded-lg shadow-sm">
                <table 
                  className={cn(
                    "min-w-full divide-y rounded-lg overflow-hidden",
                    isUser 
                      ? "divide-white/20" 
                      : isDarkTheme 
                        ? "divide-neutral-700" 
                        : "divide-neutral-200"
                  )}
                  {...props} 
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead 
                className={cn(
                  isUser 
                    ? "bg-black/10" 
                    : isDarkTheme 
                      ? "bg-neutral-800/90" 
                      : "bg-neutral-100/90"
                )}
                {...props} 
              />
            ),
            th: ({ node, ...props }) => (
              <th 
                className="px-4 py-2.5 text-left font-medium text-sm" 
                {...props} 
              />
            ),
            td: ({ node, ...props }) => (
              <td 
                className="px-4 py-2.5 text-sm border-t" 
                {...props} 
              />
            ),
            tr: ({ node, ...props }) => (
              <tr 
                className={cn(
                  isUser
                    ? "border-white/10" 
                    : isDarkTheme 
                      ? "border-neutral-700/90" 
                      : "border-neutral-200/90"
                )}
                {...props} 
              />
            ),
          }}
        >
          {formatMarkdown(message.content)}
        </ReactMarkdown>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg">
          <AvatarFallback className="text-white">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 