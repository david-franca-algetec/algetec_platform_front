import { Issue } from './issues.models';
import { User } from './user.model';

export interface IssueComment {
  id: number;
  type: string;
  comment: string;
  issue_id: number;
  issue: Issue;
  user_id: number | null;
  user: User | null;
  created_at: string;
  updated_at: string;
}
