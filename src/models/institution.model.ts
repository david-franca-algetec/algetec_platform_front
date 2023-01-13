import { Demand } from './demands.model';

export type Institution = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demands: Demand[];
};

export type InstitutionCreate = Pick<Institution, 'name'>;

export type InstitutionUpdate = Pick<Institution, 'id' | 'name'>;
