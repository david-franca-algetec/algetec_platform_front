import { handleStringDate } from '../helpers';
import { isBusinessDay } from '../helpers/isBusinessDay';
import { DemandStatus } from './enum/demandStatus.enum';
import { Experiment } from './experiments.model';
import { Institution } from './institution.model';
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

type DemandLog = {
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
  demandLog_developers: Omit<User, 'role' | 'department'>[];
};

export interface IDemand {
  id: number;
  experiment_id: number;
  institution_id: number;
  status: DemandStatus;
  created_at: string;
  updated_at: string;
  scripting: number;
  modeling: number;
  coding: number;
  testing: number;
  ualab: number;
  experiments: Experiment;
  institutions: Omit<Institution, 'demands'>;
  demandLogs: DemandLog[];
}

export type DemandCreate = Pick<IDemand, 'status' | 'experiment_id' | 'institution_id'> & {
  logger_id: number;
  scripting_deadline: number;
  coding_deadline: number;
  testing_deadline: number;
  modeling_deadline: number;
  ualab_deadline: number;
  scripting_developers: number[];
  coding_developers: number[];
  testing_developers: number[];
  modeling_developers: number[];
  ualab_developers: number[];
  scripting_startedAt: string;
  scripting_finishedAt: string;
  modeling_startedAt: string;
  modeling_finishedAt: string;
  coding_startedAt: string;
  coding_finishedAt: string;
  testing_startedAt: string;
  testing_finishedAt: string;
  ualab_startedAt: string;
  ualab_finishedAt: string;
};

export type DemandUpdate = Partial<
  Pick<IDemand, 'status' | 'experiment_id' | 'institution_id'> & {
    scripting_developers: number[];
    coding_developers: number[];
    testing_developers: number[];
    modeling_developers: number[];
    ualab_developers: number[];
    scripting_progress: number;
    coding_progress: number;
    testing_progress: number;
    modeling_progress: number;
    ualab_progress: number;
    scripting_finishedAt: string;
    modeling_finishedAt: string;
    coding_finishedAt: string;
    testing_finishedAt: string;
    ualab_finishedAt: string;
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
    responsible: string;
    started_at: string | null | undefined;
    finished_at: string | null | undefined;
    deadline: number;
    progress: number;
  }>;
};

interface SelectOption {
  value: number;
  label: string;
}

export interface DemandUpdateForm {
  id: number;
  institution_id: number;
  experiment_id: number;
  status: DemandStatus;
  logger_id: number;
  coding_developers: SelectOption[];
  modeling_developers: SelectOption[];
  testing_developers: SelectOption[];
  scripting_developers: SelectOption[];
  ualab_developers: SelectOption[];
  scripting: number;
  coding: number;
  testing: number;
  modeling: number;
  ualab: number;
  scripting_finishedAt: Date;
  scripting_startedAt: Date;
  scripting_deadline: number;
  scripting_percent: number;
  modeling_finishedAt: Date;
  modeling_startedAt: Date;
  modeling_deadline: number;
  modeling_percent: number;
  coding_finishedAt: Date;
  coding_startedAt: Date;
  coding_deadline: number;
  coding_percent: number;
  testing_finishedAt: Date;
  testing_startedAt: Date;
  testing_deadline: number;
  testing_percent: number;
  ualab_finishedAt: Date;
  ualab_startedAt: Date;
  ualab_deadline: number;
  ualab_percent: number;
}

