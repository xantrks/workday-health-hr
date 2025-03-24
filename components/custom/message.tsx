"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { LeaveRequestForm } from "../leave/leave-request-form";
import { LeaveRequests } from "../leave/leave-requests";

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 w-full py-4 ${role === "assistant" ? "bg-background" : "bg-muted/30"} first-of-type:pt-8`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "getWeather" ? (
                      <Weather weatherAtLocation={result} />
                    ) : toolName === "getLeaveTypes" ? (
                      <LeaveRequestForm leaveTypes={result.leaveTypes} />
                    ) : toolName === "getLeaveReasonSuggestions" ? (
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">建议的请假理由：</p>
                        <ul className="list-disc pl-6">
                          {result.suggestions.map((suggestion: string, i: number) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    ) : toolName === "validateLeaveRequest" ? (
                      <div className={`p-4 rounded-md border ${result.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <p className={`font-medium mb-1 ${result.isValid ? 'text-green-700' : 'text-red-700'}`}>
                          {result.message}
                        </p>
                        {!result.isValid && result.suggestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">改进建议：</p>
                            <ul className="list-disc pl-6 text-sm text-red-700">
                              {result.suggestions.map((suggestion: string, i: number) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : toolName === "submitLeaveRequest" ? (
                      <div className={`p-4 rounded-md border ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <p className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                          {result.success ? result.message : result.error}
                        </p>
                      </div>
                    ) : toolName === "getUserLeaveRequests" ? (
                      <LeaveRequests leaveRequests={result.leaveRequests} />
                    ) : (
                      <div className="whitespace-pre-wrap bg-muted p-2 rounded text-xs">
                        {JSON.stringify(result, null, 2)}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "getWeather" ? (
                      <Weather />
                    ) : toolName === "getLeaveTypes" ? (
                      <div className="animate-pulse p-4 border rounded-md">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
