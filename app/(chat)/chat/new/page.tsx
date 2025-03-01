import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/custom/chat";

// Use built-in function to generate UUID, no external dependency needed
function generateUUID() {
  // Check if crypto API is supported
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // If not supported, use fallback method
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get appropriate system prompt based on user role
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

  // Verify user ID parameter matches current logged-in user
  if (session.user.id !== searchParams.userId) {
    return redirect("/unauthorized");
  }

  // Generate a UUID for the new chat
  const newChatId = generateUUID();

  // Get advanced system prompt based on user role
  const initialSystemMessage = getSystemPrompt(searchParams.role);

  // Create assistant's first welcome message
  const welcomeMessage = searchParams.role === "hr" 
    ? "Welcome to Sani Assistant for HR professionals. How can I help you with workforce management and employee wellbeing today?"
    : "Welcome to Sani Assistant. I'm here to support your health and wellbeing journey. How can I help you today?";

  // Redirect to new created chat page with initial message parameters
  return redirect(`/chat/${newChatId}?systemMessage=${encodeURIComponent(initialSystemMessage)}&welcomeMessage=${encodeURIComponent(welcomeMessage)}`);
} 