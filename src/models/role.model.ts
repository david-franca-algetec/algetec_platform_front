export type Role = {
  admin: boolean;
  assets: boolean;
  checklists: boolean;
  created_at: string;
  demands: boolean;
  demands_admin: boolean;
  demands_leader: boolean;
  id: number;
  issues: true;
  name: string;
  releases: boolean;
  super_admin: boolean;
  updated_at: string;
};

export type RoleCreate = Pick<Role, 'name'>;

export type RoleUpdate = Pick<Role, 'id' | 'name'>;
