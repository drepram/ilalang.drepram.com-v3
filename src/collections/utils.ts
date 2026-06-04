import { Access } from "payload";

type UserWithRoles = {
  id?: string;
  roles?: string[];
} | null;

const checkRole = (roles: string[], user: UserWithRoles): boolean => {
  if (!user?.roles) return false;
  return roles.some((role) => user.roles?.includes(role));
};

export const allowAnyone: Access = () => true;
export const allowEditors: Access = ({ req: { user } }) =>
  checkRole(["superadmin", "editor"], user as UserWithRoles);
export const allowSuperadmins: Access = ({ req: { user } }) =>
  checkRole(["superadmin"], user as UserWithRoles);
export const allowSuperadminsOrSelf: Access = ({ req: { user } }) => {
  const typedUser = user as UserWithRoles;
  if (!typedUser) return false;
  if (checkRole(["superadmin"], typedUser)) return true;
  return {
    id: {
      equals: typedUser.id,
    },
  };
};
