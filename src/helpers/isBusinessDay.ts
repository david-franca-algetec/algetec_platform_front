import dayjs, { Dayjs } from 'dayjs';

import { isHoliday } from './getHolidays';

export const getHoliday = (date: Dayjs) => isHoliday(date);

export const isWeekend = (date: Dayjs) => {
  const day = date.day();
  return day === 0 || day === 6;
};

export const isBusinessDay = (date: Dayjs) => !isHoliday(date) && !isWeekend(date) && dayjs(date).isValid();

export const businessDaysAdd = (date: Dayjs, number: number) => {
  const numericDirection = number < 0 ? -1 : 1;
  let currentDay = date.clone();
  let daysRemaining = Math.abs(number);

  while (daysRemaining > 0) {
    currentDay = currentDay.add(numericDirection, 'd');

    if (isBusinessDay(currentDay)) daysRemaining -= 1;
  }
  return currentDay;
};

export const businessDaysSubtract = (date: Dayjs, number: number) => {
  let currentDay = date.clone();

  currentDay = businessDaysAdd(currentDay, number * -1);

  return currentDay;
};

export const businessDiffHours = (started: Dayjs | string, finished: Dayjs | string) => {
  const day1 = dayjs(started).clone();
  const day2 = dayjs(finished).clone();

  const isPositiveDiff = day1 >= day2;
  let start = isPositiveDiff ? day2 : day1;
  const end = isPositiveDiff ? day1 : day2;

  let hoursBetween = 0;

  if (start.isSame(end)) return hoursBetween;

  while (start < end) {
    if (isBusinessDay(start)) hoursBetween += 1;

    start = start.add(1, 'h');
  }

  return isPositiveDiff ? hoursBetween : -hoursBetween;
};

export const numberOfBusinessDays = (startDate: Date | undefined, endDate: Date | undefined) => {
  if (startDate && endDate) {
    const fullHours = businessDiffHours(dayjs(endDate), dayjs(startDate));
    const hours = fullHours % 24;
    const days = Math.floor(fullHours / 24);

    if (days === 0) {
      return {
        hours: fullHours,
        message: `${hours} horas`,
      };
    }

    return {
      hours: fullHours,
      message: hours === 0 ? `${days} dias` : `${days} dias e ${hours} horas`,
    };
  }
  return undefined;
};
