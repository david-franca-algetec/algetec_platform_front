import { ColorPicker, Form, Input, message, Modal } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useEffect } from 'react';
import { handleError } from '../../helpers';
import { useCreateReleaseTypeMutation } from '../../services/releaseTypes.service';
import { CreateProps } from '../types';

interface InitialValues {
  name: string;
  color: Color | string;
}

interface ReleaseTypeInitialValues {
  name: string;
  color: Color | string;
}

export function CreateTag({ onClose, open }: CreateProps) {
  const [toast, contextHolder] = message.useMessage();
  const [createType, { isLoading, isSuccess, isError, error }] = useCreateReleaseTypeMutation();

  const initialValues: InitialValues = {
    name: '',
    color: 'C40000',
  };

  const [form] = Form.useForm<ReleaseTypeInitialValues>();

  const onFinish = async () => {
    const values = await form.validateFields();
    const color = typeof values.color === 'string' ? values.color : values.color.toHexString();

    createType({ name: values.name, color });
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (isError && error && 'data' in error) {
      toast.error(handleError(error)).then();
    }
    if (isSuccess) {
      form.resetFields();
      toast.success('Tag criada com sucesso').then();
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title="Adicionar Tag"
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
          name="color"
          label="Cor"
          rules={[
            {
              required: true,
              message: 'A cor é obrigatória',
            },
          ]}
        >
          <ColorPicker showText format="hex" size="large" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Nome"
          rules={[
            {
              required: true,
              message: 'O Nome é obrigatório',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
