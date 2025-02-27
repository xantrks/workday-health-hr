export default function EmployeeDashboard({ params }: { params: { userId: string } }) {
  return (
    <div>
      <h1>Employee Dashboard</h1>
      <p>User ID: {params.userId}</p>
      {/* 添加仪表盘内容 */}
    </div>
  );
} 