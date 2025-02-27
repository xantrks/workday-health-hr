'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployeeDashboard({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && session.user.id !== params.userId) {
      router.replace('/unauthorized');
    }
  }, [status, session, params.userId, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <p className="text-gray-600">Welcome, {session.user.name}</p>
      <p className="text-gray-600">User ID: {params.userId}</p>
      {/* 添加更多仪表盘内容 */}
    </div>
  );
} 