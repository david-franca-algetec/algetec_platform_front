/* eslint-disable react/jsx-props-no-spreading */
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Drawer,
  Form,
  FormListFieldData,
  Input,
  List,
  message,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { capitalize, orderBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Assistant, Result, ScrollArea } from '../../components';
import { Create } from '../../components/crud/create';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { handleError, handleTypeName, isBusinessDay, numberOfBusinessDays } from '../../helpers';
import { DemandCreate } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { useGetChecklistsQuery } from '../../services/checklist.service';
import { useGetDemandsTagsQuery, useGetExperimentsQuery, useStoreDemandMutation } from '../../services/demands.service';
import { useGetDepartmentsQuery } from '../../services/department.service';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { useGetUsersQuery } from '../../services/user.service';
import { tagRender } from '../VersionControl/tagRender';
import { Checklist, IChecklistSelectProps } from './Checklist';
import { SelectOption } from './types';

dayjs.extend(relativeTime);

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

type RangedArray = [Dayjs, Dayjs];

type Fields = {
  type: string;
  date_range: RangedArray;
  message: string;
  developers: number;
  checklist_id: number;
  files: UploadFile<RcFile>[];
};

interface InitialValues {
  institution_id: number;
  experiment_id: number;
  status: DemandStatus;
  tags?: string[];
  list: Fields[];
}

export interface Checklists {
  index: number;
  checklist: IChecklistSelectProps;
}

