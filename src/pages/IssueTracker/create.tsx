import { InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Space,
  Tabs,
  TabsProps,
  Upload,
  UploadFile,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { omit, orderBy } from 'lodash';
import { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { TextField } from '../../components';
import { UrlField } from '../../components/fields/url';
import { handleError, isValidVersion } from '../../helpers';
import { ISSUES_STATUS } from '../../models/enum/issuesStatus.enum';
import { PRIORITY } from '../../models/enum/priority.enum';
import { useGetExperimentsQuery } from '../../services/demands.service';
import { useCreateIssuesMutation } from '../../services/issues.service';
import { useAllIssuesTagsQuery } from '../../services/issueTags.service';
import { useGetUsersQuery } from '../../services/user.service';

type TargetKey = MouseEvent | KeyboardEvent | string;

interface IssueCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IssueCreateForm {
  experiment_id: number;
  responsible_id: number;
  version: string;
  problems: {
    [x: string]: {
      status: ISSUES_STATUS;
      problem: string;
      description?: string;
      priority: PRIORITY;
      tags?: number[];
      files?: UploadFile<RcFile>[];
    };
  };
}

export function IssueCreate({ onClose, isOpen }: IssueCreateProps) {
  const [toast, contextHolder] = message.useMessage();
  const { data: usersData } = useGetUsersQuery();
  const { data: experimentsData } = useGetExperimentsQuery();
  const { data: issueTagsData } = useAllIssuesTagsQuery();

  const [createIssue, { isLoading, isError, isSuccess, error }] = useCreateIssuesMutation();

  const [fileList, setFileList] = useState<{ [x: string]: UploadFile<RcFile>[] }>({
    '1': [],
  });

  const usersOptions = useMemo(
    () => (usersData ? orderBy(usersData, 'name').map((user) => ({ label: user.name, value: user.id })) : []),
    [usersData],
  );
  const experimentsOptions = useMemo(
    () =>
      experimentsData
        ? orderBy(experimentsData, 'name').map((experiment) => ({
            label: `${experiment.id} - ${experiment.name}`,
            value: experiment.id,
          }))
        : [],
    [experimentsData],
  );

  const issueTagsOptions = useMemo(
    () => (issueTagsData ? issueTagsData.map((tag) => ({ label: tag.name, value: tag.id })) : []),
    [issueTagsData],
  );

  const [form] = Form.useForm<IssueCreateForm>();

  const onFinish = (values: IssueCreateForm) => {
    const problems = Object.values(values.problems).map((pro) => ({
      ...pro,
      tags: pro.tags?.length ? pro.tags : [],
    }));
    const payload = {
      experiment_id: values.experiment_id,
      responsible_id: values.responsible_id,
      version: values.version,
      problems,
    };
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    Object.values(fileList).forEach((file, index) => {
      file.forEach((f) => {
        formData.append(`files${index}`, f as RcFile);
      });
    });
    return createIssue(formData);
  };

  const initialItems: TabsProps['items'] = useMemo(
    () => [
      {
        label: 'Problema 1',
        key: '1',
        children: (
          <>
            <Form.Item
              label="Status"
              name={['problems', '1', 'status']}
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione uma opção.',
                },
              ]}
            >
              <Select
                allowClear
                options={[
                  {
                    label: ISSUES_STATUS.NEW,
                    value: ISSUES_STATUS.NEW,
                  },
                  {
                    label: ISSUES_STATUS.IS_NOT_ERROR,
                    value: ISSUES_STATUS.IS_NOT_ERROR,
                  },
                  {
                    label: ISSUES_STATUS.DUPLICATE,
                    value: ISSUES_STATUS.DUPLICATE,
                  },
                  {
                    label: ISSUES_STATUS.NO_REMOVE,
                    value: ISSUES_STATUS.NO_REMOVE,
                  },
                  {
                    label: ISSUES_STATUS.RESOLVED,
                    value: ISSUES_STATUS.RESOLVED,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Problema"
              name={['problems', '1', 'problem']}
              rules={[
                {
                  required: true,
                  message: 'O título do problema é obrigatório',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Descrição" name={['problems', '1', 'description']}>
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item
              label="Gravidade"
              name={['problems', '1', 'priority']}
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione uma opção.',
                },
              ]}
            >
              <Select
                allowClear
                options={[
                  {
                    label: 'Baixa',
                    value: PRIORITY.LOW,
                  },
                  {
                    label: 'Normal',
                    value: PRIORITY.NORMAL,
                  },
                  {
                    label: 'Alta',
                    value: PRIORITY.HIGH,
                  },
                  {
                    label: 'Critica',
                    value: PRIORITY.CRITICAL,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Ambiente" name={['problems', '1', 'tags']}>
              <Select allowClear showSearch mode="multiple" options={issueTagsOptions} />
            </Form.Item>
            <Form.Item label="Arquivos" name={['problems', '1', 'files']}>
              <Upload.Dragger
                fileList={fileList['1']}
                onRemove={(file) => {
                  const index = fileList['1'].indexOf(file);
                  const newFileList = fileList['1'].slice();
                  newFileList.splice(index, 1);
                  setFileList((prev) => ({ ...prev, '1': newFileList }));
                }}
                beforeUpload={(file) => {
                  setFileList((prev) => {
                    const files = prev['1'] || [];
                    files.push(file);
                    return { ...prev, '1': files };
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
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Clique ou arraste o arquivo para esta área para carregar</p>
                <p className="ant-upload-hint">
                  Suporte para um carregamento único ou em massa. Estritamente proibido de fazer upload de dados da
                  empresa ou outros arquivos proibidos.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </>
        ),
      },
    ],
    [issueTagsOptions, fileList],
  );

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    // eslint-disable-next-line no-plusplus
    const newActiveKey = `tab${newTabIndex.current++}`;
    const newPanes = [...items];
    setFileList((prev) => ({ ...prev, [newActiveKey]: [] }));
    // eslint-disable-next-line no-plusplus
    newPanes.push({
      label: `Problema ${newPanes.length + 1}`,
      children: (
        <>
          <Form.Item
            label="Status"
            name={['problems', newActiveKey, 'status']}
            rules={[
              {
                required: true,
                message: 'Por favor, selecione uma opção.',
              },
            ]}
          >
            <Select
              allowClear
              options={[
                {
                  label: ISSUES_STATUS.NEW,
                  value: ISSUES_STATUS.NEW,
                },
                {
                  label: ISSUES_STATUS.IS_NOT_ERROR,
                  value: ISSUES_STATUS.IS_NOT_ERROR,
                },
                {
                  label: ISSUES_STATUS.DUPLICATE,
                  value: ISSUES_STATUS.DUPLICATE,
                },
                {
                  label: ISSUES_STATUS.NO_REMOVE,
                  value: ISSUES_STATUS.NO_REMOVE,
                },
                {
                  label: ISSUES_STATUS.RESOLVED,
                  value: ISSUES_STATUS.RESOLVED,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Problema"
            name={['problems', newActiveKey, 'problem']}
            rules={[
              {
                required: true,
                message: 'O título do problema é obrigatório',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Descrição" name={['problems', newActiveKey, 'description']}>
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item
            label="Gravidade"
            name={['problems', newActiveKey, 'priority']}
            rules={[
              {
                required: true,
                message: 'Por favor, selecione uma opção.',
              },
            ]}
          >
            <Select
              allowClear
              options={[
                {
                  label: 'Baixa',
                  value: PRIORITY.LOW,
                },
                {
                  label: 'Normal',
                  value: PRIORITY.NORMAL,
                },
                {
                  label: 'Alta',
                  value: PRIORITY.HIGH,
                },
                {
                  label: 'Critica',
                  value: PRIORITY.CRITICAL,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Ambiente" name={['problems', newActiveKey, 'tags']}>
            <Select allowClear showSearch mode="multiple" options={issueTagsOptions} />
          </Form.Item>
          <Form.Item label="Arquivos" name={['problems', newActiveKey, 'files']}>
            <Upload.Dragger
              fileList={fileList[newActiveKey]}
              onRemove={(file) => {
                const index = fileList[newActiveKey].indexOf(file);
                const newFileList = fileList[newActiveKey].slice();
                newFileList.splice(index, 1);
                setFileList((prev) => ({ ...prev, [newActiveKey]: newFileList }));
              }}
              beforeUpload={(file) => {
                setFileList((prev) => {
                  const files = prev[newActiveKey] || [];
                  files.push(file);
                  return { ...prev, [newActiveKey]: files };
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
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Clique ou arraste o arquivo para esta área para carregar</p>
              <p className="ant-upload-hint">
                Suporte para um carregamento único ou em massa. Estritamente proibido de fazer upload de dados da
                empresa ou outros arquivos proibidos.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </>
      ),
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;

    setFileList((prev) => omit(prev, targetKey as string));
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  useEffect(() => {
    setItems(initialItems);
  }, [issueTagsOptions]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields(['problem', 'description', 'priority', 'tags']);
      setFileList({});
      toast.success('Problema adicionado com sucesso').then();
    }
    if (isError && error && 'data' in error) {
      const message = handleError(error);
      toast.error(message).then();
    }
  }, [isSuccess, isError, error]);

  return (
    <Drawer onClose={onClose} open={isOpen} width="50%" title="Adicionar Problema">
      <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ status: ISSUES_STATUS.NEW }}>
        {contextHolder}
        <Form.Item
          label="Experimento"
          name="experiment_id"
          rules={[
            {
              required: true,
              message: 'Por favor, selecione uma opção.',
            },
          ]}
        >
          <Select optionFilterProp="label" showSearch options={experimentsOptions} />
        </Form.Item>
        <Form.Item
          label="Responsável"
          name="responsible_id"
          rules={[
            {
              required: true,
              message: 'Por favor, selecione uma opção.',
            },
          ]}
        >
          <Select optionFilterProp="label" allowClear showSearch options={usersOptions} />
        </Form.Item>
        <Form.Item
          label={
            <>
              <TextField value="Versão" className="pr-2" />{' '}
              <UrlField value="/releases" target="_blank">
                (checar versões)
              </UrlField>
            </>
          }
          name="version"
          rules={[
            {
              required: true,
              message: 'A versão é obrigatória!',
            },
            {
              validator(_, value) {
                if (isValidVersion(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Insira um valor válido'));
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit} items={items} />
        <Form.Item>
          <Space direction="vertical" className="w-full" align="center">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Salvar
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </Drawer>
  );
}
