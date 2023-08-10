/* eslint-disable no-param-reassign */
// noinspection JSIgnoredPromiseFromCall

import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
/* eslint-disable no-nested-ternary */
import { nanoid } from '@reduxjs/toolkit';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { FormInstance } from 'antd/es/form';
import { RcFile } from 'antd/es/upload';
import dayjs, { Dayjs } from 'dayjs';
import { capitalize, isNil, omitBy, orderBy } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Assistant, AssistantEdit, Result, ScrollArea } from '../../components';
import { Edit } from '../../components/crud/edit';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import {
  businessDaysAdd,
  businessDaysSubtract,
  handleError,
  handleLinkName,
  isBusinessDay,
  numberOfBusinessDays,
} from '../../helpers';
import { Demand, DemandUpdate, IFiles } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { useGetChecklistsQuery } from '../../services/checklist.service';
import {
  useGetDemandByIdQuery,
  useGetDemandsTagsQuery,
  useGetExperimentsQuery,
  useUpdateDemandMutation,
} from '../../services/demands.service';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { useDeleteDemandFileMutation } from '../../services/upload.service';
import { useGetUsersQuery } from '../../services/user.service';
import { tagRender } from '../Releases/tagRender';
import { Checklist, IChecklistParams, IChecklistSelectProps } from './Checklist';

interface InitialValues {
  coding?: number;
  coding_checklist_ids?: number[];
  coding_deadline?: number;
  coding_developers?: number;
  coding_finishedAt?: Dayjs;
  coding_message?: string;
  coding_startedAt?: Dayjs;
  creator?: string;
  designing?: number;
  designing_checklist_ids?: number[];
  designing_deadline?: number;
  designing_developers?: number;
  designing_finishedAt?: Dayjs;
  designing_message?: string;
  designing_startedAt?: Dayjs;
  experiment_id: number;
  finished_at?: Dayjs;
  institution_id: number;
  modeling?: number;
  modeling_checklist_ids?: number[];
  modeling_deadline?: number;
  modeling_developers?: number;
  modeling_finishedAt?: Dayjs;
  modeling_message?: string;
  modeling_startedAt?: Dayjs;
  scripting?: number;
  scripting_checklist_ids?: number[];
  scripting_deadline?: number;
  scripting_developers?: number;
  scripting_finishedAt?: Dayjs;
  scripting_message?: string;
  scripting_startedAt?: Dayjs;
  started_at?: Dayjs;
  status: DemandStatus;
  tags?: string[];
  testing?: number;
  testing_checklist_ids?: number[];
  testing_deadline?: number;
  testing_developers?: number;
  testing_finishedAt?: Dayjs;
  testing_message?: string;
  testing_startedAt?: Dayjs;
  ualab?: number;
  ualab_checklist_ids?: number[];
  ualab_deadline?: number;
  ualab_developers?: number;
  ualab_finishedAt?: Dayjs;
  ualab_message?: string;
  ualab_startedAt?: Dayjs;
}

type DepartmentSelectOption = 'scripting' | 'modeling' | 'coding' | 'testing' | 'ualab' | 'designing';

interface ISelect<T> {
  coding?: T;
  modeling?: T;
  ualab?: T;
  testing?: T;
  scripting?: T;
  designing?: T;
}

const { Panel } = Collapse;

interface CalculateTeamProps {
  formInstante: FormInstance;
  team: DepartmentSelectOption;
}

function CalculateTeam({ formInstante, team }: CalculateTeamProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const [time, setTime] = useState<number | null>(1);
  const [control, setControl] = useState<'add' | 'minus'>('add');

  const handleCalculateTeam = () => {
    const values = formInstante.getFieldsValue();
    const startedAt = values[`${team}_startedAt`];
    const finishedAt = values[`${team}_finishedAt`];

    if (time && startedAt && finishedAt) {
      const start = control === 'add' ? businessDaysAdd(startedAt, time) : businessDaysSubtract(startedAt, time);
      const finish = control === 'add' ? businessDaysAdd(finishedAt, time) : businessDaysSubtract(finishedAt, time);

      formInstante.setFieldsValue({
        [`${team}_finishedAt`]: finish,
        [`${team}_startedAt`]: start,
      });
    }
  };

  if (!currentUser?.role.super_admin) {
    return null;
  }
  return (
    <Space>
      <Select
        className="w-32"
        options={[
          { label: 'Adiar', value: 'add' },
          { label: 'Antecipar', value: 'minus' },
        ]}
        value={control}
        onChange={setControl}
      />
      <InputNumber min={1} className="w-40" value={time} onChange={setTime} addonAfter="Dias Úteis" />

      <Button type="primary" onClick={handleCalculateTeam}>
        Aplicar
      </Button>
    </Space>
  );
}

