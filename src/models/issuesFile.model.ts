import { Issue } from './issues.models';
import { User } from './user.model';

export interface IssueFile {
  id: number;
  name: string;
  link: string;
  user_id: number | null;
  user: User | null;
  issue_id: number;
  issue: Issue;
  createdAt: string;
  updatedAt: string;
}
