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

// 根据用户角色获取适当的系统提示词
function getSystemPrompt(role: string) {
  if (role === "hr") {
    return `I am Sani Assistant, your HR support consultant. I'm here to help you with workforce management, anonymous health data analytics, and employee wellbeing strategies.

My capabilities include:
- Analyzing leave patterns and workforce scheduling
- Providing insights on workplace health trends
- Suggesting employee wellbeing policies and initiatives
- Helping with health-related HR queries

I maintain strict confidentiality and only work with anonymized data. I can respond in multiple languages, including English and Chinese, based on your input language.

How can I assist you with your HR management tasks today?`;
  } else {
    return `I am Sani Assistant, your personal health advisor. I'm here to help you manage your health and wellbeing in the workplace.

My capabilities include:
- Providing information about menstrual health and cycle management
- Offering guidance on common health concerns
- Suggesting self-care strategies for workplace wellbeing
- Helping you prepare for medical appointments

Everything you share with me is confidential. I can respond in multiple languages, including English and Chinese, based on your input language.

How can I support your health journey today?`;
  }
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

  // 获取基于用户角色的高级系统提示词
  const initialSystemMessage = getSystemPrompt(searchParams.role);

  // 创建助手的第一条欢迎消息
  const welcomeMessage = searchParams.role === "hr" 
    ? "Welcome to Sani Assistant for HR professionals. How can I help you with workforce management and employee wellbeing today?"
    : "Welcome to Sani Assistant. I'm here to support your health and wellbeing journey. How can I help you today?";

  // 重定向到新创建的聊天页面，带上初始消息参数
  return redirect(`/chat/${newChatId}?systemMessage=${encodeURIComponent(initialSystemMessage)}&welcomeMessage=${encodeURIComponent(welcomeMessage)}`);
} 