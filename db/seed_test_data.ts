import 'dotenv/config';
import path from 'path';

import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { hashSync } from 'bcryptjs';
import { 
  organization, 
  user, 
  employee, 
  userRole,
  role, 
  organizationAdmin,
  hrManager,
  superAdmin,
  hrEmployeeRelationship
} from './schema';

// Database connection
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set');
  process.exit(1);
}

// Set up PostgreSQL client
const sql = postgres(connectionString + '?sslmode=require', { max: 1 });
const db = drizzle(sql);

// 用于创建密码哈希的函数
function hashPassword(password: string): string {
  return hashSync(password, 10);
}

// 定义测试数据
const testOrganizations = [
  { 
    name: 'Sanicle Inc.', 
    subscriptionPlan: 'enterprise',
    logoUrl: 'https://example.com/logos/sanicle.png' 
  },
  { 
    name: 'ABC Corporation', 
    subscriptionPlan: 'business',
    logoUrl: 'https://example.com/logos/abc.png' 
  },
  { 
    name: 'XYZ Healthcare', 
    subscriptionPlan: 'professional',
    logoUrl: 'https://example.com/logos/xyz.png' 
  }
];

// 测试用户数据
const testUsers = [
  // Sanicle超级管理员
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@sanicle.com',
    password: 'SuperAdmin123!',
    role: 'superadmin',
    organizationName: 'Sanicle Inc.',
    department: 'IT',
    position: 'System Administrator',
    isSuperAdmin: true
  },
  // 组织管理员
  {
    firstName: 'Org',
    lastName: 'Admin1',
    email: 'orgadmin1@sanicle.com',
    password: 'OrgAdmin123!',
    role: 'orgadmin',
    organizationName: 'Sanicle Inc.',
    department: 'Management',
    position: 'CEO'
  },
  {
    firstName: 'Org',
    lastName: 'Admin2',
    email: 'orgadmin@abc.com',
    password: 'OrgAdmin123!',
    role: 'orgadmin',
    organizationName: 'ABC Corporation',
    department: 'Management',
    position: 'CEO'
  },
  {
    firstName: 'Org',
    lastName: 'Admin3',
    email: 'orgadmin@xyz.com',
    password: 'OrgAdmin123!',
    role: 'orgadmin',
    organizationName: 'XYZ Healthcare',
    department: 'Management',
    position: 'CEO'
  },
  // HR管理员
  {
    firstName: 'HR',
    lastName: 'Manager1',
    email: 'hr1@sanicle.com',
    password: 'HRManager123!',
    role: 'hr',
    organizationName: 'Sanicle Inc.',
    department: 'Human Resources',
    position: 'HR Director'
  },
  {
    firstName: 'HR',
    lastName: 'Manager2',
    email: 'hr@abc.com',
    password: 'HRManager123!',
    role: 'hr',
    organizationName: 'ABC Corporation',
    department: 'Human Resources',
    position: 'HR Director'
  },
  {
    firstName: 'HR',
    lastName: 'Manager3',
    email: 'hr@xyz.com',
    password: 'HRManager123!',
    role: 'hr',
    organizationName: 'XYZ Healthcare',
    department: 'Human Resources',
    position: 'HR Director'
  },
  // 团队经理
  {
    firstName: 'Team',
    lastName: 'Manager1',
    email: 'manager1@sanicle.com',
    password: 'Manager123!',
    role: 'manager',
    organizationName: 'Sanicle Inc.',
    department: 'IT',
    position: 'IT Manager'
  },
  {
    firstName: 'Team',
    lastName: 'Manager2',
    email: 'manager@abc.com',
    password: 'Manager123!',
    role: 'manager',
    organizationName: 'ABC Corporation',
    department: 'Sales',
    position: 'Sales Manager'
  },
  // 员工
  {
    firstName: 'Employee',
    lastName: 'One',
    email: 'employee1@sanicle.com',
    password: 'Employee123!',
    role: 'employee',
    organizationName: 'Sanicle Inc.',
    department: 'IT',
    position: 'Developer'
  },
  {
    firstName: 'Employee',
    lastName: 'Two',
    email: 'employee2@sanicle.com',
    password: 'Employee123!',
    role: 'employee',
    organizationName: 'Sanicle Inc.',
    department: 'Marketing',
    position: 'Marketing Specialist'
  },
  {
    firstName: 'Employee',
    lastName: 'Three',
    email: 'employee@abc.com',
    password: 'Employee123!',
    role: 'employee',
    organizationName: 'ABC Corporation',
    department: 'Sales',
    position: 'Sales Representative'
  },
  {
    firstName: 'Employee',
    lastName: 'Four',
    email: 'employee@xyz.com',
    password: 'Employee123!',
    role: 'employee',
    organizationName: 'XYZ Healthcare',
    department: 'Research',
    position: 'Researcher'
  }
];

