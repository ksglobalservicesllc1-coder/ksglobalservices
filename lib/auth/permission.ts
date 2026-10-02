import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  user: ["create", "read", "update", "delete", "ban"],
  admin: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const userRole = ac.newRole({
  user: ["read", "update"],
});

export const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"],
});

export const superAdminRole = ac.newRole({
  user: ["create", "read", "update", "delete", "ban"],
  admin: ["create", "read", "update", "delete"],
});
