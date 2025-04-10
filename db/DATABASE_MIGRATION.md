# Database Migration Guide

This document provides instructions for updating the Neon PostgreSQL database using Drizzle ORM.

## Overview

The Sanicle SaaS platform uses a Neon PostgreSQL database with Drizzle ORM for schema definition and migrations. The database follows a multi-tenant architecture where:

- Multiple organizations can use the platform
- Each organization has its own administrators, HR personnel, and employees
- User roles follow a hierarchical permission structure

## Database Update Process

### Prerequisites

1. Make sure your `.env.local` file contains the `POSTGRES_URL` variable pointing to your Neon PostgreSQL database
2. Ensure all dependencies are installed with `npm install`

### Generating Migrations

When you've made changes to the database schema in `db/schema.ts`, generate migration files:

```bash
npm run db:generate
```

This command will:
- Create migration files based on the difference between your current schema and the database
- Output the files to the `lib/drizzle` directory

### Reviewing Migrations

Before applying migrations, review the generated SQL in the migration files to ensure they match your expectations.

### Applying Migrations

To apply the migrations to your database:

```bash
npm run db:update
```

This will execute all pending migrations in sequence.

### Direct Schema Push (Alternative)

For development environments, you can also push the schema directly without generating migration files:

```bash
npm run db:push
```

**Note:** This approach is less safe for production environments as it doesn't provide a clear migration path.

## Role Hierarchy Structure

The database schema supports the following role hierarchy:

1. **Sanicle Super Admin** - Can manage all organizations and their administrators
2. **Organization Admin** - Can manage their organization and create HR accounts
3. **HR Manager** - Can manage employees within their organization
4. **Employee** - Base-level user with limited permissions

This is implemented through the following tables:
- `Role` - Defines available roles and their hierarchy levels
- `SuperAdmin` - Tracks Sanicle's top-level administrators
- `OrganizationAdmin` - Maps admins to their organizations
- `HRManager` - Tracks HR managers in each organization
- `Employee` - Stores employee-specific information
- `UserRole` - Flexible role assignments for users

## Data Relationships

All data in the system is connected to:
1. A specific user
2. A specific organization

This ensures proper data isolation between tenants while allowing super admins to access data across organizations.

## Troubleshooting

If you encounter issues:

1. Check the Neon database connection string
2. Verify that your schema changes are valid
3. Look for error messages in the console output
4. For Neon-specific issues, check the Neon dashboard

For more complex issues, you may need to:
- Review the PostgreSQL logs
- Check the Drizzle-generated SQL
- Consider manual SQL fixes for specific problems 