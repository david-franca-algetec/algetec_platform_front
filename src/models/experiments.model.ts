import { ExperimentStatus } from './enum/experimentStatus.enum';

export type Experiment = {
  id: number;
  field_id: number;
  original_experiment_id?: number | null;
  name: string;
  description: string;
  image: string;
  web: boolean;
  pt: boolean;
  en: boolean;
  es: boolean;
  android: boolean;
  ios: boolean;
  status: ExperimentStatus;
  created_at: string;
  updated_at: string;
  test: string;
};
