import { nanoid } from '@reduxjs/toolkit';
import { Calendar, Card, Space, Tag, TagProps, Tooltip, Typography } from 'antd';
import { CardTabListType } from 'antd/es/card';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ReactNode, useCallback, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { getHoliday, getUniqueColor, isBusinessDay } from '../../helpers';
import { User } from '../../models';
import { Calendar as CalendarType } from '../../models/calendar.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { ICalendarForUser } from '../../services/calendar.service';
import { useGetExperimentsQuery } from '../../services/demands.service';

dayjs.extend(isBetween);

interface ICalendarProps {
  mode: {
    onTabChange: (key: string) => void;
    onDemandUserChange: (users: number[]) => void;
    onDemandTagsChange: (tags: string[]) => void;
    onDayChange: (day: Dayjs) => void;
  };
  calendarProps: {
    calendar: CalendarType[];
    users: User[];
    calendarForUser: ICalendarForUser[];
  };
}

export function CalendarDashboard({ mode, calendarProps }: ICalendarProps) {
  const { onDemandTagsChange, onDemandUserChange, onTabChange, onDayChange } = mode;
  const { calendar, users, calendarForUser } = calendarProps;
  const { search } = useLocation();
  const { demandModeUsers, tabKey, demandsDay, usersDay } = useAppSelector((state) => state.calendar);
  const { data: experimentsData } = useGetExperimentsQuery();
  const currentUser = useAppSelector(selectCurrentUser);

  const [searchParams] = useSearchParams();

  const handleHolidayType = (type: string): TagProps['color'] => {
    switch (type) {
      case 'READY':
        return 'green-inverse';
      case 'LATE':
        return 'red-inverse';
      case 'ON_TIME':
        return 'blue-inverse';
      case 'OPTIONAL':
        return 'blue';
      case 'LOCAL':
        return 'green';
      case 'STATE':
        return 'gold';
      case 'NATIONAL':
        return 'red';
      default:
        return 'default';
    }
  };

  const dateCellRender = useCallback(
    (day: Dayjs) => {
      const holidaysList = getHoliday(day); // Feriados desse dia.
      const workCalendar = calendar
        .map((work) => (dayjs(work.date).isSame(day, 'day') ? work : null))
        .filter((el) => el !== null) as CalendarType[]; // Filtro do calendário para esse dia.

      const list: {
        name: string;
        type: string;
        id: number | null;
        exp_id?: number;
        experiment?: string;
        members?: string[];
      }[] = [];

      if (workCalendar) {
        workCalendar.forEach((el) =>
          list.push({
            experiment: experimentsData?.find((exp) => exp.id === el.demand?.experiment_id)?.name,
            name: el.name,
            members: el.members,
            type:
              // eslint-disable-next-line no-nested-ternary
              el.demand?.status === DemandStatus.READY
                ? 'READY'
                : dayjs(el.date).isBefore(dayjs())
                ? 'LATE'
                : 'ON_TIME',
            id: el.id,
            exp_id: el.demand_id,
          }),
        );
      }

      if (holidaysList) {
        list.push({ name: holidaysList.name, type: holidaysList.type, id: null });
      }

      if (list.length > 0) {
        return (
          <ul>
            {list.map((item) => (
              <li key={nanoid()}>
                {item.exp_id ? (
                  <Tooltip
                    title={
                      <Space direction="vertical">
                        <Typography.Text strong className="text-white">
                          {item.experiment}
                        </Typography.Text>
                        <Typography.Text className="text-gray-300">
                          {item.members?.map((el) => el.split(' ')[0]).join(', ')}
                        </Typography.Text>
                      </Space>
                    }
                  >
                    <Link to={`/demands/show/${item.exp_id}`}>
                      <Tag color={handleHolidayType(item.type)} style={{ width: '90%', margin: '1px 0' }}>
                        {item.name}
                      </Tag>
                    </Link>
                  </Tooltip>
                ) : (
                  <Tooltip title={item.name}>
                    <Tag
                      color={handleHolidayType(item.type)}
                      style={{
                        width: '90%',
                        margin: '1px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </Tag>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        );
      }
      return null;
    },
    [calendar, experimentsData],
  );

  const userModeCellRender = useCallback(
    (day: Dayjs) => {
      const holiday = getHoliday(day); // Feriados desse dia.
      const workCalendar = calendarForUser
        .map((work) =>
          day.isBetween(dayjs(work.date_start), dayjs(work.date_end)) && isBusinessDay(day) ? work : null,
        )
        .filter((el) => el !== null) as ICalendarForUser[]; // Filtro do calendário para esse dia.

      const list: { name: string; type: string; id: number | null; exp_id?: number; status?: string }[] = [];

      if (workCalendar) {
        workCalendar.forEach((el) => {
          const demandCalendar = calendar.find((item) => item.demand_id === el.demand_id);
          return list.push({
            name: el.user_name,
            type: el.type,
            id: el.demand_id,
            exp_id: el.experiment_id,
            status: demandCalendar?.demand.status,
          });
        });
      }

      if (holiday) {
        list.push({ name: holiday.name, type: holiday.type, id: null });
      }

      if (list.length > 0) {
        return (
          <ul>
            {list.map((item) => (
              <li key={nanoid()}>
                {item.exp_id ? (
                  <Link to={`/demands/show/${item.id}`}>
                    <Tooltip title={`${item.name} - ${item.exp_id}`}>
                      <Tag
                        color={item.status === DemandStatus.READY ? 'default' : getUniqueColor(item.name)}
                        className={`text-ellipsis overflow-hidden whitespace-nowrap w-11/12 my-px mx-0 ${
                          item.status === DemandStatus.READY ? 'line-through' : ''
                        }`}
                      >
                        {`${item.exp_id} - ${item.name}`}
                      </Tag>
                    </Tooltip>
                  </Link>
                ) : (
                  <Tooltip title={item.name}>
                    <Tag
                      color={handleHolidayType(item.type)}
                      className="text-ellipsis overflow-hidden whitespace-nowrap w-11/12 my-px mx-0"
                    >
                      {item.name}
                    </Tag>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        );
      }
      return null;
    },
    [calendarForUser, calendar],
  );

  const tabList: CardTabListType[] = [
    {
      key: 'demands',
      label: 'Entregas',
    },
    {
      key: 'users',
      label: 'Usuários',
    },
  ];

  const contentList: Record<string, ReactNode> = {
    demands: (
      <Calendar value={dayjs(demandsDay)} className="w-fit" onSelect={onDayChange} cellRender={dateCellRender} />
    ),
    users: <Calendar value={dayjs(usersDay)} onSelect={onDayChange} cellRender={userModeCellRender} />,
  };

  useEffect(() => {
    if (currentUser && users && demandModeUsers.length === 0) {
      onDemandUserChange([currentUser.id]);
    }
  }, [currentUser, users]);

  useEffect(() => {
    if (search) {
      const demandUsers: number[] = searchParams.getAll('demandUsers').map((value) => parseInt(value, 10));
      const demandTags = searchParams.getAll('demandTags');
      const key = searchParams.get('tabKey');

      if (key === 'users' || key === 'demands') {
        onTabChange(key);
      }
      if (demandTags && demandTags.length > 0) {
        onDemandTagsChange(demandTags);
      }
      if (demandUsers && demandUsers.length > 0) {
        onDemandUserChange(demandUsers);
      }
    }
  }, [search]);

  return (
    <Card tabList={tabList} activeTabKey={tabKey} onTabChange={onTabChange}>
      {contentList[tabKey]}
    </Card>
  );
}
