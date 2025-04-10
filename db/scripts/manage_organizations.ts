import { genSaltSync, hashSync } from "bcryptjs";

import { createOrganization, createUser, assignUserToOrganization, updateUserRole } from '../queries';

/**
 * Creates a new organization with admin user
 * @param orgName - Name of the organization
 * @param subscriptionPlan - Subscription plan (basic, standard, enterprise)
 * @param adminEmail - Email for the admin user
 * @param adminPassword - Password for the admin user
 * @param adminFirstName - First name of the admin
 * @param adminLastName - Last name of the admin
 * @returns The created organization and admin user
 */
export async function createOrganizationWithAdmin(
  orgName: string,
  subscriptionPlan: string,
  adminEmail: string,
  adminPassword: string,
  adminFirstName: string,
  adminLastName: string
) {
  try {
    // Create the organization
    const organization = await createOrganization({
      name: orgName,
      subscriptionPlan
    });

    if (!organization) {
      throw new Error('Failed to create organization');
    }

    console.log(`Created organization: ${organization.name} (ID: ${organization.id})`);

    // Hash the admin password
    const hashedPassword = hashSync(adminPassword, 10);

    // Create the admin user
    const admin = await createUser({
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      password: hashedPassword,
      agreedToTerms: true,
      role: 'admin',
      organizationId: organization.id
    });

    if (!admin) {
      throw new Error('Failed to create admin user');
    }

    console.log(`Created admin user: ${admin.first_name} ${admin.last_name} (ID: ${admin.id})`);

    return { organization, admin };
  } catch (error) {
    console.error('Error creating organization with admin:', error);
    throw error;
  }
}

/**
 * Creates a superadmin user
 * @param email - Email for the superadmin
 * @param password - Password for the superadmin
 * @param firstName - First name of the superadmin
 * @param lastName - Last name of the superadmin
 * @returns The created superadmin user
 */
export async function createSuperAdmin(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    // Hash the superadmin password
    const hashedPassword = hashSync(password, 10);

    // Create the superadmin user
    const superAdmin = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      agreedToTerms: true,
      role: 'superadmin',
      isSuperAdmin: true
    });

    if (!superAdmin) {
      throw new Error('Failed to create superadmin user');
    }

    console.log(`Created superadmin user: ${superAdmin.first_name} ${superAdmin.last_name} (ID: ${superAdmin.id})`);

    return superAdmin;
  } catch (error) {
    console.error('Error creating superadmin:', error);
    throw error;
  }
}

/**
 * Creates an HR user within an organization
 * @param organizationId - ID of the organization
 * @param email - Email for the HR user
 * @param password - Password for the HR user
 * @param firstName - First name of the HR
 * @param lastName - Last name of the HR
 * @returns The created HR user
 */
export async function createHrUser(
  organizationId: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    // Hash the HR password
    const hashedPassword = hashSync(password, 10);

    // Create the HR user
    const hr = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      agreedToTerms: true,
      role: 'hr',
      organizationId
    });

    if (!hr) {
      throw new Error('Failed to create HR user');
    }

    console.log(`Created HR user: ${hr.first_name} ${hr.last_name} (ID: ${hr.id})`);

    return hr;
  } catch (error) {
    console.error('Error creating HR user:', error);
    throw error;
  }
}

/**
 * Creates an employee user within an organization
 * @param organizationId - ID of the organization
 * @param email - Email for the employee
 * @param password - Password for the employee
 * @param firstName - First name of the employee
 * @param lastName - Last name of the employee
 * @returns The created employee user
 */
export async function createEmployeeUser(
  organizationId: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    // Hash the employee password
    const hashedPassword = hashSync(password, 10);

    // Create the employee user
    const employee = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      agreedToTerms: true,
      role: 'employee',
      organizationId
    });

    if (!employee) {
      throw new Error('Failed to create employee user');
    }

    console.log(`Created employee user: ${employee.first_name} ${employee.last_name} (ID: ${employee.id})`);

    return employee;
  } catch (error) {
    console.error('Error creating employee user:', error);
    throw error;
  }
}

// Execute as a script if run directly
if (require.main === module) {
  const command = process.argv[2];
  
  async function run() {
    switch (command) {
      case 'create-org':
        // Example: node manage_organizations.js create-org "Acme Corp" "enterprise" "admin@acme.com" "password" "John" "Doe"
        const orgName = process.argv[3];
        const subscriptionPlan = process.argv[4];
        const adminEmail = process.argv[5];
        const adminPassword = process.argv[6];
        const adminFirstName = process.argv[7];
        const adminLastName = process.argv[8];
        
        await createOrganizationWithAdmin(
          orgName,
          subscriptionPlan,
          adminEmail,
          adminPassword,
          adminFirstName,
          adminLastName
        );
        break;
        
      case 'create-superadmin':
        // Example: node manage_organizations.js create-superadmin "super@sanicle.com" "password" "Super" "Admin"
        const superEmail = process.argv[3];
        const superPassword = process.argv[4];
        const superFirstName = process.argv[5];
        const superLastName = process.argv[6];
        
        await createSuperAdmin(
          superEmail,
          superPassword,
          superFirstName,
          superLastName
        );
        break;
        
      case 'create-hr':
        // Example: node manage_organizations.js create-hr "org-uuid" "hr@acme.com" "password" "HR" "Manager"
        const hrOrgId = process.argv[3];
        const hrEmail = process.argv[4];
        const hrPassword = process.argv[5];
        const hrFirstName = process.argv[6];
        const hrLastName = process.argv[7];
        
        await createHrUser(
          hrOrgId,
          hrEmail,
          hrPassword,
          hrFirstName,
          hrLastName
        );
        break;
        
      case 'create-employee':
        // Example: node manage_organizations.js create-employee "org-uuid" "emp@acme.com" "password" "Employee" "Name"
        const empOrgId = process.argv[3];
        const empEmail = process.argv[4];
        const empPassword = process.argv[5];
        const empFirstName = process.argv[6];
        const empLastName = process.argv[7];
        
        await createEmployeeUser(
          empOrgId,
          empEmail,
          empPassword,
          empFirstName,
          empLastName
        );
        break;
        
      default:
        console.log(`
Usage:
  node manage_organizations.js create-org <name> <plan> <email> <password> <firstName> <lastName>
  node manage_organizations.js create-superadmin <email> <password> <firstName> <lastName>
  node manage_organizations.js create-hr <orgId> <email> <password> <firstName> <lastName>
  node manage_organizations.js create-employee <orgId> <email> <password> <firstName> <lastName>
        `);
    }
  }
  
  run()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
} 