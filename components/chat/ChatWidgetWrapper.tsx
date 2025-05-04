"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import { ChatWidget as ChatWidgetType } from "./ChatWidget";

// Dynamically import ChatWidget component, don't use SSR
const DynamicChatWidget = dynamic<{ viewportHeight: number }>(
  () => import("./ChatWidget").then(mod => mod.ChatWidget),
  {
    ssr: false,
    loading: () => null
  }
);

export function ChatWidgetWrapper() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
    
    // Check if the device is mobile and get viewport height
    const checkViewport = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };
    
    // Initial check
    checkViewport();
    
    // Add resize listener to detect orientation changes and viewport height changes
    const handleResize = () => {
      checkViewport();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Don't render anything if not mounted or if on mobile
  if (!mounted || isMobile) return null;

  return (
    <Suspense fallback={null}>
      <DynamicChatWidget viewportHeight={viewportHeight} />
    </Suspense>
  );
} 