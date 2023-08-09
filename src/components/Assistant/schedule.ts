/* eslint-disable no-loop-func */
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { handleTypeName, isHoliday, isWeekend } from '../../helpers';
import { IScheduleResponse, Schedule } from '../../models/schedule.model';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(localizedFormat);

export interface AssistantValue {
  dateTime: Dayjs;
  ualab_range: [number, number];
  coding_range: [number, number];
  testing_range: [number, number];
  modeling_range: [number, number];
  scripting_range: [number, number];
  designing_range: [number, number];
}

function skipHours(hoursToSkip: number, currentDate: Dayjs, schedules: IScheduleResponse[], isConcurrent?: boolean) {
  const skips = Array<string>();
  const weekend: string[] = [];
  const holiday: string[] = [];
  const scheduleInRange: string[] = [];
  let skipHours = Number(hoursToSkip);
  let date = currentDate.clone();
  while (skipHours > 0) {
    // Checar se a hora atual é um horário de trabalho válido
    const isWorkingHour = (date.hour() >= 8 && date.hour() < 12) || (date.hour() >= 13 && date.hour() < 18);
    const isScheduleInRange = schedules.some((schedule) => {
      const startedAt = dayjs(schedule.startedAt);
      const finishedAt = dayjs(schedule.finishedAt);
      return date.isSameOrAfter(startedAt) && date.isSameOrBefore(finishedAt);
    });
    if (isWeekend(date)) {
      // Dia 03/03/2023 é sábado
      weekend.push(date.format('L'));
      // skips.push(O dia ${date.format('L')} é fim de semana);
    } else if (isHoliday(date)) {
      holiday.push(date.format('L'));
      // skips.push(O dia ${date.format('L')} é feriado);
    } else if (isScheduleInRange && !isConcurrent) {
      // Há um agendamento de 03/03/2023 10:00:00 até 03/03/2023 11:00:00
      const schedule = schedules.find((schedule) => {
        const startedAt = schedule.startedAt.clone();
        const finishedAt = schedule.finishedAt.clone();
        return date.isSameOrAfter(startedAt) && date.isSameOrBefore(finishedAt);
      }) as Schedule;
      scheduleInRange.push(
        `Há um agendamento de ${schedule.startedAt.format('DD/MM/YYYY HH:mm:ss')} até ${schedule.finishedAt.format(
          'DD/MM/YYYY HH:mm:ss',
        )}`,
      );
    } else if (!isWorkingHour) {
      // Não é horário de trabalho
    } else {
      skipHours -= 0.5;
    }
    // Recuar a hora atual em meia hora
    date = dayjs(date.subtract(30, 'minute'));
  }
  if (weekend.length > 0) {
    skips.push(`Os dias ${[...new Set(weekend)].reverse().join(', ')} são finais de semana`);
  }
  if (holiday.length > 0) {
    skips.push(`Os dias ${[...new Set(holiday)].reverse().join(', ')} são feriados`);
  }
  if (scheduleInRange.length > 0) {
    [...new Set(scheduleInRange)].forEach((schedule) => skips.push(schedule));
  }
  return { currentDate: date, skips };
}

export function createSchedule(
  range: [number, number],
  type: string,
  assistantValue: AssistantValue,
  existingSchedules: IScheduleResponse[],
  currentDemandId?: number,
  isConcurrent?: boolean,
): { schedule: IScheduleResponse; skips: string[] } {
  const logs: string[] = [];
  // Obter a data limite do assistente a partir de assistantValue.dateTime
  const dueDate = assistantValue.dateTime;
  // Obter o último dia para entrega
  const lastDeliveryDay = Math.max(
    assistantValue.ualab_range[1],
    assistantValue.coding_range[1],
    assistantValue.testing_range[1],
    assistantValue.modeling_range[1],
    assistantValue.scripting_range[1],
    assistantValue.designing_range[1],
  );
  // Obter o número de dias úteis a serem recuados a partir de dueDate
  const daysToSkip = lastDeliveryDay - range[1];
  // Recuar dias úteis a partir de dueDate
  let currentDate = dueDate.clone();
  const workHoursPerDay = 9;
  const hoursToSkip = daysToSkip * workHoursPerDay;
  const beforeDueDate = skipHours(hoursToSkip, currentDate, [], isConcurrent);
  logs.push(...beforeDueDate.skips);
  const finishedAt = beforeDueDate.currentDate;
  // Encontrar o startedAt
  currentDate = finishedAt.clone();
  const remainingTime = range[1] - range[0];
  const hoursToWork = remainingTime * workHoursPerDay;

  const currentSchedules = existingSchedules.filter((schedule) => schedule.demand !== currentDemandId);
  const workSchedule = skipHours(hoursToWork, currentDate, currentSchedules, isConcurrent);
  logs.push(...workSchedule.skips);
  const startedAt = workSchedule.currentDate;
  const skips = [...new Set(logs)].map((log) => `${handleTypeName(type)}: ${log}`);
  return {
    schedule: {
      startedAt,
      finishedAt,
      type,
      demand: currentDemandId ?? 0,
    },
    skips,
  };
}
