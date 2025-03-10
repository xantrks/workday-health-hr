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
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();
    return { events: data, error: null };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { events: [], error: "Failed to fetch events, please try again later" };
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
      console.log("Failed to fetch user registrations, status:", response.status);
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching registration information:", error);
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
      throw new Error(errorData.error || "Failed to register for event");
    }

    // Success message
    toast.success("Successfully registered for event");
    
    // Trigger success callback
    if (onSuccess) {
      onSuccess(eventId);
    }
    
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    toast.error((error as Error).message || "Failed to register for event");
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
      throw new Error(errorData.error || "Failed to cancel registration");
    }

    // Success message
    toast.success("Successfully canceled registration");
    
    // Trigger success callback
    if (onSuccess) {
      onSuccess(eventId);
    }
    
    return true;
  } catch (error) {
    console.error("Error canceling registration:", error);
    toast.error((error as Error).message || "Failed to cancel registration");
    return false;
  }
}; 