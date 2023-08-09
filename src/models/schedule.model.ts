import dayjs, { Dayjs } from 'dayjs';
import ptBr from 'dayjs/locale/pt-br';

dayjs.locale(ptBr);

export interface ISchedule {
  startedAt: string;
  finishedAt: string;
  type: string;
  demand: number;
}

export interface IScheduleResponse {
  startedAt: Dayjs;
  finishedAt: Dayjs;
  type: string;
  demand: number;
}

export class Schedule {
  // eslint-disable-next-line no-useless-constructor
  constructor(private schedule: ISchedule) {}

  public get startedAt(): Dayjs {
    return dayjs(this.schedule.startedAt);
  }

  public get finishedAt(): Dayjs {
    return dayjs(this.schedule.finishedAt);
  }

  public get type(): string {
    return this.schedule.type;
  }

  public get demand(): number {
    return this.schedule.demand;
  }

  public toJson(): IScheduleResponse {
    return {
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      type: this.type,
      demand: this.demand,
    };
  }
}
