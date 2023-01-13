export type Department = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type DepartmentCreate = Pick<Department, 'name'>;

export type DepartmentUpdate = Pick<Department, 'id' | 'name'>;
