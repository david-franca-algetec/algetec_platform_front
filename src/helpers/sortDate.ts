import dayjs from 'dayjs';

export function sortByDate(a: string, b: string) {
  const dayA = dayjs(a).valueOf();
  const dayB = dayjs(b).valueOf();

  if (dayA > dayB) {
    return 1;
  }
  if (dayA < dayB) {
    return -1;
  }
  return 0;
}
