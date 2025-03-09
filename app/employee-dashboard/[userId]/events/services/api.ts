import { toast } from "sonner";

import { Event, Registration } from "../types";

// 获取所有事件
export const fetchEvents = async (): Promise<{
  events: Event[];
  error: string | null;
}> => {
  try {
    const response = await fetch("/api/events");
    if (!response.ok) {
      throw new Error("获取事件失败");
    }
    const data = await response.json();
    return { events: data, error: null };
  } catch (error) {
    console.error("获取事件出错:", error);
    return { events: [], error: "获取事件失败，请稍后再试" };
  }
};

// 获取用户注册信息
export const fetchUserRegistrations = async (
  userId: string
): Promise<Registration[]> => {
  try {
    if (!userId) return [];

    const response = await fetch(`/api/users/${userId}/registrations`);
    if (!response.ok) {
      console.log("获取用户注册信息失败，状态:", response.status);
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("获取注册信息出错:", error);
    return [];
  }
};

// 注册事件
export const registerForEvent = async (
  eventId: string,
  userId: string,
  onSuccess?: (eventId: string) => void
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "注册事件失败");
    }

    // 成功消息
    toast.success("成功注册事件");
    
    // 触发成功回调
    if (onSuccess) {
      onSuccess(eventId);
    }
    
    return true;
  } catch (error) {
    console.error("注册错误:", error);
    toast.error((error as Error).message || "注册事件失败");
    return false;
  }
};

// 取消注册
export const cancelRegistration = async (
  eventId: string,
  onSuccess?: (eventId: string) => void
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "取消注册失败");
    }

    // 成功消息
    toast.success("成功取消注册");
    
    // 触发成功回调
    if (onSuccess) {
      onSuccess(eventId);
    }
    
    return true;
  } catch (error) {
    console.error("取消注册错误:", error);
    toast.error((error as Error).message || "取消注册失败");
    return false;
  }
}; 