type TeamLog = 'Coding' | 'Testing' | 'Scripting' | 'Modeling' | 'Ualab';

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

  private lastLog(team: TeamLog): DemandLog {
    return this.demand.demandLogs
      .filter((demandLog) => demandLog.type === team)
      .sort((a, b) => (a.id > b.id ? 1 : -1))[0];
  }

  private handleLogDates(team: TeamLog) {
    const lastLog = this.lastLog(team);
    const startedAt = new Date(lastLog.started_at);
    const finishedAt = new Date(lastLog.finished_at);

    return { startedAt, finishedAt };
  }

  private demandLogDevelopers(team: TeamLog): SelectOption[] {
    return this.lastLog(team).demandLog_developers.map((developer) => ({
      value: developer.id,
      label: developer.name,
    }));
  }

  getDates(team: TeamLog): Date[] {
    const { startedAt, finishedAt } = this.handleLogDates(team);
    const dates = [];

    for (let i = startedAt; i <= finishedAt; i.setDate(i.getDate() + 1)) {
      if (isBusinessDay(i)) {
        dates.push(new Date(i));
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

  public toProduction(): DemandProduction {
    return {
      experimentName: this.experimentName,
      status: this.status,
      production: [
        {
          type: 'Roteirização',
          responsible: this.lastLog('Scripting')
            .demandLog_developers.map((developer) => developer.name)
            .join(', '),
          started_at: handleStringDate(this.lastLog('Scripting').started_at) || '',
          finished_at: handleStringDate(this.lastLog('Scripting').finished_at) || '',
          progress: this.scripting,
          deadline: this.lastLog('Scripting').deadline,
        },
        {
          type: 'Programação',
          responsible: this.lastLog('Coding')
            .demandLog_developers.map((developer) => developer.name)
            .join(', '),
          started_at: handleStringDate(this.lastLog('Coding').started_at) || '',
          finished_at: handleStringDate(this.lastLog('Coding').finished_at) || '',
          progress: this.coding,
          deadline: this.lastLog('Coding').deadline,
        },
        {
          type: 'Testes',
          responsible: this.lastLog('Testing')
            .demandLog_developers.map((developer) => developer.name)
            .join(', '),
          started_at: handleStringDate(this.lastLog('Testing').started_at) || '',
          finished_at: handleStringDate(this.lastLog('Testing').finished_at) || '',
          progress: this.testing,
          deadline: this.lastLog('Testing').deadline,
        },
        {
          type: 'Modelagem',
          responsible: this.lastLog('Modeling')
            .demandLog_developers.map((developer) => developer.name)
            .join(', '),
          started_at: handleStringDate(this.lastLog('Modeling').started_at) || '',
          finished_at: handleStringDate(this.lastLog('Modeling').finished_at) || '',
          progress: this.modeling,
          deadline: this.lastLog('Modeling').deadline,
        },
        {
          type: 'UALAB',
          responsible: this.lastLog('Ualab')
            .demandLog_developers.map((developer) => developer.name)
            .join(', '),
          started_at: handleStringDate(this.lastLog('Ualab').started_at),
          finished_at: handleStringDate(this.lastLog('Ualab').finished_at),
          progress: this.ualab,
          deadline: this.lastLog('Ualab').deadline,
        },
      ],
    };
  }

  public toUpdate(): DemandUpdateForm {
    return {
      id: this.id,
      status: this.status,
      experiment_id: this.demand.experiments.id,
      institution_id: this.demand.institutions.id,
      logger_id: 0,
      scripting_developers: this.demandLogDevelopers('Scripting'),
      coding_developers: this.demandLogDevelopers('Coding'),
      testing_developers: this.demandLogDevelopers('Testing'),
      modeling_developers: this.demandLogDevelopers('Modeling'),
      ualab_developers: this.demandLogDevelopers('Ualab'),
      scripting: this.scripting,
      coding: this.coding,
      testing: this.testing,
      modeling: this.modeling,
      ualab: this.ualab,
      ualab_finishedAt: this.handleLogDates('Ualab').finishedAt,
      ualab_startedAt: this.handleLogDates('Ualab').startedAt,
      coding_finishedAt: this.handleLogDates('Coding').finishedAt,
      coding_startedAt: this.handleLogDates('Coding').startedAt,
      scripting_finishedAt: this.handleLogDates('Scripting').finishedAt,
      scripting_startedAt: this.handleLogDates('Scripting').startedAt,
      testing_finishedAt: this.handleLogDates('Testing').finishedAt,
      testing_startedAt: this.handleLogDates('Testing').startedAt,
      modeling_finishedAt: this.handleLogDates('Modeling').finishedAt,
      modeling_startedAt: this.handleLogDates('Modeling').startedAt,
      coding_deadline: this.lastLog('Coding').deadline,
      modeling_deadline: this.lastLog('Modeling').deadline,
      scripting_deadline: this.lastLog('Scripting').deadline,
      testing_deadline: this.lastLog('Testing').deadline,
      ualab_deadline: this.lastLog('Ualab').deadline,
      coding_percent: this.getPercent('Coding'),
      modeling_percent: this.getPercent('Modeling'),
      scripting_percent: this.getPercent('Scripting'),
      testing_percent: this.getPercent('Testing'),
      ualab_percent: this.getPercent('Ualab'),
    };
  }

  public toDemand(): IDemand {
    return this.demand;
  }

  public static toPut(values: DemandUpdateForm, id: number): DemandUpdate {
    return {
      id: values.id,
      institution_id: values.institution_id,
      experiment_id: values.experiment_id,
      status: values.status,
      logger_id: id,
      coding_developers: values.coding_developers.map((developer) => developer.value),
      modeling_developers: values.modeling_developers.map((developer) => developer.value),
      testing_developers: values.testing_developers.map((developer) => developer.value),
      scripting_developers: values.scripting_developers.map((developer) => developer.value),
      ualab_developers: values.ualab_developers.map((developer) => developer.value),
      coding_finishedAt: values.coding_finishedAt.toISOString(),
      modeling_finishedAt: values.modeling_finishedAt.toISOString(),
      scripting_finishedAt: values.scripting_finishedAt.toISOString(),
      testing_finishedAt: values.testing_finishedAt.toISOString(),
      ualab_finishedAt: values.ualab_finishedAt.toISOString(),
      coding_progress: values.coding,
      modeling_progress: values.modeling,
      scripting_progress: values.scripting,
      testing_progress: values.testing,
      ualab_progress: values.ualab,
    };
  }
}
