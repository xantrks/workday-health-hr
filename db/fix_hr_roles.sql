-- 更新HR用户的角色
UPDATE "User" 
SET role = 'hr' 
WHERE role = 'HR';

-- 显示更新后的所有用户角色
SELECT id, email, role 
FROM "User"; 