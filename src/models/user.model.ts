import { Department } from './department.model';
import { Role } from './role.model';
import { Token } from './token.model';

export type User = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  remember_me_token: null;
  created_at: string;
  updated_at: string;
  role: Role;
  department: Department;
};

export interface UserResponse {
  user: Omit<User, 'department'>[];
  token: Token;
}

export type UserCreate = Pick<User, 'name' | 'email' | 'department_id' | 'role_id'> & {
  password: string;
};

export type UserUpdate = Partial<UserCreate> & {
  id: number;
};
