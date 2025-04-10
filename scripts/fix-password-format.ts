import { hashSync } from "bcryptjs";

import { sql } from "../lib/db";

async function fixUserPasswords() {
  console.log("Starting password format fix script...");
  
  try {
    // Get all users from the database
    const users = await sql`
      SELECT id, email, password 
      FROM "User"
    `;
    
    console.log(`Found ${users.length} users to check...`);
    let updatedCount = 0;
    
    for (const user of users) {
      // Check if the password is already hashed properly (bcrypt hashes start with $2a$ or $2b$)
      if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`Fixing password format for user: ${user.email}`);
        
        // Hash the password correctly
        const hashedPassword = hashSync(user.password, 10);
        
        // Update the user record with the properly hashed password
        await sql`
          UPDATE "User"
          SET password = ${hashedPassword}
          WHERE id = ${user.id}
        `;
        
        updatedCount++;
      }
    }
    
    console.log(`Password fix complete. Updated ${updatedCount} user records.`);
    
  } catch (error) {
    console.error("Error fixing passwords:", error);
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  fixUserPasswords()
    .then(() => {
      console.log("Password fix script completed.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Password fix script failed:", error);
      process.exit(1);
    });
} 