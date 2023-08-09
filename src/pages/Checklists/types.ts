import { ReactNode } from 'react';

export interface EditableCellProps<T> {
  title: ReactNode;
  editable: boolean;
  children: ReactNode;
  dataIndex: keyof T;
  record: T;
  handleSave: (record: T) => void;
}
