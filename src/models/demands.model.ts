import { RcFile } from 'antd/es/upload';
import dayjs, { Dayjs } from 'dayjs';
import { filter, groupBy, isNull } from 'lodash';
import moment from 'moment';

import { handlePriority, handleStringDate, isBusinessDay, numberOfBusinessDays } from '../helpers';
import burningDownChart from './burningDownChart';
import { IChecklistUpdate, IDemandChecklist } from './checklist.model';
import { Department } from './department.model';
import { DemandStatus } from './enum/demandStatus.enum';
import { PRIORITY } from './enum/priority.enum';
import { Experiment } from './experiments.model';
import { Institution } from './institution.model';
import { Issue } from './issues.models';
import { DemandTags } from './tag.model';
import { User } from './user.model';

// eslint-disable-next-line import/no-cycle
type Logger = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  remember_me_token: null;
  created_at: string;
  updated_at: string;
};

export type DemandLog = {
  id: number;
  demand_id: number;
  logger_id: number;
  type: string;
  progress: number;
  deadline: number;
  started_at: string;
  finished_at: string;
  created_at: string;
  updated_at: string;
  logger: Logger;
  active: boolean;
  demandLog_developers: Omit<User, 'role' | 'department'>[];
  checklist: IDemandChecklist;
};

export type CreateDemandLog = {
  type: string;
  demand_id: number;
  logger_id: number;
  deadline: number;
  developers: number[];
  active: boolean;
  finishedAt: string;
  createdAt: string;
  progress: number;
};

export interface IFiles {
  id: number;
  demand_id: number;
  department_id: number;
  user_id: number;
  name: string;
  link: string;
  created_at: string;
  updated_at: string;
  department: Department;
  user: User;
}

type ExperimentsWithIssues = Experiment & {
  issues: Issue[];
};

export interface IDemand {
  coding: number;
  created_at: string;
  demandLogs: DemandLog[];
  demandTags?: DemandTags[];
  description?: string;
  designing: number;
  experiment_id: number;
  experiments: ExperimentsWithIssues;
  files: IFiles[];
  finished_at: string;
  id: number;
  institution_id: number;
  institutions: Omit<Institution, 'demands'>;
  modeling: number;
  scripting: number;
  status: DemandStatus;
  testing: number;
  ualab: number;
  updated_at: string;
  created_by_id?: string | null;
  creator?: User;
  latest_scripting_developer: User[];
  latest_modeling_developer: User[];
  latest_coding_developer: User[];
  latest_testing_developer: User[];
  latest_ualab_developer: User[];
  latest_designing_developer: User[];
  latest_scripting_log: DemandLog;
  latest_modeling_log: DemandLog;
  latest_coding_log: DemandLog;
  latest_testing_log: DemandLog;
  latest_ualab_log: DemandLog;
  latest_designing_log: DemandLog;
}

export type DemandCreate = Pick<IDemand, 'status' | 'experiment_id' | 'institution_id'> & {
  coding_checklist_id?: number;
  coding_deadline?: number;
  coding_developers?: number[];
  coding_finishedAt?: string;
  coding_startedAt?: string;
  logger_id: number;
  modeling_checklist_id?: number;
  modeling_deadline?: number;
  modeling_developers?: number[];
  modeling_finishedAt?: string;
  modeling_startedAt?: string;
  scripting_checklist_id?: number;
  scripting_deadline?: number;
  scripting_developers?: number[];
  scripting_finishedAt?: string;
  scripting_startedAt?: string;
  tags?: string[];
  testing_checklist_id?: number;
  testing_deadline?: number;
  testing_developers?: number[];
  testing_finishedAt?: string;
  testing_startedAt?: string;
  ualab_checklist_id?: number;
  ualab_deadline?: number;
  ualab_developers?: number[];
  ualab_finishedAt?: string;
  ualab_startedAt?: string;
  designing_checklist_id?: number;
  designing_deadline?: number;
  designing_developers?: number[];
  designing_finishedAt?: string;
  designing_startedAt?: string;
};

