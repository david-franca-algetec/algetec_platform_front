import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { Button, Checkbox, Col, DatePicker, Form, InputNumber, List, Radio, Row, Select, Slider, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { orderBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { updateAssistant } from '../../config/reducers/assistantSlice';
import { numberOfBusinessDays } from '../../helpers';
import { IScheduleResponse, Schedule } from '../../models/schedule.model';
import { useGetByUserQuery } from '../../services/demands.service';
import { useGetUsersQuery } from '../../services/user.service';
import { createSchedule } from './schedule';

dayjs.extend(relativeTime);

interface AssistantValues {
  coding_activity: boolean;
  coding_finish: number;
  coding_range: [number, number];
  coding_start: number;
  datetime?: Dayjs;
  designing_activity: boolean;
  designing_finish: number;
  designing_range: [number, number];
  designing_start: number;
  modeling_activity: boolean;
  modeling_finish: number;
  modeling_range: [number, number];
  modeling_start: number;
  scripting_activity: boolean;
  scripting_finish: number;
  scripting_range: [number, number];
  scripting_start: number;
  testing_activity: boolean;
  testing_finish: number;
  testing_range: [number, number];
  testing_start: number;
  ualab_activity: boolean;
  ualab_finish: number;
  ualab_range: [number, number];
  ualab_start: number;
  coding_developer?: number;
  designing_developer?: number;
  modeling_developer?: number;
  scripting_developer?: number;
  testing_developer?: number;
  ualab_developer?: number;
}

export interface AssistantEdit {
  datetime?: Dayjs;
  ualab_developer?: number;
  coding_developer?: number;
  testing_developer?: number;
  modeling_developer?: number;
  scripting_developer?: number;
  designing_developer?: number;
}

type AssistantResponse = {
  schedule: IScheduleResponse;
  skips: string[];
  developer: number;
  message: string;
};

export interface Result {
  ualab?: AssistantResponse;
  coding?: AssistantResponse;
  scripting?: AssistantResponse;
  modeling?: AssistantResponse;
  testing?: AssistantResponse;
  designing?: AssistantResponse;
}

interface AssistantProps {
  onFinish: (result: Result) => void;
  edit?: AssistantEdit;
  id?: number;
}

export function Assistant({ onFinish, edit, id }: AssistantProps) {
  const dispatch = useAppDispatch();
  const assistantSlice = useAppSelector((state) => state.assistant);
  const [daysCount, setDaysCount] = useState(assistantSlice.daysCount || 30);
  const [dateTime, setDateTime] = useState<Dayjs>();
  const [ualabDeveloper, setUalabDeveloper] = useState<number>();
  const [codingDeveloper, setCodingDeveloper] = useState<number>();
  const [testingDeveloper, setTestingDeveloper] = useState<number>();
  const [modelingDeveloper, setModelingDeveloper] = useState<number>();
  const [scriptingDeveloper, setScriptingDeveloper] = useState<number>();
  const [designingDeveloper, setDesigningDeveloper] = useState<number>();

  const [result, setResult] = useState<Result>({});

  const { data: ualabScheduleData } = useGetByUserQuery(ualabDeveloper || 0, { skip: !ualabDeveloper });
  const { data: codingScheduleData } = useGetByUserQuery(codingDeveloper || 0, { skip: !codingDeveloper });
  const { data: modelingScheduleData } = useGetByUserQuery(modelingDeveloper || 0, { skip: !modelingDeveloper });
  const { data: testingScheduleData } = useGetByUserQuery(testingDeveloper || 0, { skip: !testingDeveloper });
  const { data: scriptingScheduleData } = useGetByUserQuery(scriptingDeveloper || 0, { skip: !scriptingDeveloper });
  const { data: designingScheduleData } = useGetByUserQuery(designingDeveloper || 0, { skip: !designingDeveloper });
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();

  const [form] = Form.useForm<AssistantValues>();

  const users = useMemo(() => {
    if (usersData) {
      return orderBy(usersData, 'name').map((user) => ({
        value: user.id,
        label: user.name,
      }));
    }
    return [];
  }, [usersData]);

  const onRangeChange = useCallback(
    (newValue: [number, number], type: string) => {
      switch (type) {
        case 'ualab':
          form.setFieldsValue({
            ualab_start: newValue[0],
            ualab_finish: newValue[1],
          });
          break;
        case 'coding':
          form.setFieldsValue({
            coding_start: newValue[0],
            coding_finish: newValue[1],
          });
          break;
        case 'testing':
          form.setFieldsValue({
            testing_start: newValue[0],
            testing_finish: newValue[1],
          });
          break;
        case 'modeling':
          form.setFieldsValue({
            modeling_start: newValue[0],
            modeling_finish: newValue[1],
          });
          break;
        case 'scripting':
          form.setFieldsValue({
            scripting_start: newValue[0],
            scripting_finish: newValue[1],
          });
          break;
        case 'designing':
          form.setFieldsValue({
            designing_start: newValue[0],
            designing_finish: newValue[1],
          });
          break;

        default:
          break;
      }

      const values = form.getFieldsValue();

      dispatch(
        updateAssistant({
          coding_activity: values.coding_activity,
          modeling_activity: values.modeling_activity,
          scripting_activity: values.scripting_activity,
          testing_activity: values.testing_activity,
          ualab_activity: values.ualab_activity,
          designing_activity: values.designing_activity,
          finished_at: values.datetime?.toISOString(),
          coding_responsible: codingDeveloper,
          modeling_responsible: modelingDeveloper,
          scripting_responsible: scriptingDeveloper,
          testing_responsible: testingDeveloper,
          ualab_responsible: ualabDeveloper,
          designing_responsible: designingDeveloper,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          ualab_range: values.ualab_range,
          designing_range: values.designing_range,
          daysCount,
        }),
      );
    },
    [daysCount],
  );

  const initialValues: AssistantValues = {
    coding_activity: false,
    coding_finish: 10,
    coding_range: [0, 10],
    coding_start: 0,
    designing_activity: false,
    designing_finish: 10,
    designing_range: [0, 10],
    designing_start: 0,
    modeling_activity: false,
    modeling_finish: 10,
    modeling_range: [0, 10],
    modeling_start: 0,
    scripting_activity: false,
    scripting_finish: 10,
    scripting_range: [0, 10],
    scripting_start: 0,
    testing_activity: false,
    testing_finish: 10,
    testing_range: [0, 10],
    testing_start: 0,
    ualab_activity: false,
    ualab_finish: 10,
    ualab_range: [0, 10],
    ualab_start: 0,
  };

  const handleFinish = (values: AssistantValues) => {
    const initialResult: Result = {};
    if (dateTime && ualabDeveloper && ualabScheduleData) {
      const schedule = ualabScheduleData.map((u) => new Schedule(u).toJson());
      const rest = createSchedule(
        values.ualab_range,
        'Ualab',
        {
          dateTime,
          ualab_range: values.ualab_range,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          designing_range: values.designing_range,
        },
        schedule,
        id || 0,
        values.ualab_activity,
      );
      initialResult.ualab = {
        ...rest,
        developer: ualabDeveloper,
        message:
          numberOfBusinessDays(rest.schedule.startedAt.toDate(), rest.schedule.finishedAt.toDate())?.message || '',
      };
    }
    if (dateTime && codingDeveloper && codingScheduleData) {
      const schedule = codingScheduleData.map((c) => new Schedule(c).toJson());
      const rest = createSchedule(
        values.coding_range,
        'Coding',
        {
          dateTime,
          ualab_range: values.ualab_range,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          designing_range: values.designing_range,
        },
        schedule,
        id || 0,
        values.coding_activity,
      );
      initialResult.coding = {
        ...rest,
        developer: codingDeveloper,
        message:
          numberOfBusinessDays(rest.schedule.startedAt.toDate(), rest.schedule.finishedAt.toDate())?.message || '',
      };
    }
    if (dateTime && testingDeveloper && testingScheduleData) {
      const schedule = testingScheduleData.map((t) => new Schedule(t).toJson());
      const rest = createSchedule(
        values.testing_range,
        'Testing',
        {
          dateTime,
          ualab_range: values.ualab_range,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          designing_range: values.designing_range,
        },
        schedule,
        id || 0,
        values.testing_activity,
      );
      initialResult.testing = {
        ...rest,
        developer: testingDeveloper,
        message:
          numberOfBusinessDays(rest.schedule.startedAt.toDate(), rest.schedule.finishedAt.toDate())?.message || '',
      };
    }
    if (dateTime && scriptingDeveloper && scriptingScheduleData) {
      const schedule = scriptingScheduleData.map((s) => new Schedule(s).toJson());
      const rest = createSchedule(
        values.scripting_range,
        'Scripting',
        {
          dateTime,
          ualab_range: values.ualab_range,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          designing_range: values.designing_range,
        },
        schedule,
        id || 0,
        values.scripting_activity,
      );
      initialResult.scripting = {
        ...rest,
        developer: scriptingDeveloper,
        message:
          numberOfBusinessDays(rest.schedule.startedAt.toDate(), rest.schedule.finishedAt.toDate())?.message || '',
      };
    }
    if (dateTime && modelingDeveloper && modelingScheduleData) {
      const schedule = modelingScheduleData.map((m) => new Schedule(m).toJson());
      const rest = createSchedule(
        values.modeling_range,
        'Modeling',
        {
          dateTime,
          ualab_range: values.ualab_range,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          designing_range: values.designing_range,
        },
        schedule,
        id || 0,
        values.modeling_activity,
      );
      initialResult.modeling = {
        ...rest,
        developer: modelingDeveloper,
        message:
          numberOfBusinessDays(rest.schedule.startedAt.toDate(), rest.schedule.finishedAt.toDate())?.message || '',
      };
    }
    if (dateTime && designingDeveloper && designingScheduleData) {
      const schedule = designingScheduleData.map((m) => new Schedule(m).toJson());
      const rest = createSchedule(
        values.designing_range,
        'Designing',
        {
          dateTime,
          ualab_range: values.ualab_range,
          coding_range: values.coding_range,
          modeling_range: values.modeling_range,
          scripting_range: values.scripting_range,
          testing_range: values.testing_range,
          designing_range: values.designing_range,
        },
        schedule,
        id || 0,
        values.designing_activity,
      );
      initialResult.designing = {
        ...rest,
        developer: designingDeveloper,
        message:
          numberOfBusinessDays(rest.schedule.startedAt.toDate(), rest.schedule.finishedAt.toDate())?.message || '',
      };
    }

    dispatch(
      updateAssistant({
        coding_activity: values.coding_activity,
        modeling_activity: values.modeling_activity,
        scripting_activity: values.scripting_activity,
        testing_activity: values.testing_activity,
        ualab_activity: values.ualab_activity,
        designing_activity: values.designing_activity,
        finished_at: values.datetime?.toISOString(),
        coding_responsible: codingDeveloper,
        modeling_responsible: modelingDeveloper,
        scripting_responsible: scriptingDeveloper,
        testing_responsible: testingDeveloper,
        ualab_responsible: ualabDeveloper,
        designing_responsible: designingDeveloper,
        coding_range: values.coding_range,
        modeling_range: values.modeling_range,
        scripting_range: values.scripting_range,
        testing_range: values.testing_range,
        ualab_range: values.ualab_range,
        designing_range: values.designing_range,
        daysCount,
      }),
    );
    setResult(initialResult);
    onFinish(initialResult);
  };

  useEffect(() => {
    if (assistantSlice) {
      if (!edit) {
        form.setFieldsValue({
          coding_activity: assistantSlice.coding_activity,
          coding_developer: assistantSlice.coding_responsible,
          coding_finish: assistantSlice.coding_range ? assistantSlice.coding_range[1] : 0,
          coding_range: assistantSlice.coding_range,
          coding_start: assistantSlice.coding_range ? assistantSlice.coding_range[0] : 0,
          designing_activity: assistantSlice.designing_activity,
          designing_developer: assistantSlice.designing_responsible,
          designing_finish: assistantSlice.designing_range ? assistantSlice.designing_range[1] : 0,
          designing_range: assistantSlice.designing_range,
          designing_start: assistantSlice.designing_range ? assistantSlice.designing_range[0] : 0,
          modeling_activity: assistantSlice.modeling_activity,
          modeling_developer: assistantSlice.modeling_responsible,
          modeling_finish: assistantSlice.modeling_range ? assistantSlice.modeling_range[1] : 0,
          modeling_range: assistantSlice.modeling_range,
          modeling_start: assistantSlice.modeling_range ? assistantSlice.modeling_range[0] : 0,
          scripting_activity: assistantSlice.scripting_activity,
          scripting_developer: assistantSlice.scripting_responsible,
          scripting_finish: assistantSlice.scripting_range ? assistantSlice.scripting_range[1] : 0,
          scripting_range: assistantSlice.scripting_range,
          scripting_start: assistantSlice.scripting_range ? assistantSlice.scripting_range[0] : 0,
          testing_activity: assistantSlice.testing_activity,
          testing_developer: assistantSlice.testing_responsible,
          testing_finish: assistantSlice.testing_range ? assistantSlice.testing_range[1] : 0,
          testing_range: assistantSlice.testing_range,
          testing_start: assistantSlice.testing_range ? assistantSlice.testing_range[0] : 0,
          ualab_activity: assistantSlice.ualab_activity,
          ualab_developer: assistantSlice.ualab_responsible,
          ualab_finish: assistantSlice.ualab_range ? assistantSlice.ualab_range[1] : 0,
          ualab_range: assistantSlice.ualab_range,
          ualab_start: assistantSlice.ualab_range ? assistantSlice.ualab_range[0] : 0,
          datetime: assistantSlice.finished_at ? dayjs(assistantSlice.finished_at) : undefined,
        });
        if (assistantSlice.ualab_responsible) {
          setUalabDeveloper(assistantSlice.ualab_responsible);
        }
        if (assistantSlice.coding_responsible) {
          setCodingDeveloper(assistantSlice.coding_responsible);
        }
        if (assistantSlice.testing_responsible) {
          setTestingDeveloper(assistantSlice.testing_responsible);
        }
        if (assistantSlice.modeling_responsible) {
          setModelingDeveloper(assistantSlice.modeling_responsible);
        }
        if (assistantSlice.scripting_responsible) {
          setScriptingDeveloper(assistantSlice.scripting_responsible);
        }
        if (assistantSlice.designing_responsible) {
          setDesigningDeveloper(assistantSlice.designing_responsible);
        }
        if (assistantSlice.finished_at) {
          setDateTime(dayjs(assistantSlice.finished_at));
        }
      }
      if (edit) {
        setUalabDeveloper(edit.ualab_developer);
        setDesigningDeveloper(edit.designing_developer);
        setCodingDeveloper(edit.coding_developer);
        setTestingDeveloper(edit.testing_developer);
        setScriptingDeveloper(edit.scripting_developer);
        setModelingDeveloper(edit.modeling_developer);
        setDateTime(edit.datetime);

        form.setFieldsValue({
          coding_activity: assistantSlice.coding_activity,
          coding_finish: assistantSlice.coding_range ? assistantSlice.coding_range[1] : 0,
          coding_range: assistantSlice.coding_range,
          coding_start: assistantSlice.coding_range ? assistantSlice.coding_range[0] : 0,
          designing_activity: assistantSlice.designing_activity,
          designing_developer: edit.designing_developer,
          designing_finish: assistantSlice.designing_range ? assistantSlice.designing_range[1] : 0,
          designing_range: assistantSlice.designing_range,
          designing_start: assistantSlice.designing_range ? assistantSlice.designing_range[0] : 0,
          modeling_activity: assistantSlice.modeling_activity,
          modeling_developer: edit.modeling_developer,
          modeling_finish: assistantSlice.modeling_range ? assistantSlice.modeling_range[1] : 0,
          modeling_range: assistantSlice.modeling_range,
          modeling_start: assistantSlice.modeling_range ? assistantSlice.modeling_range[0] : 0,
          scripting_activity: assistantSlice.scripting_activity,
          scripting_developer: edit.scripting_developer,
          scripting_finish: assistantSlice.scripting_range ? assistantSlice.scripting_range[1] : 0,
          scripting_range: assistantSlice.scripting_range,
          scripting_start: assistantSlice.scripting_range ? assistantSlice.scripting_range[0] : 0,
          testing_activity: assistantSlice.testing_activity,
          testing_developer: edit.testing_developer,
          testing_finish: assistantSlice.testing_range ? assistantSlice.testing_range[1] : 0,
          testing_range: assistantSlice.testing_range,
          testing_start: assistantSlice.testing_range ? assistantSlice.testing_range[0] : 0,
          ualab_activity: assistantSlice.ualab_activity,
          ualab_developer: edit.ualab_developer,
          ualab_finish: assistantSlice.ualab_range ? assistantSlice.ualab_range[1] : 0,
          ualab_range: assistantSlice.ualab_range,
          ualab_start: assistantSlice.ualab_range ? assistantSlice.ualab_range[0] : 0,
          datetime: edit.datetime,
        });
      }
    }
  }, [assistantSlice, edit]);

  return (
    <Form layout="vertical" form={form} initialValues={initialValues} onFinish={handleFinish}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item
            name="datetime"
            label="Data de Finalização"
            rules={[
              {
                required: true,
                message: 'A data de finalização é obrigatória',
              },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY HH:mm"
              showTime={{ format: 'HH:mm' }}
              showToday
              onChange={(date) => {
                if (date) {
                  setDateTime(date);
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <br />
          <Button.Group>
            <Button
              icon={<MinusOutlined />}
              onClick={() => {
                const values = form.getFieldsValue();
                form.setFieldsValue({
                  ualab_start: values.ualab_start - 0.25,
                  coding_start: values.coding_start - 0.25,
                  testing_start: values.testing_start - 0.25,
                  modeling_start: values.modeling_start - 0.25,
                  scripting_start: values.scripting_start - 0.25,
                  designing_start: values.designing_start - 0.25,
                  ualab_range: [values.ualab_start - 0.25, values.ualab_range[1]],
                  coding_range: [values.coding_start - 0.25, values.coding_range[1]],
                  testing_range: [values.testing_start - 0.25, values.testing_range[1]],
                  modeling_range: [values.modeling_start - 0.25, values.modeling_range[1]],
                  scripting_range: [values.scripting_start - 0.25, values.scripting_range[1]],
                  designing_range: [values.designing_start - 0.25, values.designing_range[1]],
                });
              }}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                const values = form.getFieldsValue();
                form.setFieldsValue({
                  coding_range: [values.coding_start + 0.25, values.coding_range[1]],
                  coding_start: values.coding_start + 0.25,
                  modeling_range: [values.modeling_start + 0.25, values.modeling_range[1]],
                  modeling_start: values.modeling_start + 0.25,
                  scripting_range: [values.scripting_start + 0.25, values.scripting_range[1]],
                  scripting_start: values.scripting_start + 0.25,
                  testing_range: [values.testing_start + 0.25, values.testing_range[1]],
                  testing_start: values.testing_start + 0.25,
                  ualab_range: [values.ualab_start + 0.25, values.ualab_range[1]],
                  ualab_start: values.ualab_start + 0.25,
                  designing_range: [values.designing_start + 0.25, values.designing_range[1]],
                  designing_start: values.designing_start + 0.25,
                });
              }}
            />
          </Button.Group>
        </Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <br />
          <Radio.Group
            value={daysCount}
            onChange={(e) => {
              const values = form.getFieldsValue();
              const days = e.target.value as number;
              const updateValues = {
                ...assistantSlice,
                coding_range: [
                  values.coding_range[0],
                  days < values.coding_range[1] ? days : values.coding_range[1],
                ] as [number, number],
                modeling_range: [
                  values.modeling_range[0],
                  days < values.modeling_range[1] ? days : values.modeling_range[1],
                ] as [number, number],
                scripting_range: [
                  values.scripting_range[0],
                  days < values.scripting_range[1] ? days : values.scripting_range[1],
                ] as [number, number],
                testing_range: [
                  values.testing_range[0],
                  days < values.testing_range[1] ? days : values.testing_range[1],
                ] as [number, number],
                ualab_range: [values.ualab_range[0], days < values.ualab_range[1] ? days : values.ualab_range[1]] as [
                  number,
                  number,
                ],
                designing_range: [
                  values.designing_range[0],
                  days < values.designing_range[1] ? days : values.designing_range[1],
                ] as [number, number],
                daysCount: days,
              };
              form.setFieldsValue({
                coding_start: updateValues.coding_range[0],
                coding_finish: updateValues.coding_range[1],
                designing_start: updateValues.designing_range[0],
                designing_finish: updateValues.designing_range[1],
                ualab_start: updateValues.ualab_range[0],
                ualab_finish: updateValues.ualab_range[1],
                testing_start: updateValues.testing_range[0],
                testing_finish: updateValues.testing_range[1],
                scripting_start: updateValues.scripting_range[0],
                scripting_finish: updateValues.scripting_range[1],
                modeling_start: updateValues.modeling_range[0],
                modeling_finish: updateValues.modeling_range[1],
              });
              dispatch(updateAssistant(updateValues));
              setDaysCount(days);
            }}
          >
            <Radio.Button value={5}>5 dias</Radio.Button>
            <Radio.Button value={10}>10 dias</Radio.Button>
            <Radio.Button value={15}>15 dias</Radio.Button>
            <Radio.Button value={20}>20 dias</Radio.Button>
            <Radio.Button value={25}>25 dias</Radio.Button>
            <Radio.Button value={30}>30 dias</Radio.Button>
          </Radio.Group>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <br />
          <Button.Group>
            <Button
              icon={<MinusOutlined />}
              onClick={() => {
                const values = form.getFieldsValue();
                form.setFieldsValue({
                  coding_finish: values.coding_finish - 0.25,
                  coding_range: [values.coding_range[0], values.coding_finish - 0.25],
                  modeling_finish: values.modeling_finish - 0.25,
                  modeling_range: [values.modeling_range[0], values.modeling_finish - 0.25],
                  scripting_finish: values.scripting_finish - 0.25,
                  scripting_range: [values.scripting_range[0], values.scripting_finish - 0.25],
                  testing_finish: values.testing_finish - 0.25,
                  testing_range: [values.testing_range[0], values.testing_finish - 0.25],
                  ualab_finish: values.ualab_finish - 0.25,
                  ualab_range: [values.ualab_range[0], values.ualab_finish - 0.25],
                  designing_finish: values.designing_finish - 0.25,
                  designing_range: [values.designing_range[0], values.designing_finish - 0.25],
                });
              }}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                const values = form.getFieldsValue();
                form.setFieldsValue({
                  coding_finish: values.coding_finish + 0.25,
                  coding_range: [values.coding_range[0], values.coding_finish + 0.25],
                  modeling_finish: values.modeling_finish + 0.25,
                  modeling_range: [values.modeling_range[0], values.modeling_finish + 0.25],
                  scripting_finish: values.scripting_finish + 0.25,
                  scripting_range: [values.scripting_range[0], values.scripting_finish + 0.25],
                  testing_finish: values.testing_finish + 0.25,
                  testing_range: [values.testing_range[0], values.testing_finish + 0.25],
                  ualab_finish: values.ualab_finish + 0.25,
                  ualab_range: [values.ualab_range[0], values.ualab_finish + 0.25],
                  designing_finish: values.designing_finish + 0.25,
                  designing_range: [values.designing_range[0], values.designing_finish + 0.25],
                });
              }}
            />
          </Button.Group>
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item name="ualab_developer" label="Responsável" className="mb-0">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              disabled={usersLoading}
              onChange={setUalabDeveloper}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="ualab_start" label=" " className="mb-0" dependencies={['ualab_range']}>
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                if (e) {
                  const prev: [number, number] = form.getFieldValue('ualab_range');
                  form.setFieldValue('ualab_range', [e, prev[1]]);
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="ualab_range" label="Ualab" className="mb-0">
            <Slider range min={0} max={daysCount} step={0.25} onAfterChange={(e) => onRangeChange(e, 'ualab')} />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="ualab_finish" className="mb-0" label=" ">
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('ualab_range');
                form.setFieldValue('ualab_range', [prev[0], e]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="ualab_activity" valuePropName="checked">
            <Checkbox>Permitir atividades simultâneas</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item name="coding_developer" label="Responsável" className="mb-0">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              disabled={usersLoading}
              onChange={setCodingDeveloper}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="coding_start" label=" " className="mb-0" dependencies={['coding_range']}>
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('coding_range');
                form.setFieldValue('coding_range', [e, prev[1]]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="coding_range" className="mb-0" label="Programação">
            <Slider range min={0} max={daysCount} step={0.25} onAfterChange={(e) => onRangeChange(e, 'coding')} />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="coding_finish" className="mb-0" label=" ">
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('coding_range');
                form.setFieldValue('coding_range', [prev[0], e]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="coding_activity" valuePropName="checked">
            <Checkbox>Permitir atividades simultâneas</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item name="testing_developer" className="mb-0" label="Responsável">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              onChange={setTestingDeveloper}
              disabled={usersLoading}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="testing_start" className="mb-0" label=" " dependencies={['testing_range']}>
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('testing_range');
                form.setFieldValue('testing_range', [e, prev[1]]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="testing_range" className="mb-0" label="Testes">
            <Slider range min={0} max={daysCount} step={0.25} onAfterChange={(e) => onRangeChange(e, 'testing')} />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="testing_finish" className="mb-0" label=" ">
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('testing_range');
                form.setFieldValue('testing_range', [prev[0], e]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="testing_activity" valuePropName="checked">
            <Checkbox>Permitir atividades simultâneas</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item name="modeling_developer" className="mb-0" label="Responsável">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              onChange={setModelingDeveloper}
              disabled={usersLoading}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="modeling_start" className="mb-0" label=" " dependencies={['modeling_range']}>
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('modeling_range');
                form.setFieldValue('modeling_range', [e, prev[1]]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="modeling_range" className="mb-0" label="Modelagem">
            <Slider range min={0} max={daysCount} step={0.25} onAfterChange={(e) => onRangeChange(e, 'modeling')} />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="modeling_finish" className="mb-0" label=" ">
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('modeling_range');
                form.setFieldValue('modeling_range', [prev[0], e]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="modeling_activity" valuePropName="checked">
            <Checkbox>Permitir atividades simultâneas</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item name="scripting_developer" className="mb-0" label="Responsável">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              onChange={setScriptingDeveloper}
              disabled={usersLoading}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="scripting_start" className="mb-0" label=" " dependencies={['scripting_range']}>
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('scripting_range');
                form.setFieldValue('scripting_range', [e, prev[1]]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="scripting_range" className="mb-0" label="Roteirização">
            <Slider range min={0} max={daysCount} step={0.25} onAfterChange={(e) => onRangeChange(e, 'scripting')} />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="scripting_finish" className="mb-0" label=" ">
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('scripting_range');
                form.setFieldValue('scripting_range', [prev[0], e]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="scripting_activity" valuePropName="checked">
            <Checkbox>Permitir atividades simultâneas</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6}>
          <Form.Item name="designing_developer" className="mb-0" label="Responsável">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              onChange={setDesigningDeveloper}
              disabled={usersLoading}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="designing_start" className="mb-0" label=" " dependencies={['designing_range']}>
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('designing_range');
                form.setFieldValue('designing_range', [e, prev[1]]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="designing_range" className="mb-0" label="Design Gráfico">
            <Slider range min={0} max={daysCount} step={0.25} onAfterChange={(e) => onRangeChange(e, 'designing')} />
          </Form.Item>
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          <Form.Item name="designing_finish" className="mb-0" label=" ">
            <InputNumber
              min={0}
              max={daysCount}
              step={0.25}
              onChange={(e) => {
                const prev: [number, number] = form.getFieldValue('designing_range');
                form.setFieldValue('designing_range', [prev[0], e]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="designing_activity" valuePropName="checked">
            <Checkbox>Permitir atividades simultâneas</Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Space direction="vertical" style={{ width: '100%' }}>
        <List
          style={{ display: result.coding?.skips ? undefined : 'none' }}
          bordered
          size="small"
          dataSource={result.coding?.skips}
          renderItem={(item) => <List.Item key={nanoid()}>{item}</List.Item>}
        />
        <List
          style={{ display: result.modeling ? undefined : 'none' }}
          bordered
          size="small"
          dataSource={result.modeling?.skips}
          renderItem={(item) => <List.Item key={nanoid()}>{item}</List.Item>}
        />
        <List
          style={{ display: result.ualab?.skips ? undefined : 'none' }}
          bordered
          size="small"
          dataSource={result.ualab?.skips}
          renderItem={(item) => <List.Item key={nanoid()}>{item}</List.Item>}
        />
        <List
          style={{ display: result.scripting?.skips ? undefined : 'none' }}
          bordered
          size="small"
          dataSource={result.scripting?.skips}
          renderItem={(item) => <List.Item key={nanoid()}>{item}</List.Item>}
        />
        <List
          style={{ display: result.testing?.skips ? undefined : 'none' }}
          bordered
          size="small"
          dataSource={result.testing?.skips}
          renderItem={(item) => <List.Item key={nanoid()}>{item}</List.Item>}
        />
        <List
          style={{ display: result.designing?.skips ? undefined : 'none' }}
          bordered
          size="small"
          dataSource={result.designing?.skips}
          renderItem={(item) => <List.Item key={nanoid()}>{item}</List.Item>}
        />
      </Space>

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          Calcular
        </Button>
      </Form.Item>
    </Form>
  );
}

Assistant.defaultProps = {
  edit: undefined,
  id: undefined,
};
