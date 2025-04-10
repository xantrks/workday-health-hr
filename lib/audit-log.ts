import { sql } from "@/lib/db";

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
    const {
      action,
      entityId,
      entityType,
      userId,
      organizationId,
      details,
      ipAddress,
      userAgent,
    } = params;

    const detailsJson = details ? JSON.stringify(details) : null;
    const timestamp = new Date();

    const auditLog = await sql`
      INSERT INTO "AuditLog" (
        action,
        entity_id,
        entity_type,
        user_id,
        organization_id,
        details,
        ip_address,
        user_agent,
        timestamp
      )
      VALUES (
        ${action},
        ${entityId},
        ${entityType},
        ${userId || null},
        ${organizationId || null},
        ${detailsJson},
        ${ipAddress || null},
        ${userAgent || null},
        ${timestamp}
      )
      RETURNING *
    `;

    return auditLog[0] || null;
  } catch (error) {
    console.error("Error creating audit log:", error);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
} 