export type DemandUpdate = Partial<
  Pick<IDemand, 'status' | 'experiment_id' | 'institution_id'> & {
    tags: string[];
    coding_developers: number[];
    coding_progress: number;
    coding_finishedAt: string;
    coding_deadline: number;
    coding_startedAt: string;
    coding_checklist: IChecklistUpdate;
    coding_checklist_id: number;
    coding_files: RcFile[];
    scripting_developers: number[];
    scripting_progress: number;
    scripting_finishedAt: string;
    scripting_deadline: number;
    scripting_startedAt: string;
    scripting_checklist: IChecklistUpdate;
    scripting_checklist_id: number;
    scripting_files: RcFile[];
    testing_developers: number[];
    testing_progress: number;
    testing_finishedAt: string;
    testing_deadline: number;
    testing_startedAt: string;
    testing_checklist: IChecklistUpdate;
    testing_checklist_id: number;
    testing_files: RcFile[];
    ualab_developers: number[];
    ualab_progress: number;
    ualab_finishedAt: string;
    ualab_deadline: number;
    ualab_startedAt: string;
    ualab_checklist: IChecklistUpdate;
    ualab_checklist_id: number;
    ualab_files: RcFile[];
    modeling_developers: number[];
    modeling_progress: number;
    modeling_finishedAt: string;
    modeling_deadline: number;
    modeling_startedAt: string;
    modeling_checklist: IChecklistUpdate;
    modeling_checklist_id: number;
    modeling_files: RcFile[];
    designing_developers: number[];
    designing_progress: number;
    designing_finishedAt: string;
    designing_deadline: number;
    designing_startedAt: string;
    designing_checklist: IChecklistUpdate;
    designing_checklist_id: number;
    designing_files: RcFile[];
  }
> & {
  id: number;
  logger_id: number;
};

type DemandProduction = {
  experimentName: string;
  status: DemandStatus;
  production: Array<{
    type: string;
    responsible?: string;
    started_at: string | null | undefined;
    finished_at: string | null | undefined;
    deadline?: number;
    progress: number;
  }>;
  logs: DemandLog[];
  id: number;
  issues: { title?: string; status?: string; approved?: string }[];
};

export interface SelectOption {
  value: number;
  label: string;
}

interface Log {
  taskStartDateTime: string; // Data de início da demanda
  taskEndDateTime: string; // Data de término da demanda
  taskProgress: number; // Progresso da demanda
  logDateTime: string; // Data do log
}

interface PointRemaining {
  x: Date;
  y_remainingWork: number;
}

interface ChartData {
  idealBurn: PointRemaining[];
  actualBurn: PointRemaining[];
  idealSpeed: number;
  actualSpeed: number;
}

export interface DemandUpdateForm {
  coding?: number;
  coding_checklist?: IDemandChecklist;
  coding_deadline?: number;
  coding_developers?: SelectOption[];
  coding_files?: IFiles[];
  coding_finishedAt?: Dayjs;
  coding_message?: string;
  coding_percent?: number;
  coding_startedAt?: Dayjs;
  demandTags?: DemandTags[];
  experiment_id: number;
  id: number;
  institution_id: number;
  logger_id: number;
  modeling?: number;
  modeling_checklist?: IDemandChecklist;
  modeling_deadline?: number;
  modeling_developers?: SelectOption[];
  modeling_files?: IFiles[];
  modeling_finishedAt?: Dayjs;
  modeling_message?: string;
  modeling_percent?: number;
  modeling_startedAt?: Dayjs;
  scripting?: number;
  scripting_checklist?: IDemandChecklist;
  scripting_deadline?: number;
  scripting_developers?: SelectOption[];
  scripting_files?: IFiles[];
  scripting_finishedAt?: Dayjs;
  scripting_message?: string;
  scripting_percent?: number;
  scripting_startedAt?: Dayjs;
  status: DemandStatus;
  testing?: number;
  testing_checklist?: IDemandChecklist;
  testing_deadline?: number;
  testing_developers?: SelectOption[];
  testing_files?: IFiles[];
  testing_finishedAt?: Dayjs;
  testing_message?: string;
  testing_percent?: number;
  testing_startedAt?: Dayjs;
  ualab?: number;
  ualab_checklist?: IDemandChecklist;
  ualab_deadline?: number;
  ualab_developers?: SelectOption[];
  ualab_files?: IFiles[];
  ualab_finishedAt?: Dayjs;
  ualab_message?: string;
  ualab_percent?: number;
  ualab_startedAt?: Dayjs;
  designing?: number;
  designing_checklist?: IDemandChecklist;
  designing_deadline?: number;
  designing_developers?: SelectOption[];
  designing_files?: IFiles[];
  designing_finishedAt?: Dayjs;
  designing_message?: string;
  designing_percent?: number;
  designing_startedAt?: Dayjs;
}

