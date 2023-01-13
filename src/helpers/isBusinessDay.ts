/* eslint-disable no-plusplus */
import Holydays from 'date-holidays';
import moment from 'moment';

const hd = new Holydays('BR', 'ba');

hd.setHoliday('12-08', {
  name: 'Dia de Nossa Senhora da Conceição',
  type: 'public',
});

hd.setHoliday('06-24', {
  name: 'Dia de São João',
  type: 'public',
});

export const isHoliday = (date: Date) => {
  const itsHoliday = hd.isHoliday(date);
  return itsHoliday;
};

export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isBusinessDay = (date: Date) => !isHoliday(date) && !isWeekend(date);

export const allHolydaysByYear = (year: number) => hd.getHolidays(year).map((h) => new Date(h.date));

export const allWeekends = (year: number) => {
  const weekends = [];
  const start = moment(`${year}-01-01`);
  const end = moment(`${year}-12-31`);
  const days = end.diff(start, 'days');

  for (let i = 0; i < days; i++) {
    const day = start.clone().add(i, 'days');
    if (day.day() === 0 || day.day() === 6) {
      weekends.push(day.toDate());
    }
  }

  return weekends;
};

export const numberOfBusinessDays = (startDate: Date, endDate: Date) => {
  let count = 0;
  let currentDate = moment(startDate).toDate();

  while (currentDate <= endDate) {
    if (isBusinessDay(currentDate)) {
      count++;
    }
    currentDate = moment(currentDate).add(1, 'days').toDate();
  }

  return count;
};