async function seedData() {
  try {
    console.log('Starting test data seeding...');
    
    // 1. 创建组织
    const organizationMap = new Map();
    for (const org of testOrganizations) {
      // 检查组织是否已存在
      const existingOrg = await db.select()
        .from(organization)
        .where(eq(organization.name, org.name));
      
      if (existingOrg.length === 0) {
        const [newOrg] = await db.insert(organization)
          .values({
            name: org.name,
            subscriptionPlan: org.subscriptionPlan,
            logoUrl: org.logoUrl
          })
          .returning();
        
        organizationMap.set(org.name, newOrg.id);
        console.log(`Created organization: ${org.name}`);
      } else {
        organizationMap.set(org.name, existingOrg[0].id);
        console.log(`Organization already exists: ${org.name}`);
      }
    }
    
    // 2. 获取角色ID
    const roleMap = new Map();
    const rolesList = await db.select().from(role);
    
    for (const r of rolesList) {
      roleMap.set(r.name, r.id);
    }
    
    if (roleMap.size === 0) {
      throw new Error('No roles found in database. Run seed:roles script first.');
    }
    
    // 3. 创建用户和关联数据
    const userMap = new Map();
    
    for (const userData of testUsers) {
      // 检查用户是否已存在
      const existingUser = await db.select()
        .from(user)
        .where(eq(user.email, userData.email));
      
      let userId;
      
      if (existingUser.length === 0) {
        // 创建用户
        const [newUser] = await db.insert(user)
          .values({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashPassword(userData.password),
            role: userData.role,
            primaryRoleId: roleMap.get(userData.role),
            department: userData.department,
            position: userData.position,
            organizationId: organizationMap.get(userData.organizationName),
            isSuperAdmin: userData.isSuperAdmin || false,
            agreedToTerms: true
          })
          .returning();
        
        userId = newUser.id;
        userMap.set(userData.email, userId);
        
        console.log(`Created user: ${userData.email} with role ${userData.role}`);
        
        // 创建用户角色关联
        await db.insert(userRole)
          .values({
            userId: userId,
            roleId: roleMap.get(userData.role),
            organizationId: organizationMap.get(userData.organizationName),
            role: userData.role
          });
          
        // 根据角色创建相应的记录
        if (userData.role === 'superadmin') {
          await db.insert(superAdmin)
            .values({
              userId: userId,
              accessLevel: 1
            });
          console.log(`Created superadmin record for: ${userData.email}`);
        }
        
        if (userData.role === 'orgadmin') {
          await db.insert(organizationAdmin)
            .values({
              userId: userId,
              organizationId: organizationMap.get(userData.organizationName),
              isMainAdmin: true
            });
          console.log(`Created organization admin record for: ${userData.email}`);
        }
        
        if (userData.role === 'hr') {
          const [hrRecord] = await db.insert(hrManager)
            .values({
              hrUserId: userId,
              organizationId: organizationMap.get(userData.organizationName)
            })
            .returning();
          console.log(`Created HR manager record for: ${userData.email}`);
        }
        
        // 创建员工记录 (所有角色)
        await db.insert(employee)
          .values({
            userId: userId,
            jobTitle: userData.position,
            organizationId: organizationMap.get(userData.organizationName),
            isHR: userData.role === 'hr'
          });
      } else {
        userId = existingUser[0].id;
        userMap.set(userData.email, userId);
        console.log(`User already exists: ${userData.email}`);
      }
    }
    
    // 4. 建立HR与员工的关系
    // 获取各组织的HR
    const organizationHRs = new Map();
    
    for (const userData of testUsers) {
      if (userData.role === 'hr') {
        const orgId = organizationMap.get(userData.organizationName);
        if (!organizationHRs.has(orgId)) {
          const hrId = userMap.get(userData.email);
          const hrManagerData = await db.select()
            .from(hrManager)
            .where(eq(hrManager.hrUserId, hrId));
          
          if (hrManagerData.length > 0) {
            organizationHRs.set(orgId, hrManagerData[0].id);
          }
        }
      }
    }
    
    // 创建HR与员工关系
    for (const userData of testUsers) {
      if (userData.role === 'employee' || userData.role === 'manager') {
        const orgId = organizationMap.get(userData.organizationName);
        const hrManagerId = organizationHRs.get(orgId);
        const empId = userMap.get(userData.email);
        
        if (hrManagerId) {
          // 获取员工记录
          const employeeData = await db.select()
            .from(employee)
            .where(eq(employee.userId, empId));
          
          if (employeeData.length > 0) {
            const employeeId = employeeData[0].id;
            
            // 检查关系是否已存在
            const existingRelation = await db.select()
              .from(hrEmployeeRelationship)
              .where(eq(hrEmployeeRelationship.employeeId, employeeId));
              
            if (existingRelation.length === 0) {
              await db.insert(hrEmployeeRelationship)
                .values({
                  hrManagerId: hrManagerId,
                  employeeId: employeeId
                });
              console.log(`Created HR-Employee relationship for employee: ${userData.email}`);
            }
          }
        }
      }
    }
    
    console.log('\n=== Test Account Summary ===');
    console.log('- SuperAdmin: superadmin@sanicle.com / SuperAdmin123!');
    console.log('- Organization Admin (Sanicle): orgadmin1@sanicle.com / OrgAdmin123!');
    console.log('- Organization Admin (ABC): orgadmin@abc.com / OrgAdmin123!');
    console.log('- Organization Admin (XYZ): orgadmin@xyz.com / OrgAdmin123!');
    console.log('- HR Manager (Sanicle): hr1@sanicle.com / HRManager123!');
    console.log('- HR Manager (ABC): hr@abc.com / HRManager123!');
    console.log('- HR Manager (XYZ): hr@xyz.com / HRManager123!');
    console.log('- Team Manager (Sanicle): manager1@sanicle.com / Manager123!');
    console.log('- Employee (Sanicle): employee1@sanicle.com / Employee123!');
    console.log('- Employee (ABC): employee@abc.com / Employee123!');
    
    console.log('\nTest data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    await sql.end();
  }
}

// 运行种子函数
seedData().catch(console.error); 