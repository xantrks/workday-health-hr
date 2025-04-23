import { motion } from "framer-motion";
import Link from "next/link";

import { LogoGoogle, MessageIcon, VercelIcon } from "./icons";

/**
 * Overview component shown in empty chat
 * Enhanced for mobile responsiveness
 */
export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="w-full mt-4 sm:mt-8"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border-none bg-muted/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 text-zinc-500 text-xs sm:text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p className="flex flex-row justify-center gap-3 sm:gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <VercelIcon size={14} />
          <span>+</span>
          <MessageIcon size={14} />
        </p>
        <p>
          This is an open source Chatbot template powered by the Google Gemini
          model built with Next.js and the AI SDK by Vercel. It uses the{" "}
          <code className="rounded-sm bg-muted-foreground/15 px-1 sm:px-1.5 py-0.5">
            streamText
          </code>{" "}
          function in the server and the{" "}
          <code className="rounded-sm bg-muted-foreground/15 px-1 sm:px-1.5 py-0.5">
            useChat
          </code>{" "}
          hook on the client to create a seamless chat experience.
        </p>
        <p>
          {" "}
          You can learn more about the AI SDK by visiting the{" "}
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            Docs
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