export type TeamLog = 'Coding' | 'Testing' | 'Scripting' | 'Modeling' | 'Ualab' | 'Designing';

export class Demand {
  // eslint-disable-next-line no-useless-constructor
  constructor(private demand: IDemand) {}

  get id(): number {
    return this.demand.id;
  }

  get experimentName(): string {
    return this.demand.experiments.name;
  }

  get status(): DemandStatus {
    return this.demand.status;
  }

  get scripting(): number {
    return this.demand.scripting;
  }

  get modeling(): number {
    return this.demand.modeling;
  }

  get coding(): number {
    return this.demand.coding;
  }

  get testing(): number {
    return this.demand.testing;
  }

  get ualab(): number {
    return this.demand.ualab;
  }

  get designing(): number {
    return this.demand.designing;
  }

  get radial(): number[] {
    return [this.scripting, this.coding, this.testing, this.ualab, this.modeling, this.designing];
  }

  getDates(team: TeamLog, allDays?: boolean): Date[] {
    const logDates = this.handleLogDates(team);
    const dates = [];

    if (logDates) {
      const { finishedAt, startedAt } = logDates;
      for (let i = startedAt; i <= finishedAt; i.setDate(i.getDate() + 1)) {
        if (isBusinessDay(dayjs(i))) {
          dates.push(new Date(i));
        }
        if (allDays && !isBusinessDay(dayjs(i))) {
          dates.push(new Date(i));
        }
      }
    }

    return dates;
  }

  verifyDate(team: TeamLog): number {
    const today = new Date();
    const teamDates = this.getDates(team);

    return (
      teamDates.findIndex(
        (date) =>
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      ) + 1
    );
  }

  getPercent(team: TeamLog): number {
    const todayIndex = this.verifyDate(team);

    if (todayIndex === 0) {
      return 100;
    }

    const teamDates = this.getDates(team);

    return Math.round((todayIndex * 100) / teamDates.length);
  }

  handleFiles(team: TeamLog) {
    const files = this.demand.files.map((file) => (file.department.name === team ? file : null));
    return filter(files, (file) => !isNull(file)) as IFiles[];
  }

  public toProduction(): DemandProduction {
    const demandsLog = [...this.demand.demandLogs];
    const scriptingLastLog = this.lastLog('Scripting');
    const codingLastLog = this.lastLog('Coding');
    const ualabLastLog = this.lastLog('Ualab');
    const testingLastLog = this.lastLog('Testing');
    const modelingLastLog = this.lastLog('Modeling');
    const designingLastLog = this.lastLog('Designing');
    const issuesGrouped = groupBy(this.demand.experiments.issues, 'priority') as { [p: string]: Issue[] };
    const status = Object.values(PRIORITY).map((value) => Number(value));

    const issuesValues: { title?: string; status?: string; approved?: string }[] = [];

    status.forEach((value) => {
      if (issuesGrouped[value]) {
        const statusReduced = issuesGrouped[value].map((issue) => issue.status);

        const uniqueElements = [...new Set(statusReduced)];

        const count = uniqueElements.map((element) => [
          element.toLowerCase(),
          statusReduced.filter((el) => el === element).length,
        ]);

        const quantity = issuesGrouped[value].length;
        let approved = 0;

        issuesGrouped[value].forEach((issue) => {
          if (issue.approved) {
            approved += 1;
          }
        });
        issuesValues.push({
          title: `${quantity} problema${quantity > 1 ? 's' : ''} com gravidade ${handlePriority(value, true)}`,
          approved: `${approved} aprovado${approved > 1 ? 's' : ''}`,
          status: `${count[0][1]} ${count[0][0]}`,
        });
      }
    });
    return {
      experimentName: this.experimentName,
      status: this.status,
      production: [
        {
          type: 'Roteirização',
          responsible: scriptingLastLog?.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(scriptingLastLog?.started_at, 'LLLL'),
          finished_at: handleStringDate(scriptingLastLog?.finished_at, 'LLLL'),
          progress: this.scripting,
          deadline: scriptingLastLog?.deadline,
        },
        {
          type: 'Programação',
          responsible: codingLastLog?.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(codingLastLog?.started_at, 'LLLL'),
          finished_at: handleStringDate(codingLastLog?.finished_at, 'LLLL'),
          progress: this.coding,
          deadline: codingLastLog?.deadline,
        },
        {
          type: 'Testes',
          responsible: testingLastLog?.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(testingLastLog?.started_at, 'LLLL'),
          finished_at: handleStringDate(testingLastLog?.finished_at, 'LLLL'),
          progress: this.testing,
          deadline: testingLastLog?.deadline,
        },
        {
          type: 'Modelagem',
          responsible: modelingLastLog?.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(modelingLastLog?.started_at, 'LLLL'),
          finished_at: handleStringDate(modelingLastLog?.finished_at, 'LLLL'),
          progress: this.modeling,
          deadline: modelingLastLog?.deadline,
        },
        {
          type: 'UALAB',
          responsible: ualabLastLog?.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(ualabLastLog?.started_at, 'LLLL'),
          finished_at: handleStringDate(ualabLastLog?.finished_at, 'LLLL'),
          progress: this.ualab,
          deadline: ualabLastLog?.deadline,
        },
        {
          type: 'Designing',
          responsible: designingLastLog?.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(designingLastLog?.started_at, 'LLLL'),
          finished_at: handleStringDate(designingLastLog?.finished_at, 'LLLL'),
          progress: this.ualab,
          deadline: designingLastLog?.deadline,
        },
      ],
      logs: demandsLog.sort((a, b) => {
        const aDate = new Date(a.updated_at);
        const bDate = new Date(b.updated_at);

        if (aDate < bDate) {
          return 1;
        }
        if (aDate > bDate) {
          return -1;
        }
        return 0;
      }),
      id: this.demand.experiment_id,
      issues: issuesValues,
    };
  }

