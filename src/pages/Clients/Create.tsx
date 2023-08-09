// noinspection JSIgnoredPromiseFromCall

import { Form, Input, message, Modal } from 'antd';
import { useEffect } from 'react';
import { handleError } from '../../helpers';

import { InstitutionCreate } from '../../models/institution.model';
import { useCreateInstitutionMutation } from '../../services/institution.service';
import { CreateProps } from '../types';

export function CreateClient({ onClose, open }: CreateProps) {
  const [createInstitution, { isLoading, isSuccess, isError, error }] = useCreateInstitutionMutation();

  const [toast, contextHolder] = message.useMessage();
  const initialValues: InstitutionCreate = {
    name: '',
  };

  const [form] = Form.useForm<InstitutionCreate>();

  const onFinish = async () => {
    const { name } = await form.validateFields();
    createInstitution({ name });
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (isError && error && 'data' in error) {
      toast.error(handleError(error));
    }
    if (isSuccess) {
      form.resetFields();
      toast.success('Instituição criada com sucesso');
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title="Adicionar Instituição"
      open={open}
      okText="Salvar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onFinish}
      okButtonProps={{
        loading: isLoading,
      }}
      maskStyle={{
        backdropFilter: 'blur(8px)',
      }}
    >
      {contextHolder}
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Nome"
          rules={[
            {
              required: true,
              message: 'Insira o nome da instituição',
            },
            {
              min: 3,
              max: 20,
              message: 'Insira um nome entre 3 e 20 caracteres',
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
