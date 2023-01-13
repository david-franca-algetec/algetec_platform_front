import 'react-datepicker/dist/react-datepicker.css';

import ptBR from 'date-fns/locale/pt-BR';
import { useCallback, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import moment from 'moment';
import { styled } from '../../config/styles/stitches.config';
import { isBusinessDay } from '../../helpers/isBusinessDay';

export const DatePickerStyled = styled(ReactDatePicker, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 13,
  lineHeight: 1,
  gap: 5,
  backgroundColor: 'white',
  height: 40,
  border: '1px solid $violet8',
  color: '$violet11',
  boxShadow: `0 2px 10px $blackA7`,

  '&:hover': { backgroundColor: '$mauve3' },
  '&:disabled': {
    backgroundColor: '$violet3',
    color: '$violet8',
    boxShadow: '0 0 0 1px $violet2',
    pointerEvents: 'none',
  },
});

interface DatePickerMultiProps {
  id: string;
  getStartDate: (date: Date) => void;
  getEndDate: (date: Date) => void;
}

export function DatePickerMulti({ id, getStartDate, getEndDate }: DatePickerMultiProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [start, end] = dateRange;

  const isUnavailable = useCallback((date: Date) => isBusinessDay(date), []);

  useEffect(() => {
    if (!start || !end) return;

    getStartDate(start);
    getEndDate(end);
  }, [start, end]);
  return (
    <DatePickerStyled
      id={id}
      locale={ptBR}
      selectsRange
      dateFormat="dd/MM/yyyy"
      startDate={start}
      endDate={end}
      filterDate={isUnavailable}
      onChange={(update) => {
        setDateRange(update as [Date | null, Date | null]);
      }}
      withPortal
    />
  );
}

interface DatePickerProps {
  id: string;
  getStartDate: (date: Date) => void;
  dateTime?: Date;
  minDate?: Date;
  disabled?: boolean;
}

export function DatePicker({ id, getStartDate, dateTime, disabled, minDate }: DatePickerProps) {
  const [date, setDate] = useState<Date | null | undefined>(null);

  const isUnavailable = useCallback((date: Date) => isBusinessDay(date), []);

  useEffect(() => {
    if (!date) return;

    getStartDate(date);
  }, [date]);

  return (
    <DatePickerStyled
      disabled={disabled}
      id={id}
      locale={ptBR}
      dateFormat="dd/MM/yyyy"
      minDate={minDate ? moment(minDate).add(1, 'day').toDate() : null}
      selected={dateTime ?? date}
      filterDate={isUnavailable}
      onChange={(update) => {
        setDate(update as Date);
      }}
      withPortal
    />
  );
}

DatePicker.defaultProps = {
  dateTime: null,
  disabled: false,
  minDate: null,
};
