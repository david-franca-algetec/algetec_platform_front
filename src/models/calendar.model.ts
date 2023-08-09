export type CalendarType =
  | 'Holiday'
  | 'Optional Holiday'
  | 'Meetup Algetec'
  | 'Anniversary Day'
  | 'Salary'
  | 'First part of the Thirteenth Salary'
  | 'Second part of the Thirteenth Salary'
  | 'Algetec Anniversary';

export type Calendar = {
  id: number;
  name: string;
  type: string;
  user_id: number | null;
  demand_id: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  demand: {
    coding: number;
    created_at: string;
    demandTags: string[];
    experiment_id: number;
    id: number;
    institution_id: number;
    modeling: number;
    scripting: number;
    status: string;
    testing: number;
    ualab: number;
    updated_at: string;
  };
  members: string[];
};

export type CalendarCreate = {
  name?: string;
  type: CalendarType;
  user_id?: number;
  date: string;
};

export type CalendarUpdate = Partial<Omit<CalendarCreate, 'name'>> & { id: number };
