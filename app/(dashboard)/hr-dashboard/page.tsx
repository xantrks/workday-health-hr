import { auth } from "@/app/(auth)/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HRDashboard() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">HR健康管理仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">员工健康统计</h2>
          {/* 后续添加内容 */}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">请假分析</h2>
          {/* 后续添加内容 */}
        </div>

        <div className="p-4 border rounded-lg">
          <Link href="/" className="block p-4 border rounded-lg hover:bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">AI分析助手</h2>
            <p className="text-gray-600">点击开始对话</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 