import moment from 'moment';
import 'moment/dist/locale/pt-br';

moment.locale('pt-br');

export function handleStringDate(date?: string, format?: string) {
  if (!date) return null;
  return moment(new Date(date)).format(format ?? 'L');
}
