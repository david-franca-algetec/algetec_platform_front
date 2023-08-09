import { Button, Drawer, Form, Input, message, Select, SelectProps } from 'antd';
import { orderBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { handleError } from '../../../helpers';
import { useGetExperimentsQuery } from '../../../services/demands.service';
import { useAllAreasQuery, useCreatePracticeMutation } from '../../../services/practices.service';

interface PracticesCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PracticesCreateForm {
  code: string;
  name: string;
  description: string;
  experiment_id: number;
  areas: string[];
}

function PracticesCreate({ onClose, isOpen }: PracticesCreateProps) {
  const [form] = Form.useForm();
  const [toast, contextHolder] = message.useMessage();

  const { data: areasData, isLoading: isLoadingAreas } = useAllAreasQuery();
  const { data: experimentsData, isLoading: isExperimentsLoading } = useGetExperimentsQuery();
  const [
    createPractice,
    {
      isLoading: isCreatePracticeLoading,
      isError: isCreatePracticeError,
      error: createPracticeError,
      isSuccess: isCreatePracticeSuccess,
    },
  ] = useCreatePracticeMutation();

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

  const onFinish = (values: PracticesCreateForm): void => {
    createPractice(values);
  };

  useEffect(() => {
    if (isCreatePracticeSuccess) {
      toast.success('Pratica criada com sucesso!').then();
      form.resetFields();
      onClose();
    }
    if (isCreatePracticeError && createPracticeError && 'data' in createPracticeError) {
      const message = handleError(createPracticeError);
      toast.error(message).then();
    }
  }, [isCreatePracticeSuccess, isCreatePracticeError, createPracticeError]);

  return (
    <Drawer onClose={onClose} open={isOpen} width="50%" title="Adicionar Prática">
      {contextHolder}
      <Form layout="vertical" form={form} onFinish={onFinish}>
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
            disabled={isExperimentsLoading}
            optionFilterProp="label"
            loading={isExperimentsLoading}
            showSearch
            options={experimentsOptions}
          />
        </Form.Item>
        <Form.Item name="areas" label="Áreas" rules={[{ required: true, message: 'Por favor, selecione um valor.' }]}>
          <Select
            options={areasOptions}
            disabled={isLoadingAreas}
            mode="tags"
            showSearch
            optionFilterProp="label"
            loading={isLoadingAreas}
          />
        </Form.Item>
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" loading={isCreatePracticeLoading}>
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default PracticesCreate;