  public toUpdate(): DemandUpdateForm {
    const ualabDates = this.handleLogDates('Ualab');
    const codingDates = this.handleLogDates('Coding');
    const testingDates = this.handleLogDates('Testing');
    const scriptingDates = this.handleLogDates('Scripting');
    const modelingDates = this.handleLogDates('Modeling');
    const designingDates = this.handleLogDates('Designing');

    return {
      coding: this.coding,
      coding_checklist: this.handleChecklist('Coding'),
      coding_deadline: this.lastLog('Coding')?.deadline,
      coding_developers: this.demandLogDevelopers('Coding'),
      coding_files: this.handleFiles('Coding'),
      coding_finishedAt: codingDates?.finishedAt ? dayjs(codingDates?.finishedAt) : undefined,
      coding_message: numberOfBusinessDays(codingDates?.startedAt, codingDates?.finishedAt)?.message,
      coding_percent: this.getPercent('Coding'),
      coding_startedAt: codingDates?.startedAt ? dayjs(codingDates?.startedAt) : undefined,
      demandTags: this.demand.demandTags,
      designing: this.ualab,
      designing_checklist: this.handleChecklist('Designing'),
      designing_deadline: this.lastLog('Designing')?.deadline,
      designing_developers: this.demandLogDevelopers('Designing'),
      designing_files: this.handleFiles('Designing'),
      designing_finishedAt: designingDates?.finishedAt ? dayjs(designingDates?.finishedAt) : undefined,
      designing_message: numberOfBusinessDays(designingDates?.startedAt, designingDates?.finishedAt)?.message,
      designing_percent: this.getPercent('Designing'),
      designing_startedAt: designingDates?.startedAt ? dayjs(designingDates?.startedAt) : undefined,
      experiment_id: this.demand.experiments.id,
      id: this.id,
      institution_id: this.demand.institutions.id,
      logger_id: 0,
      modeling: this.modeling,
      modeling_checklist: this.handleChecklist('Modeling'),
      modeling_deadline: this.lastLog('Modeling')?.deadline,
      modeling_developers: this.demandLogDevelopers('Modeling'),
      modeling_files: this.handleFiles('Modeling'),
      modeling_finishedAt: modelingDates?.finishedAt ? dayjs(modelingDates?.finishedAt) : undefined,
      modeling_message: numberOfBusinessDays(modelingDates?.startedAt, modelingDates?.finishedAt)?.message,
      modeling_percent: this.getPercent('Modeling'),
      modeling_startedAt: modelingDates?.startedAt ? dayjs(modelingDates?.startedAt) : undefined,
      scripting: this.scripting,
      scripting_checklist: this.handleChecklist('Scripting'),
      scripting_deadline: this.lastLog('Scripting')?.deadline,
      scripting_developers: this.demandLogDevelopers('Scripting'),
      scripting_files: this.handleFiles('Scripting'),
      scripting_finishedAt: scriptingDates?.finishedAt ? dayjs(scriptingDates?.finishedAt) : undefined,
      scripting_message: numberOfBusinessDays(scriptingDates?.startedAt, scriptingDates?.finishedAt)?.message,
      scripting_percent: this.getPercent('Scripting'),
      scripting_startedAt: scriptingDates?.startedAt ? dayjs(scriptingDates?.startedAt) : undefined,
      status: this.status,
      testing: this.testing,
      testing_checklist: this.handleChecklist('Testing'),
      testing_deadline: this.lastLog('Testing')?.deadline,
      testing_developers: this.demandLogDevelopers('Testing'),
      testing_files: this.handleFiles('Testing'),
      testing_finishedAt: testingDates?.finishedAt ? dayjs(testingDates?.finishedAt) : undefined,
      testing_message: numberOfBusinessDays(testingDates?.startedAt, testingDates?.finishedAt)?.message,
      testing_percent: this.getPercent('Testing'),
      testing_startedAt: testingDates?.startedAt ? dayjs(testingDates?.startedAt) : undefined,
      ualab: this.ualab,
      ualab_checklist: this.handleChecklist('Ualab'),
      ualab_deadline: this.lastLog('Ualab')?.deadline,
      ualab_developers: this.demandLogDevelopers('Ualab'),
      ualab_files: this.handleFiles('Ualab'),
      ualab_finishedAt: ualabDates?.finishedAt ? dayjs(ualabDates?.finishedAt) : undefined,
      ualab_message: numberOfBusinessDays(ualabDates?.startedAt, ualabDates?.finishedAt)?.message,
      ualab_percent: this.getPercent('Ualab'),
      ualab_startedAt: ualabDates?.startedAt ? dayjs(ualabDates?.startedAt) : undefined,
    };
  }

