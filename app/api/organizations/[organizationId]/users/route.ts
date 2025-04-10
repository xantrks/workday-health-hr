import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { auth } from "@/app/(auth)/auth";

import { 
  getUsersByOrganizationId, 
  createUser, 
  assignUserToOrganization,
  updateUserRole 
} from "@/db/queries"; 