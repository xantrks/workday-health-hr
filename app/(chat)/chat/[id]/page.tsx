import { CoreMessage } from "ai";
import { notFound } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById, saveChat } from "@/db/queries";
import { Chat } from "@/db/schema";
import { convertToUIMessages } from "@/lib/utils";

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: { id: string };
  searchParams: { systemMessage?: string };
}) {
  const { id } = params;
  const { systemMessage } = searchParams;
  
  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  let chat: Chat;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    // 如果是新的聊天，创建一个包含系统消息的初始聊天
    if (systemMessage) {
      const initialMessages = [
        {
          id: "1",
          role: "system",
          content: systemMessage,
        }
      ];
      
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