  logsToChart(team: TeamLog): ChartData | null {
    const logs = this.logsByTeam(team);
    if (logs.length > 0) {
      const initialValues: Log[] = logs.map((log) => ({
        logDateTime: moment(log.created_at).toISOString(),
        taskStartDateTime: moment(log.started_at).toISOString(),
        taskEndDateTime: moment(log.finished_at).toISOString(),
        taskProgress: log.progress,
      }));
      return burningDownChart(initialValues);
    }
    return null;
  }

  public toDashboard(team: TeamLog) {
    const logs = this.logsToChart(team);
    if (logs) {
      const actualBurn = logs.actualBurn.map((burn) => [
        moment(burn.x).valueOf(),
        parseFloat(burn.y_remainingWork.toPrecision(2)),
      ]);
      const idealBurn = logs.idealBurn.map((burn) => [
        moment(burn.x).valueOf(),
        parseFloat(burn.y_remainingWork.toPrecision(2)),
      ]);

      return {
        real: actualBurn,
        ideal: idealBurn,
        idealSpeed: parseFloat(logs.idealSpeed.toPrecision(2)),
        actualSpeed: parseFloat(logs.actualSpeed.toPrecision(2)),
      };
    }
    return null;
  }

  private logsByTeam(team: TeamLog): DemandLog[] {
    const demandLogsByTeam = this.demand.demandLogs.filter((demandLog) => demandLog.type === team && demandLog.active);
    if (demandLogsByTeam.length) {
      return demandLogsByTeam.sort((a, b) =>
        moment(a.created_at).valueOf() > moment(b.created_at).valueOf() ? 1 : -1,
      );
    }
    return [];
  }

  private lastLog(team: TeamLog): DemandLog | undefined {
    const filteredLogs = this.demand.demandLogs.filter((demandLog) => demandLog.type === team);
    return filteredLogs.length > 0
      ? filteredLogs.sort((a, b) => (moment(a.created_at).valueOf() < moment(b.created_at).valueOf() ? 1 : -1))[0]
      : undefined;
  }

  private handleLogDates(team: TeamLog) {
    const lastLog = this.lastLog(team);
    if (lastLog) {
      const startedAt = new Date(lastLog.started_at);
      const finishedAt = new Date(lastLog.finished_at);

      return { startedAt, finishedAt };
    }
    return undefined;
  }

  private handleChecklist(team: TeamLog): IDemandChecklist | undefined {
    const lastLog = this.lastLog(team);

    if (lastLog) {
      return lastLog.checklist;
    }
    return undefined;
  }

  private demandLogDevelopers(team: TeamLog): SelectOption[] | undefined {
    const lastLog = this.lastLog(team);
    if (lastLog) {
      return lastLog.demandLog_developers.map((developer) => ({
        value: developer.id,
        label: developer.name,
      }));
    }
    return undefined;
  }
}
