# Test Accounts for Multi-Tenant System

Here are the test accounts created for testing different roles in the multi-tenant system. All accounts have been created in the database and are ready to use.

## Superadmin Accounts

| Organization | Name        | Email                  | Password    |
|--------------|-------------|------------------------|-------------|
| Sanicle      | Super Admin | superadmin@sanicle.com | Admin@123   |

## Admin Accounts

| Organization     | Name          | Email               | Password    |
|------------------|---------------|---------------------|-------------|
| Example Company  | Company Admin | admin@example.com   | Admin@123   |

## HR Accounts

| Organization     | Name      | Email                | Password    |
|------------------|-----------|----------------------|-------------|
| Example Company  | Test HR   | hr_test@example.com  | Password123 |
| Sanicle          | Sanicle HR| hr_test@sanicle.com  | Password123 |

## Employee Accounts

| Organization     | Name             | Email                    | Password    | Job Title            |
|------------------|------------------|--------------------------|-------------|-----------------------|
| Example Company  | Test Employee    | employee_test@example.com| Password123 | Software Developer    |
| Sanicle          | Sanicle Employee | employee_test@sanicle.com| Password123 | Marketing Specialist  |

## Organization Information

| Name             | Subscription Plan | Description                          |
|------------------|-------------------|--------------------------------------|
| Sanicle          | enterprise        | The main organization/system owner   |
| Example Company  | standard          | An example client organization       |

## Role Hierarchy

The role hierarchy in the system is as follows:

1. **Superadmin**: Has access to all organizations and can manage all users
2. **Admin**: Can manage their organization and create HR accounts
3. **HR**: Can manage employees within their organization
4. **Employee**: Has basic access to their own data

## Testing Scenarios

Here are some scenarios you can test with these accounts:

1. **Login as Superadmin**: Access all organizations and manage them
2. **Login as Admin**: Manage users (HR, Employee) within your organization only
3. **Login as HR**: Manage employees within your organization only
4. **Login as Employee**: Access your own profile and data

## Notes

- These are development test accounts and should not be used in production
- The passwords are stored as bcrypt hashes in the database
- All accounts have agreed to the terms and conditions 