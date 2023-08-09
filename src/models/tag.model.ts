import { IDemand } from './demands.model';

export type Tag = {
  id: number;
  name: string;
  language: string;
  created_at: string;
  updated_at: string;
};

export interface DemandTags {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demands: Omit<IDemand, 'experiments' | 'institutions' | 'demandLogs' | 'demandTags'>[];
}
