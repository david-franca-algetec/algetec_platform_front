import { ISSUES_STATUS } from './enum/issuesStatus.enum';
import { PRIORITY } from './enum/priority.enum';
import { Experiment } from './experiments.model';
import { IssueComment } from './issuesComment.model';
import { IssueFile } from './issuesFile.model';
import { IssueTag } from './issueTag.model';
import { User } from './user.model';

export interface Issue {
  id: number;
  problem: string;
  priority: number;
  version: string;
  status: string;
  description: string;
  experiment_id: number;
  approved: boolean;
  experiment: Experiment;
  created_by_id: number;
  creator: User;
  responsible_id: number;
  responsible: User;
  issueComments: IssueComment[];
  issueFiles: IssueFile[];
  issueTags: IssueTag[];
  created_at: string;
  updated_at: string;
}
export interface IssuesUpdate {
  status?: ISSUES_STATUS;
  experiment_id?: number;
  /**
   * Só demands_leader e admin podem editar approved
   */
  approved?: boolean;
  responsible_id?: number;
  problem?: string;
  description?: string;
  tags?: number[];
  priority?: PRIORITY;
}
