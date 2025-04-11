import { CoreMessage } from "ai";
import { notFound } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById, saveChat } from "@/db/queries";
import { Chat } from "@/db/schema";
import { convertToUIMessages } from "@/lib/utils";

// Define message role types to ensure system compatibility
type MessageRole = "system" | "user" | "assistant" | "function" | "data" | "tool";

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: { id: string };
  searchParams: { systemMessage?: string; welcomeMessage?: string };
}) {
  const { id } = params;
  const { systemMessage, welcomeMessage } = searchParams;
  
  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  let chat: Chat;
  let chatFromDb;
  
  try {
    chatFromDb = await getChatById({ id });
  } catch (error) {
    console.error("Error fetching chat:", error);
    // Continue with creating a new chat if retrieval fails
  }

  if (!chatFromDb) {
    // If it's a new chat, create an initial chat with system message and welcome message
    if (systemMessage) {
      // Build initial messages array
      const initialMessages = [
        {
          id: "1",
          role: "system" as MessageRole,
          content: systemMessage,
        }
      ];
      
      // If welcome message is provided, add an assistant message
      if (welcomeMessage) {
        initialMessages.push({
          id: "2",
          role: "assistant" as MessageRole,
          content: welcomeMessage,
        });
      }
      
      // Get organization ID from session if available
      const organizationId = session.user.organizationId || null;
      
      try {
        // Save new chat to database
        await saveChat({
          id,
          messages: initialMessages,
          userId: session.user.id,
          organizationId
        });
      } catch (error) {
        console.error("Error saving new chat:", error);
      }
      
      chat = {
        id,
        createdAt: new Date(),
        messages: initialMessages,
        userId: session.user.id,
        organizationId
      };
    } else {
      return notFound();
    }
  } else {
    // Use existing chat, ensuring organizationId is handled correctly
    chat = {
      id: chatFromDb.id,
      createdAt: chatFromDb.createdAt,
      userId: chatFromDb.userId,
      organizationId: chatFromDb.organization_id || chatFromDb.organizationId || null, // Handle both field names
      messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
    };

    // Verify user permissions
    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  return <PreviewChat id={chat.id} initialMessages={chat.messages} />;
}
