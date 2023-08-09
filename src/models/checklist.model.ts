export interface IChecklist {
  id: number;
  name: string;
  departments: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    checklist_id: number;
  }[];
  checklist_parameters: {
    id: number;
    checklist_id: number;
    name: string;
    percentage: number;
    checked?: boolean;
    created_at: string;
    updated_at: string;
    order: number;
    checklist_parameters: IChecklist['checklist_parameters'][];
  }[];
}

export interface IDemandChecklist {
  id: number;
  name: string;
  demand_checklist_parameters: {
    id: number;
    checklist_id: number;
    name: string;
    percentage: number;
    checked: boolean;
    created_at: string;
    updated_at: string;
    order: number;
    demand_checklist_parameters: IDemandChecklist['demand_checklist_parameters'];
  }[];
}

export interface IChecklistCreate {
  name: string; // maxLength 255
  department_ids: number[];
  parameters: Array<{
    id?: number;
    name: string;
    percentage: number;
    checked: boolean;
    order: number;
    subItems?: Array<{
      name: string;
      percentage: number;
      checked: boolean;
      order: number;
    }>;
  }>;
}

export interface IChecklistUpdate extends Partial<IChecklistCreate> {
  id: number;
}
