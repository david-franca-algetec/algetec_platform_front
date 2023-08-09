import { Issue } from './issues.models';

export interface IssueTag {
  id: number;
  name: string;
  issues: Issue[];
  createdAt: string;
  updatedAt: string;
}
