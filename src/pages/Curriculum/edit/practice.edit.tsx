import { ReloadOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Button, Col, Drawer, Form, Input, message, Row, Select, SelectProps, Tooltip } from 'antd';
import { orderBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { handleError } from '../../../helpers';
import { useGetExperimentsQuery } from '../../../services/demands.service';
import {
  UpdatePracticeProps,
  useAllAreasQuery,
  useShowPracticeQuery,
  useUpdatePracticeMutation,
} from '../../../services/practices.service';

interface EditProps {
  id?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PracticeEdit({ onClose, isOpen, id }: EditProps) {
  const [toast, contextHolder] = message.useMessage();
  const [form] = Form.useForm<UpdatePracticeProps>();

  const { data: areasData, isLoading: isLoadingAreas, refetch: areasRefetch } = useAllAreasQuery();
  const {
    data: experimentsData,
    isLoading: isExperimentsLoading,
    refetch: experimentsRefetch,
  } = useGetExperimentsQuery();
  const [
    updatePractice,
    {
      isLoading: isUpdatePracticeLoading,
      isSuccess: isUpdatePracticeSuccess,
      isError: isUpdatePracticeError,
      error: updatePracticeError,
    },
  ] = useUpdatePracticeMutation();
  const {
    data: practiceData,
    isLoading: isLoadingPractice,
    refetch: practicesRefetch,
    isFetching: isFetchingPractice,
  } = useShowPracticeQuery(id || skipToken);

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

  const areasOptions: SelectProps['options'] = useMemo(
    () => (areasData ? orderBy(areasData, 'name').map((area) => ({ label: area.name, value: area.name })) : []),
    [areasData],
  );

  const refetch = (): void => {
    practicesRefetch();
    experimentsRefetch();
    areasRefetch();
  };

  const onFinish = (values: UpdatePracticeProps): void => {
    if (id) {
      updatePractice({ ...values, id });
    }
  };

  useEffect(() => {
    if (isUpdatePracticeSuccess) {
      toast.success('Prática atualizada com sucesso!').then();
      form.resetFields();
      onClose();
    }
    if (isUpdatePracticeError && updatePracticeError && 'data' in updatePracticeError) {
      const message = handleError(updatePracticeError);
      toast.error(message).then();
    }
  }, [isUpdatePracticeSuccess, isUpdatePracticeError, updatePracticeError]);

  useEffect(() => {
    if (practiceData && isOpen) {
      form.setFieldsValue({
        code: practiceData.code,
        name: practiceData.name,
        description: practiceData.description,
        experiment_id: practiceData.experiment_id,
        areas: practiceData.experiment.areas.map((el) => el.name),
      });
    }
    if (!isOpen) {
      form.resetFields();
    }
  }, [practiceData, isOpen]);

  return (
    <Drawer
      title="Editar Prática"
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
          <Form layout="vertical" form={form} onFinish={onFinish} disabled={isLoadingPractice || isFetchingPractice}>
            <Form.Item name="code" label="Código" rules={[{ required: true, message: 'Por favor, insira um valor.' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Nome da Prática"
              rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item
              name="experiment_id"
              label="Laboratório"
              rules={[{ required: true, message: 'Por favor, selecione um valor.' }]}
            >
              <Select
                disabled={isExperimentsLoading || isLoadingPractice || isFetchingPractice}
                optionFilterProp="label"
                loading={isExperimentsLoading || isLoadingPractice || isFetchingPractice}
                showSearch
                options={experimentsOptions}
              />
            </Form.Item>
            <Form.Item
              name="areas"
              label="Áreas"
              rules={[{ required: true, message: 'Por favor, selecione um valor.' }]}
            >
              <Select
                options={areasOptions}
                disabled={isLoadingAreas || isLoadingPractice}
                mode="tags"
                showSearch
                optionFilterProp="label"
                loading={isLoadingAreas || isLoadingPractice}
              />
            </Form.Item>
            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" loading={isUpdatePracticeLoading} disabled={isLoadingPractice}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Drawer>
  );
}

PracticeEdit.defaultProps = {
  id: undefined,
};
