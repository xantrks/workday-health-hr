import { CoreMessage } from "ai";
import { notFound } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById, saveChat } from "@/db/queries";
import { Chat } from "@/db/schema";
import { convertToUIMessages } from "@/lib/utils";

// 定义消息角色类型，确保符合系统要求
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
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    // 如果是新的聊天，创建一个包含系统消息和欢迎消息的初始聊天
    if (systemMessage) {
      // 构建初始消息数组
      const initialMessages = [
        {
          id: "1",
          role: "system" as MessageRole,
          content: systemMessage,
        }
      ];
      
      // 如果提供了欢迎消息，添加一条助手消息
      if (welcomeMessage) {
        initialMessages.push({
          id: "2",
          role: "assistant" as MessageRole,
          content: welcomeMessage,
        });
      }
      
      // 保存新聊天到数据库
      await saveChat({
        id,
        messages: initialMessages,
        userId: session.user.id,
      });
      
      chat = {
        id,
        createdAt: new Date(),
        messages: initialMessages,
        userId: session.user.id,
      };
    } else {
      return notFound();
    }
  } else {
    // 使用现有聊天
    chat = {
      ...chatFromDb,
      messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
    };

    // 验证用户权限
    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  return <PreviewChat id={chat.id} initialMessages={chat.messages} />;
}