export function EditDemandPage() {
  const params = useParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  const currentUser = useAppSelector(selectCurrentUser);
  const [codingAlert, setCodingAlert] = useState(false);
  const [ualabAlert, setUalabAlert] = useState(false);
  const [scriptingAlert, setScriptingAlert] = useState(false);
  const [modelingAlert, setModelingAlert] = useState(false);
  const [testingAlert, setTestingAlert] = useState(false);
  const [designAlert, setDesignAlert] = useState(false);
  const [startedAt, setStartedAt] = useState<ISelect<Dayjs>>();
  const [finishedAt, setFinishedAt] = useState<ISelect<Dayjs>>();
  const [checklist, setChecklist] = useState<ISelect<IChecklistSelectProps>>();
  const [percentage, setPercentage] = useState<ISelect<number>>();
  const [files, setFiles] = useState<ISelect<IFiles[]>>();
  const [fileList, setFileList] = useState<ISelect<UploadFile<RcFile>[]>>({});
  const [codingTabKey, setCodingTabKey] = useState('data');
  const [testingTabKey, setTestingTabKey] = useState('data');
  const [ualabTabKey, setUalabTabKey] = useState('data');
  const [designTabKey, setDesignTabKey] = useState('data');
  const [scriptingTabKey, setScriptingTabKey] = useState('data');
  const [modelingTabKey, setModelingTabKey] = useState('data');
  const [calculate, setCalculate] = useState<{
    time: number;
    control: 'add' | 'minus';
  }>({ time: 1, control: 'add' });

  const [assistant, setAssistant] = useState<AssistantEdit>();
  const [result, setResult] = useState<Result>();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<DepartmentSelectOption>('coding');

  const handleAlert = (value: string) => {
    switch (value) {
      case 'coding':
        setCodingAlert(true);
        break;
      case 'ualab':
        setUalabAlert(true);
        break;
      case 'scripting':
        setScriptingAlert(true);
        break;
      case 'modeling':
        setModelingAlert(true);
        break;
      case 'testing':
        setTestingAlert(true);
        break;
      case 'designing':
        setDesignAlert(true);
        break;
      default:
        break;
    }
  };

  const {
    data: demandData,
    isLoading,
    refetch: demandByIdRefetch,
  } = useGetDemandByIdQuery(id, {
    skip: id === 0,
  });
  const [toast, contextHolder] = message.useMessage();

  const {
    data: institutions,
    isLoading: institutionsLoading,
    refetch: institutionRefetch,
  } = useGetInstitutionsQuery(undefined, {
    skip: !currentUser?.role.admin,
  });
  const { data: experiments, isLoading: experimentsLoading, refetch: experimentRefetch } = useGetExperimentsQuery();
  const { data: usersData, isLoading: usersLoading, refetch: usersRefetch } = useGetUsersQuery();
  const { data: tagsData, isLoading: tagsLoading, refetch: demandsRefetch } = useGetDemandsTagsQuery();
  const { data: checklistsData, refetch: checklistRefetch } = useGetChecklistsQuery();
  const [deleteFile] = useDeleteDemandFileMutation();

  const refetch = () => {
    institutionRefetch();
    experimentRefetch();
    usersRefetch();
    demandsRefetch();
    checklistRefetch();
    demandByIdRefetch();
  };

  const checklists = useMemo(() => checklistsData || [], [checklistsData]);

  const [
    updateDemand,
    {
      isLoading: isUpdateDemandLoading,
      isSuccess: isUpdateDemandSuccess,
      isError: isUpdateDemandError,
      error: updateDemandError,
    },
  ] = useUpdateDemandMutation();

  const initialValues: InitialValues = {
    coding: 0,
    coding_checklist_ids: [],
    coding_deadline: 0,
    coding_developers: undefined,
    coding_finishedAt: finishedAt?.coding,
    coding_message: '',
    coding_startedAt: startedAt?.coding,
    designing: 0,
    designing_checklist_ids: [],
    designing_deadline: 0,
    designing_developers: undefined,
    designing_finishedAt: finishedAt?.designing,
    designing_message: '',
    designing_startedAt: startedAt?.designing,
    experiment_id: 0,
    institution_id: 0,
    modeling: 0,
    modeling_checklist_ids: [],
    modeling_deadline: 0,
    modeling_developers: undefined,
    modeling_finishedAt: finishedAt?.modeling,
    modeling_message: '',
    modeling_startedAt: startedAt?.modeling,
    scripting: 0,
    scripting_checklist_ids: [],
    scripting_deadline: 0,
    scripting_developers: undefined,
    scripting_finishedAt: finishedAt?.scripting,
    scripting_message: '',
    scripting_startedAt: startedAt?.scripting,
    status: DemandStatus.READY,
    tags: [],
    testing: 0,
    testing_checklist_ids: [],
    testing_deadline: 0,
    testing_developers: undefined,
    testing_finishedAt: finishedAt?.testing,
    testing_message: '',
    testing_startedAt: startedAt?.testing,
    ualab: 0,
    ualab_checklist_ids: [],
    ualab_deadline: 0,
    ualab_developers: undefined,
    ualab_finishedAt: finishedAt?.ualab,
    ualab_message: '',
    ualab_startedAt: startedAt?.ualab,
  };

  const [form] = Form.useForm<InitialValues>();
  const [calculateForm] = Form.useForm<{
    time: number;
    control: 'add' | 'minus';
  }>();

  const isLeader = useMemo(() => (currentUser ? currentUser.role.demands_leader : false), [currentUser]);
  const isAdmin = useMemo(() => (currentUser ? currentUser.role.demands_admin : false), [currentUser]);
  const isSuperAdmin = useMemo(() => (currentUser ? currentUser.role.super_admin : false), [currentUser]);

  const hadPermission = useCallback(
    (type: DepartmentSelectOption) => {
      if (isSuperAdmin) {
        return true;
      }
      if (isLeader) {
        return !!(currentUser && currentUser.department.name.toLowerCase() === type);
      }

      return isAdmin;
    },
    [currentUser, isAdmin, isLeader, isSuperAdmin],
  );

  const isDeveloper = useCallback(
    (field: string) => {
      const formValues: InitialValues = form.getFieldsValue();
      const responsible = formValues[field as keyof InitialValues] as number;

      if (currentUser) {
        if (Array.isArray(responsible)) {
          return responsible.includes(currentUser.id);
        }
        return responsible === currentUser.id;
      }
      return false;
    },
    [form, currentUser],
  );

  const verifyPermissions = (type: DepartmentSelectOption) => {
    if (!hadPermission(type) && !isDeveloper(`${type}_developers`)) {
      return true;
    }
    if (hadPermission(type) && isDeveloper(`${type}_developers`)) {
      return false;
    }
    if (!hadPermission(type) && isDeveloper(`${type}_developers`)) {
      return false;
    }
    return !(hadPermission(type) && !isDeveloper(`${type}_developers`));
  };

  const onFinish = (values: InitialValues) => {
    setCodingTabKey('data');
    setScriptingTabKey('data');
    setUalabTabKey('data');
    setModelingTabKey('data');
    setTestingTabKey('data');
    setDesignTabKey('data');

    if (demandData) {
      const demand = new Demand(demandData).toUpdate();
      const formData = new FormData();

      const update: DemandUpdate = {
        id,
        logger_id: currentUser?.id || 0,
        tags: isAdmin || isLeader ? values.tags : undefined,
        coding_developers: hadPermission('coding')
          ? values.coding_developers
            ? [values.coding_developers]
            : []
          : undefined,
        coding_finishedAt: hadPermission('coding')
          ? values.coding_finishedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        coding_deadline: hadPermission('coding')
          ? numberOfBusinessDays(values.coding_startedAt?.toDate(), values.coding_finishedAt?.toDate())?.hours
          : undefined,
        coding_startedAt: hadPermission('coding')
          ? values.coding_startedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        modeling_developers: hadPermission('modeling')
          ? values.modeling_developers
            ? [values.modeling_developers]
            : []
          : undefined,
        modeling_finishedAt: hadPermission('modeling')
          ? values.modeling_finishedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        modeling_startedAt: hadPermission('modeling')
          ? values.modeling_startedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        modeling_deadline: hadPermission('modeling')
          ? numberOfBusinessDays(values.modeling_startedAt?.toDate(), values.modeling_finishedAt?.toDate())?.hours
          : undefined,
        scripting_developers: hadPermission('scripting')
          ? values.scripting_developers
            ? [values.scripting_developers]
            : []
          : undefined,
        scripting_finishedAt: hadPermission('scripting')
          ? values.scripting_finishedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        scripting_startedAt: hadPermission('scripting')
          ? values.scripting_startedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        scripting_deadline: hadPermission('scripting')
          ? numberOfBusinessDays(values.scripting_startedAt?.toDate(), values.scripting_finishedAt?.toDate())?.hours
          : undefined,
        testing_developers: hadPermission('testing')
          ? values.testing_developers
            ? [values.testing_developers]
            : []
          : undefined,
        testing_finishedAt: hadPermission('testing')
          ? values.testing_finishedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        testing_startedAt: hadPermission('testing')
          ? values.testing_startedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        testing_deadline: hadPermission('testing')
          ? numberOfBusinessDays(values.testing_startedAt?.toDate(), values.testing_finishedAt?.toDate())?.hours
          : undefined,
        ualab_developers: hadPermission('ualab')
          ? values.ualab_developers
            ? [values.ualab_developers]
            : []
          : undefined,
        ualab_finishedAt: hadPermission('ualab')
          ? values.ualab_finishedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        ualab_startedAt: hadPermission('ualab')
          ? values.ualab_startedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        ualab_deadline: hadPermission('ualab')
          ? numberOfBusinessDays(values.ualab_startedAt?.toDate(), values.ualab_finishedAt?.toDate())?.hours
          : undefined,
        designing_developers: hadPermission('designing')
          ? values.designing_developers
            ? [values.designing_developers]
            : []
          : undefined,
        designing_finishedAt: hadPermission('designing')
          ? values.designing_finishedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        designing_startedAt: hadPermission('designing')
          ? values.designing_startedAt?.set('seconds', 0).set('milliseconds', 0).toISOString()
          : undefined,
        designing_deadline: hadPermission('designing')
          ? numberOfBusinessDays(values.designing_startedAt?.toDate(), values.designing_finishedAt?.toDate())?.hours
          : undefined,
        experiment_id: values.experiment_id,
        institution_id: values.institution_id,
        status: isAdmin || isLeader ? values.status : undefined,
        coding_checklist_id: !verifyPermissions('coding')
          ? demand.coding_checklist?.id !== checklist?.coding?.id
            ? checklist?.coding?.id
            : undefined
          : undefined,
        coding_checklist: !verifyPermissions('coding')
          ? checklist?.coding
            ? {
                id: checklist.coding.id || 0,
                name: checklist.coding.name,
                parameters: checklist.coding.params?.map((c, i) => ({
                  name: c.name,
                  percentage: c.percentage,
                  order: i + 1,
                  checked: values.coding_checklist_ids?.includes(c.key) || false,
                })),
              }
            : undefined
          : undefined,
        ualab_checklist_id: !verifyPermissions('ualab')
          ? demand.ualab_checklist?.id !== checklist?.ualab?.id
            ? checklist?.ualab?.id
            : undefined
          : undefined,
        ualab_checklist: !verifyPermissions('ualab')
          ? checklist?.ualab
            ? {
                id: checklist.ualab.id || 0,
                name: checklist.ualab.name,
                parameters: checklist.ualab.params?.map((c, i) => ({
                  name: c.name,
                  percentage: c.percentage,
                  order: i + 1,
                  checked: values.ualab_checklist_ids?.includes(c.key) || false,
                })),
              }
            : undefined
          : undefined,
        testing_checklist_id: !verifyPermissions('testing')
          ? demand.testing_checklist?.id !== checklist?.testing?.id
            ? checklist?.testing?.id
            : undefined
          : undefined,
        testing_checklist: !verifyPermissions('testing')
          ? checklist?.testing
            ? {
                id: checklist.testing.id || 0,
                name: checklist.testing.name,
                parameters: checklist.testing.params?.map((c, i) => ({
                  name: c.name,
                  percentage: c.percentage,
                  order: i + 1,
                  checked: values.testing_checklist_ids?.includes(c.key) || false,
                })),
              }
            : undefined
          : undefined,
        scripting_checklist_id: !verifyPermissions('scripting')
          ? demand.scripting_checklist?.id !== checklist?.scripting?.id
            ? checklist?.scripting?.id
            : undefined
          : undefined,
        scripting_checklist: !verifyPermissions('scripting')
          ? checklist?.scripting
            ? {
                id: checklist.scripting.id || 0,
                name: checklist.scripting.name,
                parameters: checklist.scripting.params?.map((c, i) => ({
                  name: c.name,
                  percentage: c.percentage,
                  order: i + 1,
                  checked: values.scripting_checklist_ids?.includes(c.key) || false,
                })),
              }
            : undefined
          : undefined,
        designing_checklist_id: !verifyPermissions('designing')
          ? demand.designing_checklist?.id !== checklist?.designing?.id
            ? checklist?.designing?.id
            : undefined
          : undefined,
        designing_checklist: !verifyPermissions('designing')
          ? checklist?.designing
            ? {
                id: checklist.designing.id || 0,
                name: checklist.designing.name,
                parameters: checklist.designing.params?.map((c, i) => ({
                  name: c.name,
                  percentage: c.percentage,
                  order: i + 1,
                  checked: values.designing_checklist_ids?.includes(c.key) || false,
                })),
              }
            : undefined
          : undefined,
        modeling_checklist_id: !verifyPermissions('modeling')
          ? demand.modeling_checklist?.id !== checklist?.modeling?.id
            ? checklist?.modeling?.id
            : undefined
          : undefined,
        modeling_checklist: !verifyPermissions('modeling')
          ? checklist?.modeling
            ? {
                id: checklist.modeling.id || 0,
                name: checklist.modeling.name,
                parameters: checklist.modeling.params?.map((c, i) => ({
                  name: c.name,
                  percentage: c.percentage,
                  order: i + 1,
                  checked: values.modeling_checklist_ids?.includes(c.key) || false,
                })),
              }
            : undefined
          : undefined,
      };

      fileList.coding?.forEach((file) => {
        formData.append('coding_files[]', file as RcFile);
      });
      fileList.modeling?.forEach((file) => {
        formData.append('modeling_files[]', file as RcFile);
      });
      fileList.scripting?.forEach((file) => {
        formData.append('scripting_files[]', file as RcFile);
      });
      fileList.testing?.forEach((file) => {
        formData.append('testing_files[]', file as RcFile);
      });
      fileList.ualab?.forEach((file) => {
        formData.append('ualab_files[]', file as RcFile);
      });
      fileList.designing?.forEach((file) => {
        formData.append('designing_files[]', file as RcFile);
      });

      const result = omitBy<DemandUpdate>(update, isNil) as DemandUpdate;

      formData.append('data', JSON.stringify(result));
      updateDemand({ id, formData });
    }
  };

  const statusOptions = useMemo(
    () => [
      { value: DemandStatus.DEVELOPMENT, label: 'Desenvolvimento' },
      { value: DemandStatus.CORRECTION, label: 'Correção' },
      { value: DemandStatus.READY, label: 'Pronto' },
      { value: DemandStatus.REVALIDATION, label: 'Revalidação' },
      { value: DemandStatus.VALIDATION, label: 'Validação' },
    ],
    [DemandStatus],
  );

  const institutionOptions = useMemo(
    () =>
      institutions
        ? orderBy(institutions, 'name').map((institution) => ({
            value: institution.id,
            label: institution.name,
          }))
        : [],
    [institutions],
  );

  const experimentOptions = useMemo(
    () =>
      experiments
        ? orderBy(experiments, 'name').map((experiment) => ({
            value: experiment.id,
            label: `${experiment.id} - ${experiment.name}`,
          }))
        : [],
    [experiments],
  );

  const tagsOptions = useMemo(
    () =>
      tagsData
        ? orderBy(tagsData, 'name').map((tag) => ({
            value: tag.name,
            label: tag.name,
          }))
        : [],
    [tagsData],
  );

  const tabList = [
    {
      key: 'data',
      tab: 'Dados',
    },
    {
      key: 'documents',
      tab: 'Documentos',
    },
  ];

  const users = useMemo(() => {
    if (usersData) {
      return orderBy(usersData, 'name').map((user) => ({
        value: user.id,
        label: user.name,
      }));
    }
    return [];
  }, [usersData]);

  const handlePercent = (
    team: DepartmentSelectOption,
    ids: CheckboxValueType[],
    params: IChecklistParams[] | undefined,
  ) => {
    let totalWeight = 0;

    let checkedWeight = 0;

    if (params && params.length > 0) {
      params.forEach((param) => {
        if (ids && ids.length > 0 && ids.includes(param.key)) {
          checkedWeight += param.percentage;
        }
        totalWeight += param.percentage;
      });
    }
    setPercentage((prev) => ({ ...prev, [team]: Math.floor((checkedWeight / totalWeight) * 100) }));
  };

  const choseAlert = (team: DepartmentSelectOption) => {
    switch (team) {
      case 'coding':
        return codingAlert;
      case 'modeling':
        return modelingAlert;
      case 'scripting':
        return scriptingAlert;
      case 'testing':
        return testingAlert;
      case 'ualab':
        return ualabAlert;
      case 'designing':
        return designAlert;

      default:
        return false;
    }
  };

  const confirm = (id: number) => {
    deleteFile(id)
      .unwrap()
      .then(() => message.success('Arquivo deletado com sucesso'))
      .catch(() => message.error('Erro ao deletar arquivo'));
  };

  const contentList = (team: DepartmentSelectOption, key: string) => ({
    data: (
      <Row gutter={16} style={{ display: key === 'documents' ? 'none' : undefined }}>
        <Col span={16}>
          <Form.Item name={`${team}_developers`} label="Responsável">
            <Select
              placeholder="Selecione um responsável"
              allowClear
              showSearch
              disabled={usersLoading || !hadPermission(team)}
              options={users}
              optionFilterProp="label"
            />
          </Form.Item>
          <Space>
            <Form.Item name={`${team}_startedAt`} label="Data Inicial">
              <DatePicker
                disabledDate={(date) => !isBusinessDay(date)}
                disabled={!hadPermission(team)}
                format="DD/MM/YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
                onChange={(date) => {
                  if (date) {
                    setStartedAt((prev) => ({ ...prev, [team]: date }));
                    handleAlert(team);
                  }
                }}
              />
            </Form.Item>

            <Form.Item name={`${team}_finishedAt`} label="Data Final">
              <DatePicker
                disabledDate={(date) => !isBusinessDay(date)}
                onChange={(date) => {
                  if (date) {
                    setFinishedAt((prev) => ({ ...prev, [team]: date }));
                  }
                }}
                disabled={!hadPermission(team)}
                format="DD/MM/YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
              />
            </Form.Item>
          </Space>
          <Form.Item name={`${team}_message`} label="Tempo Total (Dias úteis)">
            <Input style={{ width: '100%' }} readOnly disabled={!hadPermission(team)} />
          </Form.Item>

          <Alert
            showIcon
            style={{ display: choseAlert(team) ? undefined : 'none' }}
            type="warning"
            message="Cuidado. Alterar a Data de Início da entrega resultará na perca de todo o histórico armazenado anteriormente!"
          />
        </Col>
        <Col span={8}>
          <Card style={{ height: '100%' }}>
            <Button
              disabled={verifyPermissions(team)}
              block
              type="dashed"
              onClick={() => {
                setType(team);
                setOpen(true);
              }}
            >
              Alterar lista de tarefas
            </Button>
            <Progress percent={percentage?.[team]} />
            <ScrollArea height={200}>
              <Space align="center" direction="vertical" style={{ width: '100%' }}>
                <Typography.Text strong>{checklist?.[team]?.name}</Typography.Text>
              </Space>

              <Form.Item name={`${team}_checklist_ids`}>
                <Checkbox.Group
                  disabled={verifyPermissions(team)}
                  style={{ width: '100%' }}
                  onChange={(e) => handlePercent(team, e, checklist?.[team]?.params)}
                >
                  <Row>
                    {checklist?.[team]?.params?.map((cod) => (
                      <Col span={24} key={cod.key}>
                        <Checkbox value={cod.key}>
                          <Typography.Text>
                            {cod.name} - {cod.percentage}
                          </Typography.Text>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </ScrollArea>
          </Card>
        </Col>
      </Row>
    ),
    documents: (
      <Row gutter={16} style={{ display: key === 'data' ? 'none' : undefined }}>
        <Col span={12}>
          <Card>
            <ScrollArea>
              <div className="mr-4">
                <Upload
                  fileList={fileList[team]}
                  onRemove={(file) => {
                    const teamFiles = fileList[team];

                    if (teamFiles) {
                      const index = teamFiles.indexOf(file);
                      const newFileList = teamFiles.slice();
                      newFileList.splice(index, 1);
                      setFileList((prev) => ({ ...prev, [team]: newFileList }));
                    }
                  }}
                  beforeUpload={(file) => {
                    setFileList((prev) => {
                      const files = prev[team] || [];
                      files.push(file);
                      return { ...prev, [team]: files };
                    });
                    return false;
                  }}
                  accept={[
                    'image/bmp',
                    'image/gif',
                    'image/jpeg',
                    'image/png',
                    'image/svg+xml',
                    'image/tiff',
                    'text/plain',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.ms-excel',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.oasis.opendocument.text',
                    'application/vnd.oasis.opendocument.spreadsheet',
                    'application/vnd.oasis.opendocument.presentations',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                  ].join(', ')}
                  showUploadList
                >
                  <div className="w-40">
                    <Button block type="dashed" icon={<UploadOutlined />}>
                      Carregar
                    </Button>
                  </div>
                </Upload>
              </div>
            </ScrollArea>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ScrollArea>
              <List
                dataSource={files?.[team]}
                renderItem={(item) => (
                  <List.Item
                    key={nanoid()}
                    actions={[
                      <Popconfirm title="Tem certeza?" onConfirm={() => confirm(item.id)} okText="Sim" cancelText="Não">
                        <Button danger type="primary" icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Typography.Link href={item.link}>{handleLinkName(item.name)}</Typography.Link>}
                      description={`${item.user.name} - ${moment(item.updated_at).calendar()}`}
                    />
                  </List.Item>
                )}
              />
            </ScrollArea>
          </Card>
        </Col>
      </Row>
    ),
  });

  useEffect(() => {
    form.setFieldsValue({
      coding_message: numberOfBusinessDays(startedAt?.coding?.toDate(), finishedAt?.coding?.toDate())?.message,
      ualab_message: numberOfBusinessDays(startedAt?.ualab?.toDate(), finishedAt?.ualab?.toDate())?.message,
      testing_message: numberOfBusinessDays(startedAt?.testing?.toDate(), finishedAt?.testing?.toDate())?.message,
      scripting_message: numberOfBusinessDays(startedAt?.scripting?.toDate(), finishedAt?.scripting?.toDate())?.message,
      modeling_message: numberOfBusinessDays(startedAt?.modeling?.toDate(), finishedAt?.modeling?.toDate())?.message,
      designing_message: numberOfBusinessDays(startedAt?.designing?.toDate(), finishedAt?.designing?.toDate())?.message,
    });
  }, [startedAt, finishedAt]);

  useEffect(() => {
    if (result) {
      if (result.coding) {
        form.setFieldsValue({
          coding_developers: result.coding.developer,
          coding_message: result.coding.message,
          coding_startedAt: result.coding.schedule.startedAt,
          coding_finishedAt: result.coding.schedule.finishedAt,
        });
      }
      if (result.modeling) {
        form.setFieldsValue({
          modeling_developers: result.modeling.developer,
          modeling_message: result.modeling.message,
          modeling_startedAt: result.modeling.schedule.startedAt,
          modeling_finishedAt: result.modeling.schedule.finishedAt,
        });
      }
      if (result.scripting) {
        form.setFieldsValue({
          scripting_developers: result.scripting.developer,
          scripting_message: result.scripting.message,
          scripting_startedAt: result.scripting.schedule.startedAt,
          scripting_finishedAt: result.scripting.schedule.finishedAt,
        });
      }
      if (result.testing) {
        form.setFieldsValue({
          testing_developers: result.testing.developer,
          testing_message: result.testing.message,
          testing_startedAt: result.testing.schedule.startedAt,
          testing_finishedAt: result.testing.schedule.finishedAt,
        });
      }
      if (result.ualab) {
        form.setFieldsValue({
          ualab_developers: result.ualab.developer,
          ualab_message: result.ualab.message,
          ualab_startedAt: result.ualab.schedule.startedAt,
          ualab_finishedAt: result.ualab.schedule.finishedAt,
        });
      }
      if (result.designing) {
        form.setFieldsValue({
          designing_developers: result.designing.developer,
          designing_message: result.designing.message,
          designing_startedAt: result.designing.schedule.startedAt,
          designing_finishedAt: result.designing.schedule.finishedAt,
        });
      }
    }
  }, [result]);

  useEffect(() => {
    if (demandData && currentUser && id !== 0) {
      const valueForChecklist: ISelect<IChecklistSelectProps> = {};

      const demand = new Demand(demandData).toUpdate();

      if (demand.coding_startedAt) {
        setStartedAt((prev) => ({ ...prev, coding: demand.coding_startedAt }));
      }
      if (demand.coding_finishedAt) {
        setFinishedAt((prev) => ({ ...prev, coding: demand.coding_finishedAt }));
      }
      if (demand.ualab_startedAt) {
        setStartedAt((prev) => ({ ...prev, ualab: demand.ualab_startedAt }));
      }
      if (demand.ualab_finishedAt) {
        setFinishedAt((prev) => ({ ...prev, ualab: demand.ualab_finishedAt }));
      }
      if (demand.testing_startedAt) {
        setStartedAt((prev) => ({ ...prev, testing: demand.testing_startedAt }));
      }
      if (demand.testing_finishedAt) {
        setFinishedAt((prev) => ({ ...prev, testing: demand.testing_finishedAt }));
      }
      if (demand.scripting_startedAt) {
        setStartedAt((prev) => ({ ...prev, scripting: demand.scripting_startedAt }));
      }
      if (demand.scripting_finishedAt) {
        setFinishedAt((prev) => ({ ...prev, scripting: demand.scripting_finishedAt }));
      }
      if (demand.modeling_startedAt) {
        setStartedAt((prev) => ({ ...prev, modeling: demand.modeling_startedAt }));
      }
      if (demand.modeling_finishedAt) {
        setFinishedAt((prev) => ({ ...prev, modeling: demand.modeling_finishedAt }));
      }
      if (demand.designing_startedAt) {
        setStartedAt((prev) => ({ ...prev, designing: demand.designing_startedAt }));
      }
      if (demand.designing_finishedAt) {
        setFinishedAt((prev) => ({ ...prev, designing: demand.designing_finishedAt }));
      }
      // Checklist dependencies
      if (demand.coding_checklist) {
        valueForChecklist.coding = {
          ...demand.coding_checklist,
          params: demand.coding_checklist?.demand_checklist_parameters.map((param) => ({
            checked: param.checked,
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        };
      } else {
        const defaultChecklist = checklists.find((checklist) =>
          checklist.departments.find((dep) => dep.name === capitalize('coding')),
        );
        if (defaultChecklist) {
          valueForChecklist.coding = {
            checked: false,
            id: defaultChecklist.id,
            name: defaultChecklist.name,
            params: defaultChecklist.checklist_parameters.map((param) => ({
              checked: Boolean(param.checked),
              key: param.id,
              name: param.name,
              percentage: param.percentage,
            })),
          };
        }
      }
      if (demand.testing_checklist) {
        valueForChecklist.testing = {
          ...demand.testing_checklist,
          params: demand.testing_checklist?.demand_checklist_parameters.map((param) => ({
            checked: param.checked,
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        };
      } else {
        const defaultChecklist = checklists.find((checklist) =>
          checklist.departments.find((dep) => dep.name === capitalize('testing')),
        );
        if (defaultChecklist) {
          valueForChecklist.testing = {
            checked: false,
            id: defaultChecklist.id,
            name: defaultChecklist.name,
            params: defaultChecklist.checklist_parameters.map((param) => ({
              checked: Boolean(param.checked),
              key: param.id,
              name: param.name,
              percentage: param.percentage,
            })),
          };
        }
      }
      if (demand.modeling_checklist) {
        valueForChecklist.modeling = {
          ...demand.modeling_checklist,
          params: demand.modeling_checklist?.demand_checklist_parameters.map((param) => ({
            checked: param.checked,
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        };
      } else {
        const defaultChecklist = checklists.find((checklist) =>
          checklist.departments.find((dep) => dep.name === capitalize('modeling')),
        );
        if (defaultChecklist) {
          valueForChecklist.modeling = {
            checked: false,
            id: defaultChecklist.id,
            name: defaultChecklist.name,
            params: defaultChecklist.checklist_parameters.map((param) => ({
              checked: Boolean(param.checked),
              key: param.id,
              name: param.name,
              percentage: param.percentage,
            })),
          };
        }
      }
      if (demand.scripting_checklist) {
        valueForChecklist.scripting = {
          ...demand.scripting_checklist,
          params: demand.scripting_checklist?.demand_checklist_parameters.map((param) => ({
            checked: param.checked,
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        };
      } else {
        const defaultChecklist = checklists.find((checklist) =>
          checklist.departments.find((dep) => dep.name === capitalize('scripting')),
        );
        if (defaultChecklist) {
          valueForChecklist.scripting = {
            checked: false,
            id: defaultChecklist.id,
            name: defaultChecklist.name,
            params: defaultChecklist.checklist_parameters.map((param) => ({
              checked: Boolean(param.checked),
              key: param.id,
              name: param.name,
              percentage: param.percentage,
            })),
          };
        }
      }
      if (demand.ualab_checklist) {
        valueForChecklist.ualab = {
          ...demand.ualab_checklist,
          params: demand.ualab_checklist?.demand_checklist_parameters.map((param) => ({
            checked: param.checked,
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        };
      } else {
        const defaultChecklist = checklists.find((checklist) =>
          checklist.departments.find((dep) => dep.name === capitalize('ualab')),
        );
        if (defaultChecklist) {
          valueForChecklist.ualab = {
            checked: false,
            id: defaultChecklist.id,
            name: defaultChecklist.name,
            params: defaultChecklist.checklist_parameters.map((param) => ({
              checked: Boolean(param.checked),
              key: param.id,
              name: param.name,
              percentage: param.percentage,
            })),
          };
        }
      }
      if (demand.designing_checklist) {
        valueForChecklist.designing = {
          ...demand.designing_checklist,
          params: demand.designing_checklist?.demand_checklist_parameters.map((param) => ({
            checked: param.checked,
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        };
      } else {
        const defaultChecklist = checklists.find((checklist) =>
          checklist.departments.find((dep) => dep.name === capitalize('designing')),
        );
        if (defaultChecklist) {
          valueForChecklist.designing = {
            checked: false,
            id: defaultChecklist.id,
            name: defaultChecklist.name,
            params: defaultChecklist.checklist_parameters.map((param) => ({
              checked: Boolean(param.checked),
              key: param.id,
              name: param.name,
              percentage: param.percentage,
            })),
          };
        }
      }

      if (demand.coding_files && demand.coding_files.length > 0) {
        setFiles((prev) => ({ ...prev, coding: demand.coding_files }));
      }
      if (demand.ualab_files && demand.ualab_files.length > 0) {
        setFiles((prev) => ({ ...prev, ualab: demand.ualab_files }));
      }
      if (demand.testing_files && demand.testing_files.length > 0) {
        setFiles((prev) => ({ ...prev, testing: demand.testing_files }));
      }
      if (demand.modeling_files && demand.modeling_files.length > 0) {
        setFiles((prev) => ({ ...prev, modeling: demand.modeling_files }));
      }
      if (demand.scripting_files && demand.scripting_files.length > 0) {
        setFiles((prev) => ({ ...prev, scripting: demand.scripting_files }));
      }
      if (demand.designing_files && demand.designing_files.length > 0) {
        setFiles((prev) => ({ ...prev, designing: demand.designing_files }));
      }

      setChecklist(valueForChecklist);

      const formValues = {
        experiment_id: demand.experiment_id,
        institution_id: demand.institution_id,
        coding: demand.coding,
        coding_checklist_ids: demand.coding_checklist?.demand_checklist_parameters
          .map((check) => (check.checked ? Number(check.id) : null))
          .filter((e) => e !== null) as number[],
        coding_deadline: demand.coding_deadline,
        coding_developers: demand.coding_developers?.map((dev) => dev.value)[0],
        coding_finishedAt: demand.coding_finishedAt,
        coding_startedAt: demand.coding_startedAt,
        modeling: demand.modeling,
        modeling_checklist_ids: demand.modeling_checklist?.demand_checklist_parameters
          .map((check) => (check.checked ? Number(check.id) : null))
          .filter((e) => e !== null) as number[],
        modeling_deadline: demand.modeling_deadline,
        modeling_developers: demand.modeling_developers?.map((dev) => dev.value)[0],
        modeling_finishedAt: demand.modeling_finishedAt,
        modeling_startedAt: demand.modeling_startedAt,
        scripting: demand.scripting,
        scripting_checklist_ids: demand.scripting_checklist?.demand_checklist_parameters
          .map((check) => (check.checked ? Number(check.id) : null))
          .filter((e) => e !== null) as number[],
        scripting_deadline: demand.scripting_deadline,
        scripting_developers: demand.scripting_developers?.map((dev) => dev.value)[0],
        scripting_finishedAt: demand.scripting_finishedAt,
        scripting_startedAt: demand.scripting_startedAt,
        status: demand.status,
        tags: demand.demandTags?.map((tags) => tags.name),
        testing: demand.testing,
        testing_checklist_ids: demand.testing_checklist?.demand_checklist_parameters
          .map((check) => (check.checked ? Number(check.id) : null))
          .filter((e) => e !== null) as number[],
        testing_deadline: demand.testing_deadline,
        testing_developers: demand.testing_developers?.map((dev) => dev.value)[0],
        testing_finishedAt: demand.testing_finishedAt,
        testing_startedAt: demand.testing_startedAt,
        ualab: demand.ualab,
        ualab_checklist_ids: demand.ualab_checklist?.demand_checklist_parameters
          .map((check) => (check.checked ? Number(check.id) : null))
          .filter((e) => e !== null) as number[],
        ualab_deadline: demand.ualab_deadline,
        ualab_developers: demand.ualab_developers?.map((dev) => dev.value)[0],
        ualab_finishedAt: demand.ualab_finishedAt,
        ualab_startedAt: demand.ualab_startedAt,
        designing: demand.designing,
        designing_checklist_ids: demand.designing_checklist?.demand_checklist_parameters
          .map((check) => (check.checked ? Number(check.id) : null))
          .filter((e) => e !== null) as number[],
        designing_deadline: demand.designing_deadline,
        designing_developers: demand.designing_developers?.map((dev) => dev.value)[0],
        designing_finishedAt: demand.designing_finishedAt,
        designing_startedAt: demand.designing_startedAt,
        creator: demandData?.creator?.name || '-',
        finished_at: dayjs(demandData?.finished_at),
        started_at: dayjs(
          Math.min(
            ...new Set<number>(
              [
                demand?.modeling_startedAt?.valueOf() || 0,
                demand?.coding_startedAt?.valueOf() || 0,
                demand?.scripting_startedAt?.valueOf() || 0,
                demand?.testing_startedAt?.valueOf() || 0,
                demand?.ualab_startedAt?.valueOf() || 0,
                demand?.designing_startedAt?.valueOf() || 0,
              ].filter((value) => value > 0),
            ),
          ),
        ),
      };

      handlePercent('coding', formValues.coding_checklist_ids, valueForChecklist.coding?.params);
      handlePercent('ualab', formValues.ualab_checklist_ids, valueForChecklist.ualab?.params);
      handlePercent('modeling', formValues.modeling_checklist_ids, valueForChecklist.modeling?.params);
      handlePercent('scripting', formValues.scripting_checklist_ids, valueForChecklist.scripting?.params);
      handlePercent('testing', formValues.testing_checklist_ids, valueForChecklist.testing?.params);
      handlePercent('designing', formValues.designing_checklist_ids, valueForChecklist.designing?.params);

      form.setFieldsValue(formValues);

      const datetime = Math.max(
        demand.modeling_finishedAt?.valueOf() || 0,
        demand.scripting_finishedAt?.valueOf() || 0,
        demand.coding_finishedAt?.valueOf() || 0,
        demand.ualab_finishedAt?.valueOf() || 0,
        demand.testing_finishedAt?.valueOf() || 0,
        demand.designing_finishedAt?.valueOf() || 0,
      );
      setAssistant({
        coding_developer:
          demand.coding_developers && demand.coding_developers.length > 0
            ? demand.coding_developers[0].value
            : undefined,
        datetime: dayjs(datetime),
        designing_developer:
          demand.designing_developers && demand.designing_developers.length > 0
            ? demand.designing_developers[0].value
            : undefined,
        modeling_developer:
          demand.modeling_developers && demand.modeling_developers.length > 0
            ? demand.modeling_developers[0].value
            : undefined,
        scripting_developer:
          demand.scripting_developers && demand.scripting_developers.length > 0
            ? demand.scripting_developers[0].value
            : undefined,
        testing_developer:
          demand.testing_developers && demand.testing_developers.length > 0
            ? demand.testing_developers[0].value
            : undefined,
        ualab_developer:
          demand.ualab_developers && demand.ualab_developers.length > 0 ? demand.ualab_developers[0].value : undefined,
      });
    }
  }, [demandData, currentUser, id, checklists]);

  useEffect(() => {
    if (isUpdateDemandSuccess) {
      setFileList({});
      toast.success('A demanda já foi atualizada');
    }
    if (isUpdateDemandError && updateDemandError) {
      if ('data' in updateDemandError) {
        const message = handleError(updateDemandError);
        toast.error(message);
      }
    }
  }, [isUpdateDemandSuccess, isUpdateDemandError, updateDemandError]);

  const handleCalculate = (team: DepartmentSelectOption) => {
    const values = form.getFieldsValue();
    const { time, control } = calculate;

    const startedAt = values[`${team}_startedAt`];
    const finishedAt = values[`${team}_finishedAt`];

    if (time && startedAt && finishedAt) {
      const start = control === 'add' ? businessDaysAdd(startedAt, time) : businessDaysSubtract(startedAt, time);
      const finish = control === 'add' ? businessDaysAdd(finishedAt, time) : businessDaysSubtract(finishedAt, time);

      return {
        start,
        finish,
      };
    }

    return null;
  };

  useEffect(() => {
    if (calculate) {
      const codingCalculate = handleCalculate('coding');
      const testingCalculate = handleCalculate('testing');
      const designingCalculate = handleCalculate('designing');
      const ualabCalculate = handleCalculate('ualab');
      const scriptingCalculate = handleCalculate('scripting');
      const modelingCalculate = handleCalculate('modeling');

      form.setFieldsValue({
        coding_finishedAt: codingCalculate?.finish,
        coding_startedAt: codingCalculate?.start,
        designing_finishedAt: designingCalculate?.finish,
        designing_startedAt: designingCalculate?.start,
        modeling_finishedAt: modelingCalculate?.finish,
        modeling_startedAt: modelingCalculate?.start,
        scripting_finishedAt: scriptingCalculate?.finish,
        scripting_startedAt: scriptingCalculate?.start,
        testing_finishedAt: testingCalculate?.finish,
        testing_startedAt: testingCalculate?.start,
        ualab_finishedAt: ualabCalculate?.finish,
        ualab_startedAt: ualabCalculate?.start,
      });
    }
  }, [calculate]);

  return (
    <Edit
      refetch={refetch}
      resource="demands"
      title="Entregas"
      name={isLoading ? 'Carregando...' : `Editar - ${demandData?.experiments.name}`}
    >
      {contextHolder}
      <Row>
        <Col span={24}>
          <Card loading={isLoading}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Collapse defaultActiveKey={2} accordion>
                <Panel header={<Typography.Text strong>Assistente</Typography.Text>} key={1}>
                  <Assistant onFinish={setResult} edit={assistant} id={id} />
                </Panel>
                <Panel header={<Typography.Text strong>Editor</Typography.Text>} key={2}>
                  {currentUser?.role.super_admin ? (
                    <Card title="Alterar Prazos" className="mb-8">
                      <Space>
                        <Form
                          form={calculateForm}
                          layout="inline"
                          initialValues={{
                            time: 1,
                            control: 'add',
                          }}
                          onFinish={setCalculate}
                        >
                          <Form.Item name="control" className="w-32">
                            <Select
                              options={[
                                { label: 'Adiar', value: 'add' },
                                { label: 'Antecipar', value: 'minus' },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item className="w-40" name="time">
                            <InputNumber min={1} className="w-full" addonAfter="Dias Úteis" />
                          </Form.Item>
                          <Button type="primary" htmlType="submit">
                            Aplicar
                          </Button>
                        </Form>
                      </Space>
                    </Card>
                  ) : null}
                  <Form layout="vertical" initialValues={initialValues} onFinish={onFinish} form={form}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <Card
                        title="Informações da demanda"
                        style={{ display: isAdmin || isLeader ? undefined : 'none' }}
                      >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col span={8}>
                            <Form.Item label="Autor" name="creator" className="w-full">
                              <Input readOnly disabled />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Data de Início" name="started_at" className="w-full">
                              <DatePicker
                                disabled
                                className="w-full"
                                disabledDate={(date) => !isBusinessDay(date)}
                                format="DD/MM/YYYY HH:mm"
                                showTime={{ format: 'HH:mm' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Data de Finalização" name="finished_at" className="w-full">
                              <DatePicker
                                disabled
                                inputReadOnly
                                className="w-full"
                                disabledDate={(date) => !isBusinessDay(date)}
                                format="DD/MM/YYYY HH:mm"
                                showTime={{ format: 'HH:mm' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="status" label="Status">
                              <Select
                                placeholder="Selecione uma status"
                                allowClear
                                disabled={!(isAdmin || isLeader)}
                                options={statusOptions}
                                optionFilterProp="label"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="institution_id" label="Instituição">
                              <Select
                                placeholder="Selecione uma Instituição"
                                allowClear
                                showSearch
                                disabled={institutionsLoading || !(isAdmin || isLeader)}
                                options={institutionOptions}
                                optionFilterProp="label"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item name="experiment_id" label="Laboratório">
                              <Select
                                placeholder="Selecione um Laboratório"
                                allowClear
                                showSearch
                                disabled={experimentsLoading || !(isAdmin || isLeader)}
                                options={experimentOptions}
                                optionFilterProp="label"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item name="tags" label="Tags">
                              <Select
                                mode="tags"
                                placeholder="Selecione ou adicione uma tag."
                                tagRender={tagRender}
                                disabled={!(isAdmin || isLeader)}
                                loading={tagsLoading}
                                options={tagsOptions}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>

                      <Card
                        type="inner"
                        title="Programação"
                        id="coding"
                        tabList={tabList}
                        onTabChange={setCodingTabKey}
                        activeTabKey={codingTabKey}
                        key={nanoid()}
                        extra={<CalculateTeam team="coding" formInstante={form} />}
                      >
                        {contentList('coding', codingTabKey).data}
                        {contentList('coding', codingTabKey).documents}
                      </Card>

                      <Card
                        type="inner"
                        title="Modelagem"
                        id="modeling"
                        tabList={tabList}
                        onTabChange={setModelingTabKey}
                        activeTabKey={modelingTabKey}
                        key={nanoid()}
                        extra={<CalculateTeam team="modeling" formInstante={form} />}
                      >
                        {contentList('modeling', modelingTabKey).data}
                        {contentList('modeling', modelingTabKey).documents}
                      </Card>

                      <Card
                        type="inner"
                        title="Testes"
                        id="testing"
                        tabList={tabList}
                        onTabChange={setTestingTabKey}
                        activeTabKey={testingTabKey}
                        key={nanoid()}
                        extra={<CalculateTeam team="testing" formInstante={form} />}
                      >
                        {contentList('testing', testingTabKey).data}
                        {contentList('testing', testingTabKey).documents}
                      </Card>

                      <Card
                        type="inner"
                        title="Roteirização"
                        id="scripting"
                        tabList={tabList}
                        onTabChange={setScriptingTabKey}
                        activeTabKey={scriptingTabKey}
                        key={nanoid()}
                        extra={<CalculateTeam team="scripting" formInstante={form} />}
                      >
                        {contentList('scripting', scriptingTabKey).data}
                        {contentList('scripting', scriptingTabKey).documents}
                      </Card>

                      <Card
                        type="inner"
                        title="UALAB"
                        id="ualab"
                        tabList={tabList}
                        onTabChange={setUalabTabKey}
                        activeTabKey={ualabTabKey}
                        key={nanoid()}
                        extra={<CalculateTeam team="ualab" formInstante={form} />}
                      >
                        {contentList('ualab', ualabTabKey).data}
                        {contentList('ualab', ualabTabKey).documents}
                      </Card>

                      <Card
                        type="inner"
                        title="Design Gráfico"
                        id="designing"
                        tabList={tabList}
                        onTabChange={setDesignTabKey}
                        activeTabKey={designTabKey}
                        key={nanoid()}
                        extra={<CalculateTeam team="designing" formInstante={form} />}
                      >
                        {contentList('designing', designTabKey).data}
                        {contentList('designing', designTabKey).documents}
                      </Card>

                      <Drawer
                        width="40%"
                        title={checklist ? checklist[type]?.name : 'Checklist'}
                        placement="right"
                        onClose={() => setOpen(false)}
                        open={open}
                      >
                        <Checklist
                          onOpen={setOpen}
                          select={{
                            id: checklist ? checklist[type]?.id : undefined,
                            name: checklist ? checklist[type]?.name : undefined,
                            params: checklist
                              ? checklist[type]?.params?.map((param) => ({
                                  checked: param.checked,
                                  key: param.key,
                                  name: param.name,
                                  percentage: param.percentage,
                                }))
                              : undefined,
                          }}
                          onSelect={(value) => {
                            setChecklist((prev) => ({ ...prev, [type]: value }));
                            const ids = [
                              ...new Set(value.params?.map((param) => (param.checked ? Number(param.key) : undefined))),
                            ].filter((id) => id) as number[];
                            form.setFieldValue(`${type}_checklist_ids`, ids);
                            handlePercent(type, ids, value.params);
                          }}
                        />
                      </Drawer>

                      <Form.Item style={{ textAlign: 'center' }}>
                        <Button htmlType="submit" type="primary" loading={isUpdateDemandLoading}>
                          Salvar
                        </Button>
                      </Form.Item>
                    </Space>
                  </Form>
                </Panel>
              </Collapse>
            </Space>
          </Card>
        </Col>
      </Row>
    </Edit>
  );
}
