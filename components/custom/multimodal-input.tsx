"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
  {
    title: "Help me book a flight",
    label: "from San Francisco to London",
    action: "Help me book a flight from San Francisco to London",
  },
  {
    title: "What is the status",
    label: "of flight BA142 flying tmrw?",
    action: "What is the status of flight BA142 flying tmrw?",
  },
];

/**
 * Multimodal input component for chat interface
 * Enhanced for mobile responsiveness
 */
export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    <div className="relative w-full flex flex-col gap-3 sm:gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full md:px-0 mx-auto md:max-w-[500px]">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 0 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="border-none bg-muted/50 w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2.5 sm:p-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-auto py-1 max-w-full">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.length > 0 &&
            uploadQueue.map((fileName, index) => (
              <div
                key={index}
                className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-md min-w-[150px] flex flex-row gap-2 items-center justify-center"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium truncate max-w-[100px]">
                    {fileName}
                  </span>
                  <span className="text-xs text-zinc-400">Uploading...</span>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="flex-1 flex flex-row gap-2 items-end">
        <Button
          type="button"
          className="rounded-full size-8 sm:size-10 p-0 flex items-center justify-center bg-transparent hover:bg-muted border border-input"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isLoading}
        >
          <PaperclipIcon size={16} />
        </Button>

        <div className="bg-background flex-1 flex flex-row items-center gap-0 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <Textarea
            role="textbox"
            value={input}
            onChange={handleInput}
            className="min-h-9 sm:min-h-10 rounded-l-md rounded-r-none border-0 resize-none placeholder:text-muted-foreground bg-background focus-visible:ring-0 px-3 sm:px-4 py-2 sm:py-2.5 flex-1 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base"
            placeholder="Message Sani..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            ref={textareaRef}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                !e.altKey
              ) {
                e.preventDefault();
                if (input.trim() !== "" || attachments.length > 0) {
                  submitForm();
                }
              }
            }}
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-l-none rounded-r-md h-full pr-2 sm:pr-3"
            type="button"
            onClick={
              isLoading
                ? () => {
                    stop();
                    textareaRef.current?.focus();
                  }
                : (e) => {
                    e.preventDefault();
                    if (input.trim() !== "" || attachments.length > 0) {
                      submitForm();
                    }
                  }
            }
          >
            {isLoading ? (
              <StopIcon size={16} />
            ) : (
              <ArrowUpIcon size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
