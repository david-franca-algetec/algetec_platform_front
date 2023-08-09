import { IDemand } from './demands.model';

export type Institution = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demands: IDemand[];
};

export type InstitutionCreate = Pick<Institution, 'name'>;

export type InstitutionUpdate = Pick<Institution, 'id' | 'name'>;
