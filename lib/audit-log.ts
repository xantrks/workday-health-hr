import { db } from "@/lib/db";

type AuditLogParams = {
  action: string;
  entityId: string;
  entityType: string;
  userId?: string;
  organizationId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
};

/**
 * Creates an audit log entry in the database
 * @param params Audit log parameters
 * @returns The created audit log entry
 */
export async function createAuditLog(params: AuditLogParams) {
  try {
    const auditLog = db.auditLogs.create(params);
    return auditLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
} 