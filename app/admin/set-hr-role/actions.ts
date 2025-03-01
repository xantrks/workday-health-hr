'use server';

export async function setHrRole(formData: FormData) {
  const email = formData.get('email') as string;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/set-hr-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Operation failed');
    }
    
    return { success: true, email };
  } catch (error: any) {
    throw new Error(error.message || 'Operation failed');
  }
} 