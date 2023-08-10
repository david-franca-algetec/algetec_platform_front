/* eslint-disable no-nested-ternary */
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { orderBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { createSearchParams, useLocation, useSearchParams } from 'react-router-dom';
import { SidebarWithHeader } from '../../components';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import {
  changeTabKey,
  setDay,
  setDemandModeTags,
  setDemandModeUsers,
  setUserModeUsers,
} from '../../config/reducers/calendarSlice';
import { setSelect1, setSelect2, setSelect3 } from '../../config/reducers/dashboardSlice';
import { IDemand } from '../../models/demands.model';
import { useGetAllCalendarQuery, useGetCalendarForUserQuery } from '../../services/calendar.service';
import { useGetDemandsQuery, useGetDemandsTagsQuery } from '../../services/demands.service';
import { useGetUsersQuery } from '../../services/user.service';
import { CalendarDashboard } from './calendar';
import { ChartsDashboard } from './charts';

export function Dashboard() {
  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useAppSelector(selectCurrentUser);
  const { select1, select2, select3 } = useAppSelector((state) => state.dashboard);
  const { demandModeTags, demandModeUsers, tabKey, userModeUsers } = useAppSelector((state) => state.calendar);

  const { data: demandsData } = useGetDemandsQuery();
  const { data: usersData, isLoading: usersLoading, refetch: usersRefetch } = useGetUsersQuery();

  const {
    data: calendarForUser,
    isSuccess,
    refetch: forUsersRefetch,
    isUninitialized: forUsersIsUninitialized,
    isLoading: forUsersIsLoading,
  } = useGetCalendarForUserQuery(userModeUsers, {
    skip: userModeUsers.length === 0,
  });

  const {
    data: allCalendar,
    refetch: allCalendarRefetch,
    isLoading: allCalendarIsLoading,
  } = useGetAllCalendarQuery({
    userId: demandModeUsers,
    tags: demandModeTags.map((tag) => parseInt(tag, 10)),
  });

  const { data: tagsData, isLoading: tagsLoading, refetch: tagsRefetch } = useGetDemandsTagsQuery();

  const users = useMemo(() => orderBy(usersData, 'name') || [], [usersData]);
  const calendar = useMemo(() => allCalendar || [], [allCalendar]);
  const demands = useMemo<IDemand[]>(() => (demandsData ? orderBy(demandsData, 'experiment_id') : []), [demandsData]);
  const tags = useMemo(() => orderBy(tagsData, 'name') || [], [tagsData]);
  const forUser = useMemo(() => (calendarForUser && isSuccess ? calendarForUser : []), [calendarForUser]);

  const refetch = () => {
    allCalendarRefetch();
    usersRefetch();
    if (!forUsersIsUninitialized) {
      forUsersRefetch();
    }
    tagsRefetch();
  };

  const onTabChange = (key: string) => {
    dispatch(changeTabKey({ tabKey: key }));
  };

  const onDemandUserChange = (users: number[]) => {
    dispatch(setDemandModeUsers({ demandModeUsers: users }));
    dispatch(setUserModeUsers({ userModeUsers: users }));
  };

  const onDemandTagsChange = (tags: string[]) => {
    dispatch(setDemandModeTags({ demandModeTags: tags }));
  };

  const onDayChange = (day: Dayjs) => {
    dispatch(setDay({ day: day.toISOString(), type: tabKey }));
  };

  const onSelect1Change = (value: string) => {
    dispatch(setSelect1(value || 'demands'));
  };

  const onSelect2Change = (value: string) => {
    dispatch(setSelect2(value));
  };

  const onSelect3Change = (value: string) => {
    dispatch(setSelect3(value));
  };

  useEffect(() => {
    const demandTags = demandModeTags.map((value) => value.toString());
    const demandUsers = demandModeUsers.map((value) => value.toString());
    const users = userModeUsers.map((value) => value.toString());
    const setParams = createSearchParams({ demandTags, demandUsers, users, select1, tabKey });

    if (select2) {
      setParams.append('select2', select2);
    }

    if (select3) {
      setParams.append('select3', select3);
    }

    setSearchParams(setParams);
  }, [select1, select2, select3, demandModeTags, demandModeUsers, userModeUsers, tabKey]);

  useEffect(() => {
    if (search) {
      const demandUsers: number[] = searchParams.getAll('demandUsers').map((value) => parseInt(value, 10));
      const demandTags = searchParams.getAll('demandTags');
      const key = searchParams.get('tabKey');
      const select1Param = searchParams.get('select1');
      const select2Param = searchParams.get('select2');
      const select3Param = searchParams.get('select3');

      if (select1Param) {
        onSelect1Change(select1Param);
      }
      if (select2Param) {
        onSelect2Change(select2Param);
      }
      if (select3Param) {
        onSelect3Change(select3Param);
      }
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
    <SidebarWithHeader>
      <Row gutter={[16, 16]}>
        <Col lg={9} md={12} sm={12} xs={24}>
          <Select
            allowClear
            showSearch
            mode="multiple"
            optionFilterProp="label"
            options={users.map((user) => ({ value: user.id, label: user.name }))}
            placeholder="Usuários"
            loading={!(currentUser && !usersLoading)}
            value={currentUser && !usersLoading ? demandModeUsers : []}
            onChange={onDemandUserChange}
            maxTagCount="responsive"
            className="w-full"
          />
        </Col>
        <Col lg={9} md={12} sm={12} xs={24}>
          <Select
            className="w-full"
            options={tags.map((tag) => ({ value: tag.id.toString(), label: tag.name }))}
            placeholder="Tags"
            allowClear
            mode="tags"
            loading={tagsLoading}
            value={!tagsLoading ? demandModeTags : []}
            onChange={onDemandTagsChange}
            maxTagCount="responsive"
          />
        </Col>
        <Col lg={3} md={12} sm={12} xs={12}>
          <Button block icon={<CalendarOutlined />} onClick={() => onDayChange(dayjs())}>
            Hoje
          </Button>
        </Col>
        <Col lg={3} md={12} sm={12} xs={12}>
          <Button
            block
            icon={<ReloadOutlined />}
            loading={usersLoading || allCalendarIsLoading || tagsLoading || forUsersIsLoading}
            onClick={refetch}
          >
            Atualizar
          </Button>
        </Col>
        <Col span={24}>
          <CalendarDashboard
            mode={{ onDemandTagsChange, onDemandUserChange, onTabChange, onDayChange }}
            calendarProps={{
              calendar,
              users,
              calendarForUser: forUser,
            }}
          />
        </Col>
        <Col span={24}>
          <ChartsDashboard
            calendar={calendar}
            demands={demands}
            users={users}
            onSelect1Change={onSelect1Change}
            onSelect2Change={onSelect2Change}
            onSelect3Change={onSelect3Change}
          />
        </Col>
      </Row>
    </SidebarWithHeader>
  );
}