export function CreateDemandPage() {
  const [toast, contextHolder] = message.useMessage();
  const { data: institutions, isLoading: institutionsLoading } = useGetInstitutionsQuery();
  const { data: experiments, isLoading: experimentsLoading } = useGetExperimentsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const { data: tagsData, isLoading: tagsLoading } = useGetDemandsTagsQuery();
  const { data: checklistsData } = useGetChecklistsQuery();
  const { data: departmentsData } = useGetDepartmentsQuery();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const teamsItems: SelectOption[] = useMemo(
    () =>
      departmentsData
        ? orderBy(departmentsData, 'name').map((data) => ({
            label: handleTypeName(data.name),
            value: data.name.toLowerCase(),
          }))
        : [],
    [departmentsData],
  );

  const checklists = useMemo(() => checklistsData || [], [checklistsData]);

  const [selectedKey, setSelectedKey] = useState<number>();

  const [result, setResult] = useState<Result>();
  const [open, setOpen] = useState(false);
  const [checklist, setChecklist] = useState<Checklists[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<{ [key: number]: string }>({
    0: 'data',
    1: 'data',
    2: 'data',
    3: 'data',
    4: 'data',
    5: 'data',
  });
  const [fileList, setFileList] = useState<{ [key: number]: UploadFile<RcFile>[] }>({});
  const [form] = Form.useForm<InitialValues>();

  const [
    storeDemand,
    { isLoading: storeDemandLoading, isSuccess: storeDemandSuccess, isError: storeDemandError, error },
  ] = useStoreDemandMutation();

  const users = useMemo(() => {
    if (usersData) {
      return usersData.map((user) => ({
        value: user.id,
        label: user.name,
      }));
    }
    return [];
  }, [usersData]);

  const currentUser = useAppSelector(selectCurrentUser);

  const isAdmin = useMemo(() => (currentUser ? currentUser.role.demands_admin : false), [currentUser]);

  const onFinish = useCallback(
    (values: InitialValues) => {
      const demand: DemandCreate = {
        institution_id: values.institution_id,
        experiment_id: values.experiment_id,
        status: values.status,
        logger_id: currentUser ? currentUser.id : 0,
        tags: values.tags,
      };
      const formData = new FormData();
      values.list.forEach((value, index) => {
        switch (value.type) {
          case 'coding':
            demand.coding_deadline = numberOfBusinessDays(
              value.date_range[0].toDate(),
              value.date_range[1].toDate(),
            )?.hours;
            demand.coding_developers = [value.developers];
            demand.coding_startedAt = value.date_range[0].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.coding_finishedAt = value.date_range[1].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.coding_checklist_id = value.checklist_id;
            if (fileList[index]) {
              fileList[index].forEach((file) => {
                formData.append('coding_files[]', file as RcFile);
              });
            }
            break;
          case 'modeling':
            demand.modeling_deadline = numberOfBusinessDays(
              value.date_range[0].toDate(),
              value.date_range[1].toDate(),
            )?.hours;
            demand.modeling_developers = [value.developers];
            demand.modeling_startedAt = value.date_range[0].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.modeling_finishedAt = value.date_range[1].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.modeling_checklist_id = value.checklist_id;
            if (fileList[index]) {
              fileList[index].forEach((file) => {
                formData.append('modeling_files[]', file as RcFile);
              });
            }
            break;
          case 'ualab':
            demand.ualab_deadline = numberOfBusinessDays(
              value.date_range[0].toDate(),
              value.date_range[1].toDate(),
            )?.hours;
            demand.ualab_developers = [value.developers];
            demand.ualab_startedAt = value.date_range[0].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.ualab_finishedAt = value.date_range[1].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.ualab_checklist_id = value.checklist_id;
            if (fileList[index]) {
              fileList[index].forEach((file) => {
                formData.append('ualab_files[]', file as RcFile);
              });
            }
            break;
          case 'testing':
            demand.testing_deadline = numberOfBusinessDays(
              value.date_range[0].toDate(),
              value.date_range[1].toDate(),
            )?.hours;
            demand.testing_developers = [value.developers];
            demand.testing_startedAt = value.date_range[0].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.testing_finishedAt = value.date_range[1].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.testing_checklist_id = value.checklist_id;
            if (fileList[index]) {
              fileList[index].forEach((file) => {
                formData.append('testing_files[]', file as RcFile);
              });
            }
            break;
          case 'scripting':
            demand.scripting_deadline = numberOfBusinessDays(
              value.date_range[0].toDate(),
              value.date_range[1].toDate(),
            )?.hours;
            demand.scripting_developers = [value.developers];
            demand.scripting_startedAt = value.date_range[0].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.scripting_finishedAt = value.date_range[1].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.scripting_checklist_id = value.checklist_id;
            if (fileList[index]) {
              fileList[index].forEach((file) => {
                formData.append('scripting_files[]', file as RcFile);
              });
            }
            break;
          case 'designing':
            demand.designing_deadline = numberOfBusinessDays(
              value.date_range[0].toDate(),
              value.date_range[1].toDate(),
            )?.hours;
            demand.designing_developers = [value.developers];
            demand.designing_startedAt = value.date_range[0].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.designing_finishedAt = value.date_range[1].set('seconds', 0).set('milliseconds', 0).toISOString();
            demand.designing_checklist_id = value.checklist_id;
            if (fileList[index]) {
              fileList[index].forEach((file) => {
                formData.append('designing_files[]', file as RcFile);
              });
            }
            break;

          default:
            break;
        }
      });
      formData.append('data', JSON.stringify(demand));
      storeDemand(formData);
    },
    [currentUser],
  );

  const statusOptions = useMemo(
    () => [
      { value: DemandStatus.CORRECTION, label: 'Correção' },
      { value: DemandStatus.DEVELOPMENT, label: 'Desenvolvimento' },
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

  const handleChecklist = (type: string, key: number, name: number) => {
    const defaultChecklist = checklists.find((checklist) =>
      checklist.departments.find((dep) => dep.name === capitalize(type)),
    );
    if (defaultChecklist) {
      const newChecklist = {
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
      setChecklist((prev) => {
        const check = prev.findIndex((value) => value.index === key);

        if (check >= 0) {
          // eslint-disable-next-line no-param-reassign
          prev[check].checklist = newChecklist;
        } else {
          prev.push({
            index: key,
            checklist: newChecklist,
          });
        }
        return prev;
      });
      form.setFieldValue(['list', name, 'checklist_id'], defaultChecklist.id);
    }
  };

  const handleSelect = (name: number, key: number) => {
    const { list } = form.getFieldsValue();
    const types = list.map((type) => type.type);
    setSelectedItems(types);

    types.forEach((type) => {
      handleChecklist(type, key, name);
    });
  };

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

  const contentList = (fields: FormListFieldData[], name: number, key: number) => {
    if (activeTabKey[key] === 'data') {
      return (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={[name, 'type']}
              label="Tipo"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Selecione um tipo',
                },
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Select options={teamsItems} onSelect={() => handleSelect(name, key)} />
            </Form.Item>
            <Space>
              <Form.Item
                name={[name, 'date_range']}
                label="Prazo"
                rules={[
                  {
                    required: true,
                    message: 'O prazo é obrigatório',
                  },
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <RangePicker
                  disabledDate={(date) => !isBusinessDay(date)}
                  format="DD/MM/YYYY HH:mm"
                  showNow
                  showTime={{ format: 'HH:mm' }}
                  onChange={(value) => {
                    if (value?.[0] && value[1]) {
                      const businessDays = numberOfBusinessDays(value[0].toDate(), value[1].toDate());
                      if (businessDays) {
                        form.setFieldValue(['list', name, 'message'], businessDays.message);
                      }
                    }
                  }}
                />
              </Form.Item>
              <Form.Item name={[name, 'message']} label="Total">
                <Input style={{ width: '100%' }} readOnly />
              </Form.Item>
            </Space>
            <Form.Item
              name={[name, 'developers']}
              label="Desenvolvedores"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  required: true,
                  message: 'Os responsáveis são obrigatórios',
                },
              ]}
            >
              <Select
                placeholder="Selecione um responsável"
                allowClear
                showSearch
                disabled={usersLoading}
                options={users}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Card style={{ height: '100%' }}>
              <Button
                block
                type="dashed"
                onClick={() => {
                  setOpen(true);
                  setSelectedKey(fields[key].key);
                }}
              >
                Selecionar lista de tarefas
              </Button>

              <ScrollArea height={200}>
                <List
                  style={{ marginTop: 8 }}
                  bordered
                  header={
                    <Space align="center" direction="vertical" style={{ width: '100%' }}>
                      <Typography.Text strong>
                        {checklist.find((value) => value.index === key)?.checklist.name}
                      </Typography.Text>
                    </Space>
                  }
                  dataSource={checklist.find((value) => value.index === key)?.checklist.params}
                  renderItem={(item) => (
                    <List.Item key={nanoid()}>
                      <Row className="w-full">
                        <Col span={20}>
                          <Typography.Text>{item.name}</Typography.Text>
                        </Col>
                        <Col span={4}>
                          <Typography.Text>{item.percentage}</Typography.Text>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </Card>
          </Col>
        </Row>
      );
    }
    if (activeTabKey[key] === 'documents') {
      return (
        <ScrollArea>
          <div className="mr-4">
            <Upload
              fileList={fileList[name]}
              onRemove={(file) => {
                const index = fileList[name].indexOf(file);
                const newFileList = fileList[name].slice();
                newFileList.splice(index, 1);
                setFileList((prev) => ({ ...prev, [name]: newFileList }));
              }}
              beforeUpload={(file) => {
                setFileList((prev) => {
                  const files = prev[name] || [];
                  files.push(file);
                  return { ...prev, [name]: files };
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
      );
    }
    return null;
  };

  useEffect(() => {
    if (storeDemandError && error && 'data' in error) {
      const message = handleError(error);
      // noinspection JSIgnoredPromiseFromCall
      toast.error(message);
    }
    if (storeDemandSuccess) {
      form.resetFields();
      // noinspection JSIgnoredPromiseFromCall
      toast.success('Demanda cadastrada com sucesso');
      setFileList({});
      setChecklist([]);
    }
  }, [storeDemandError, storeDemandSuccess, error]);

  useEffect(() => {
    if (result) {
      const values = [];
      const types: string[] = [];
      if (result.coding) {
        values.push({
          type: 'coding',
          developers: result.coding.developer,
          message: result.coding.message,
          date_range: [dayjs(result.coding.schedule.startedAt), dayjs(result.coding.schedule.finishedAt)],
        });
        handleChecklist('coding', values.length - 1, values.length - 1);
        types.push('coding');
      }
      if (result.modeling) {
        values.push({
          type: 'modeling',
          developers: result.modeling.developer,
          message: result.modeling.message,
          date_range: [dayjs(result.modeling.schedule.startedAt), dayjs(result.modeling.schedule.finishedAt)],
        });
        handleChecklist('modeling', values.length - 1, values.length - 1);
        types.push('modeling');
      }
      if (result.scripting) {
        values.push({
          type: 'scripting',
          developers: result.scripting.developer,
          message: result.scripting.message,
          date_range: [dayjs(result.scripting.schedule.startedAt), dayjs(result.scripting.schedule.finishedAt)],
        });
        handleChecklist('scripting', values.length - 1, values.length - 1);
        types.push('scripting');
      }
      if (result.testing) {
        values.push({
          type: 'testing',
          developers: result.testing.developer,
          message: result.testing.message,
          date_range: [dayjs(result.testing.schedule.startedAt), dayjs(result.testing.schedule.finishedAt)],
        });
        handleChecklist('testing', values.length - 1, values.length - 1);
        types.push('testing');
      }
      if (result.ualab) {
        values.push({
          type: 'ualab',
          developers: result.ualab.developer,
          message: result.ualab.message,
          date_range: [dayjs(result.ualab.schedule.startedAt), dayjs(result.ualab.schedule.finishedAt)],
        });
        handleChecklist('ualab', values.length - 1, values.length - 1);
        types.push('ualab');
      }
      setSelectedItems(types);
      form.setFieldsValue({
        list: values,
      });
    }
  }, [result]);

  return (
    <Create title="Nova Demanda" resource="demands" listName="Demandas">
      {contextHolder}
      <Card>
        <Space size="middle" direction="vertical" style={{ width: '100%' }}>
          <Collapse defaultActiveKey={2} accordion>
            <Panel header={<Typography.Text strong>Assistente</Typography.Text>} key={1}>
              <Assistant onFinish={setResult} />
            </Panel>
            <Panel header={<Typography.Text strong>Editor</Typography.Text>} key={2}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  institution_id: undefined,
                  experiment_id: undefined,
                  status: DemandStatus.DEVELOPMENT,
                  logger_id: currentUser ? currentUser.id : 0,
                  tags: undefined,
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Card title="Informações da demanda" style={{ display: isAdmin ? undefined : 'none' }}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col span={8}>
                        <Form.Item
                          name="status"
                          label="Status"
                          rules={[
                            {
                              required: true,
                              message: 'Selecione uma opção',
                            },
                          ]}
                        >
                          <Select placeholder="Selecione uma status" allowClear options={statusOptions} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="institution_id"
                          label="Instituição"
                          rules={[
                            {
                              required: true,
                              message: 'Selecione uma opção',
                            },
                          ]}
                        >
                          <Select
                            placeholder="Selecione uma Instituição"
                            allowClear
                            showSearch
                            disabled={institutionsLoading}
                            options={institutionOptions}
                            optionFilterProp="label"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="experiment_id"
                          label="Prática"
                          rules={[
                            {
                              required: true,
                              message: 'Selecione uma opção',
                            },
                          ]}
                        >
                          <Select
                            placeholder="Selecione uma Prática"
                            allowClear
                            showSearch
                            disabled={experimentsLoading}
                            options={experimentOptions}
                            optionFilterProp="label"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item name="tags" label="Tags">
                          <Select
                            mode="tags"
                            placeholder="Selecione ou adicione uma tag."
                            tagRender={tagRender}
                            loading={tagsLoading}
                            options={tagsOptions}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Form.List name="list" initialValue={[{ type: '', date_range: [], message: '', developers: [] }]}>
                    {(fields, { add, remove }, { errors }) => (
                      <Form.Item noStyle key={nanoid()}>
                        <Space key={nanoid()} direction="vertical" style={{ width: '100%' }}>
                          {fields.map(({ name, key }) => (
                            <Card
                              type="inner"
                              tabList={tabList}
                              onTabChange={(tabKey) => {
                                setActiveTabKey((prev) => ({ ...prev, [key]: tabKey }));
                              }}
                              activeTabKey={activeTabKey[key]}
                              key={key}
                              tabBarExtraContent={
                                fields.length > 1 ? (
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      const values: { type: string }[] | undefined = form.getFieldValue('list');
                                      if (values?.[name] && values[name].type) {
                                        const items = [...selectedItems];
                                        const index = items.indexOf(values[name].type);
                                        delete items[index];

                                        setSelectedItems([...new Set(items)]);
                                      }
                                      remove(name);
                                    }}
                                    style={{
                                      color: '#999',
                                      fontSize: '24px',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s',
                                    }}
                                  />
                                ) : null
                              }
                            >
                              {contentList(fields, name, key)}
                            </Card>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              disabled={fields.length >= 6}
                            >
                              Adicionar Campos
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </Space>
                      </Form.Item>
                    )}
                  </Form.List>
                  <Form.Item style={{ textAlign: 'center' }}>
                    <Button htmlType="submit" type="primary" loading={storeDemandLoading}>
                      Salvar
                    </Button>
                  </Form.Item>
                </Space>
              </Form>
            </Panel>
          </Collapse>
        </Space>
        <Drawer width="40%" title="Checklist" placement="right" onClose={() => setOpen(false)} open={open}>
          <Checklist
            onOpen={setOpen}
            select={{
              id: checklist.find((value) => value.index === selectedKey)?.checklist.id,
              name: checklist.find((value) => value.index === selectedKey)?.checklist.name,
              params: checklist.find((value) => value.index === selectedKey)?.checklist.params,
            }}
            onSelect={(value) => {
              if (typeof selectedKey !== 'undefined') {
                setChecklist((prev) => {
                  const check = prev.findIndex((value) => value.index === selectedKey);
                  if (check >= 0) {
                    // eslint-disable-next-line no-param-reassign
                    prev[check].checklist = value;
                  } else {
                    prev.push({ index: selectedKey, checklist: value });
                  }
                  return prev;
                });
                form.setFieldValue(['list', selectedKey, 'checklist_id'], value.id);
              }
            }}
          />
        </Drawer>
      </Card>
    </Create>
  );
}
