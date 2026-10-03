import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements, 
  admin: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const userRole = ac.newRole({
  user: [],
});

export const adminRole = ac.newRole({
  user: ["create", "list", "get", "update", "delete"],
});

export const superAdminRole = ac.newRole({
  ...adminAc.statements,
  admin: ["create", "read", "update", "delete"],
});