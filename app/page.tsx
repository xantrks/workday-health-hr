import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';

export default async function RootPage() {
  const session = await auth();
  
  // If user is authenticated, redirect to their dashboard
  if (session?.user) {
    const userId = session.user.id;
    const role = session.user.role;
    const isSuperAdmin = session.user.isSuperAdmin;
    
    if (isSuperAdmin) {
      redirect(`/super-admin/${userId}`);
    } else if (role === 'orgadmin') {
      redirect(`/admin-dashboard/${userId}`);
    } else if (role === 'manager') {
      redirect(`/manager-dashboard/${userId}`);
    } else if (role === 'hr') {
      redirect(`/hr-dashboard/${userId}`);
    } else {
      // Default to employee dashboard
      redirect(`/employee-dashboard/${userId}`);
    }
  }
  
  // If not authenticated, redirect to login
  redirect('/login');
} 