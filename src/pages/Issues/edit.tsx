// noinspection JSIgnoredPromiseFromCall

import { InboxOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  SelectProps,
  Space,
  Tooltip,
  Upload,
  UploadFile,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { handleError } from '../../helpers';
import { ISSUES_STATUS } from '../../models/enum/issuesStatus.enum';
import { PRIORITY } from '../../models/enum/priority.enum';
import { IssuesUpdate } from '../../models/issues.models';
import { useGetExperimentsQuery } from '../../services/demands.service';
import { useShowIssuesQuery, useUpdateIssuesMutation } from '../../services/issues.service';
import { useAllIssuesTagsQuery } from '../../services/issueTags.service';
import { useGetUsersQuery } from '../../services/user.service';

interface IssueEditProps {
  id?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function IssueEdit({ onClose, isOpen, id }: IssueEditProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const [toast, contextHolder] = message.useMessage();

  const [updateIssue, { isLoading, isSuccess, isError, error }] = useUpdateIssuesMutation();
  const { data: issueData, refetch: issuesRefetch } = useShowIssuesQuery(id || skipToken);
  const { data: usersData, isLoading: isUsersLoading, refetch: usersRefetch } = useGetUsersQuery();

  const isPermission = (): boolean => (currentUser?.role.admin ? true : currentUser?.department.name === 'Testing');
  const isResponsible = (): boolean => currentUser?.id === issueData?.responsible_id;
  const isDisabled = (status?: boolean): boolean => !(isPermission() || (isResponsible() && status));

  const {
    data: issueTagsData,
    isLoading: isIssueTagsLoading,
    refetch: issuesTagsRefetch,
  } = useAllIssuesTagsQuery(undefined, { skip: !(isPermission() || isResponsible()) });
  const {
    data: experimentsData,
    isLoading: isExperimentsLoading,
    refetch: experimentsRefetch,
  } = useGetExperimentsQuery();
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);

  const usersOptions: SelectProps['options'] = useMemo(
    () => (usersData ? orderBy(usersData, 'name').map((user) => ({ label: user.name, value: user.id })) : []),
    [usersData],
  );

  const experimentsOptions: SelectProps['options'] = useMemo(
    () =>
      experimentsData
        ? orderBy(experimentsData, 'name').map((experiment) => ({
            label: `${experiment.id} - ${experiment.name}`,
            value: experiment.id,
          }))
        : [],
    [experimentsData],
  );

  const issueTagsOptions: SelectProps['options'] = useMemo(
    () => (issueTagsData ? issueTagsData.map((tag) => ({ label: tag.name, value: tag.id })) : []),
    [issueTagsData],
  );

  const [form] = Form.useForm<IssuesUpdate>();

  const refetch = (): void => {
    usersRefetch();
    issuesRefetch();
    issuesTagsRefetch();
    experimentsRefetch();
  };

  const onFinish = (values: IssuesUpdate) => {
    let dataValues: IssuesUpdate = {};
    if (isDisabled()) {
      dataValues.status = values.status;
    } else {
      dataValues = values;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(dataValues));
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    if (id) {
      updateIssue({
        id,
        formData,
      });
    }
  };

  useEffect(() => {
    if (issueData) {
      form.setFieldsValue({
        problem: issueData.problem,
        status: issueData.status as ISSUES_STATUS,
        experiment_id: issueData.experiment_id,
        responsible_id: issueData.responsible_id,
        description: issueData.description,
        priority: issueData.priority as PRIORITY,
        tags: issueData.issueTags.map((tag) => tag.id),
        approved: issueData.approved,
      });
    }
  }, [issueData]);

  useEffect(() => {
    if (isSuccess) {
      setFileList([]);
      toast.success('Problema atualizado com sucesso');
      onClose();
    }
    if (isError && error && 'data' in error) {
      const message = handleError(error);
      toast.error(message);
    }
  }, [isSuccess, isError, error]);

  return (
    <Drawer
      title="Editar Problema"
      onClose={onClose}
      open={isOpen}
      extra={
        <Tooltip title="Atualizar" placement="bottomLeft">
          <Button icon={<ReloadOutlined />} onClick={refetch} />
        </Tooltip>
      }
      width="50%"
    >
      {contextHolder}
      <Row>
        <Col span={24}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Problema"
              name="problem"
              rules={[
                {
                  required: true,
                  message: 'O título do problema é obrigatório',
                },
              ]}
            >
              <Input disabled={isDisabled()} />
            </Form.Item>
            <Form.Item label="Aprovado" name="approved">
              <Radio.Group disabled={isDisabled()} optionType="button" buttonStyle="solid">
                <Radio value>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione uma opção.',
                },
              ]}
            >
              <Select
                disabled={isDisabled(true)}
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
              label="Experimento"
              name="experiment_id"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione uma opção.',
                },
              ]}
            >
              <Select
                disabled={isExperimentsLoading || isDisabled()}
                optionFilterProp="label"
                loading={isExperimentsLoading}
                showSearch
                options={experimentsOptions}
              />
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
              <Select
                optionFilterProp="label"
                disabled={isUsersLoading || isDisabled()}
                loading={isUsersLoading}
                allowClear
                showSearch
                options={usersOptions}
              />
            </Form.Item>
            <Form.Item label="Descrição" name="description">
              <Input.TextArea disabled={isDisabled()} rows={5} />
            </Form.Item>
            <Form.Item
              label="Gravidade"
              name="priority"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione uma opção.',
                },
              ]}
            >
              <Select
                allowClear
                disabled={isDisabled()}
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
            <Form.Item label="Ambiente" name="tags">
              <Select
                disabled={isIssueTagsLoading || isDisabled()}
                loading={isIssueTagsLoading}
                allowClear
                showSearch
                mode="multiple"
                options={issueTagsOptions}
              />
            </Form.Item>
            <Form.Item label="Arquivos" name="files">
              <Upload.Dragger
                disabled={isDisabled()}
                fileList={fileList}
                onRemove={(file) => {
                  const index = fileList.indexOf(file);
                  const newFileList = fileList.slice();
                  newFileList.splice(index, 1);
                  setFileList(newFileList);
                }}
                beforeUpload={(file) => {
                  setFileList((prev) => {
                    const files = [...prev];
                    files.push(file);
                    return files;
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
            <Divider />
            <Form.Item>
              <Space direction="vertical" className="w-full" align="center">
                <Button
                  disabled={isDisabled(true)}
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  icon={<SaveOutlined />}
                >
                  Salvar
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Drawer>
  );
}

IssueEdit.displayName = 'IssueEdit';
IssueEdit.defaultProps = {
  id: undefined,
};
