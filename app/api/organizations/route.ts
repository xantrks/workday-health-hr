import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

import { 
  createOrganization, 
  getAllOrganizations, 
  getOrganizationById, 
  updateOrganization 
} from "@/db/queries";

/**
 * GET /api/organizations
 * 
 * Retrieves all organizations if user is superadmin
 * or the user's own organization otherwise
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check authentication
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Superadmins can see all organizations
    if (session.user.isSuperAdmin) {
      const organizations = await getAllOrganizations();
      return NextResponse.json(organizations);
    } 
    // Regular users can only see their own organization
    else if (session.user.organizationId) {
      const organization = await getOrganizationById(session.user.organizationId);
      return NextResponse.json([organization]);
    } 
    // Users without organization cannot see any
    else {
      return NextResponse.json([]);
    }
    
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch organizations" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

/**
 * POST /api/organizations
 * 
 * Creates a new organization
 * Only accessible to superadmin users
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check authentication and authorization
    if (!session || !session.user || !session.user.isSuperAdmin) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.subscriptionPlan) {
      return new NextResponse(JSON.stringify({ error: "Name and subscription plan are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Create the organization
    const newOrganization = await createOrganization({
      name: data.name,
      subscriptionPlan: data.subscriptionPlan,
      logoUrl: data.logoUrl
    });
    
    return NextResponse.json(newOrganization, { status: 201 });
    
  } catch (error) {
    console.error("Error creating organization:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create organization" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
} 