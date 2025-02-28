import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/custom/chat";

// 使用内置函数生成UUID，不需要外部依赖
function generateUUID() {
  // 检查是否支持crypto API
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // 如果不支持，使用备用方法
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: { userId: string; role: string };
}) {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/unauthorized");
  }

  // 验证用户ID参数与当前登录用户是否匹配
  if (session.user.id !== searchParams.userId) {
    return redirect("/unauthorized");
  }

  // 为新聊天生成一个UUID
  const newChatId = generateUUID();

  // 生成新聊天的初始系统消息，基于用户角色
  const initialSystemMessage = searchParams.role === "hr" 
    ? "我是Sani Assistant，您的HR助手。我可以帮助您解决人力资源相关问题。"
    : "我是Sani Assistant，您的员工健康顾问。我可以帮助您解决健康相关问题。";

  // 重定向到新创建的聊天页面，带上初始消息参数
  return redirect(`/chat/${newChatId}?systemMessage=${encodeURIComponent(initialSystemMessage)}`);
} 