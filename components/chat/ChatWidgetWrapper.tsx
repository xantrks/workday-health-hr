"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import ChatWidget component, don't use SSR
const DynamicChatWidget = dynamic(
  () => import("./ChatWidget").then(mod => mod.ChatWidget),
  {
    ssr: false,
    loading: () => null
  }
);

export function ChatWidgetWrapper() {
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <DynamicChatWidget />
    </Suspense>
  );
} 