// noinspection JSIgnoredPromiseFromCall

import { Form, Input, message, Modal } from 'antd';
import { useEffect } from 'react';
import { handleError } from '../../helpers';

import { InstitutionUpdate } from '../../models/institution.model';
import { useGetInstitutionQuery, useUpdateInstitutionMutation } from '../../services/institution.service';
import { EditProps } from '../types';

export function EditClient({ onClose, id, open }: EditProps) {
  const { data: institutionData, isLoading } = useGetInstitutionQuery(id, { skip: !id });
  const [updateInstitution, { isLoading: institutionUpdateLoading, isSuccess, isError, error }] =
    useUpdateInstitutionMutation();
  const initialValues: InstitutionUpdate = {
    id: 0,
    name: '',
  };
  const [toast, contextHolder] = message.useMessage();
  const [form] = Form.useForm<InstitutionUpdate>();

  const onFinish = async () => {
    const { name } = await form.validateFields();
    updateInstitution({ id, name });
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (institutionData && open) {
      form.setFieldsValue({
        id: institutionData[0].id,
        name: institutionData[0].name,
      });
    }
  }, [institutionData, open]);

  useEffect(() => {
    if (isError && error && 'data' in error) {
      toast.error(handleError(error));
    }
    if (isSuccess) {
      form.resetFields();
      toast.success('Instituição atualizada com sucesso');
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title="Editar Instituição"
      open={open}
      okText="Salvar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onFinish}
      okButtonProps={{
        loading: institutionUpdateLoading,
      }}
      maskStyle={{
        backdropFilter: 'blur(8px)',
      }}
    >
      {contextHolder}
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Nome"
          name="name"
          rules={[
            {
              required: true,
              message: 'Insira o nome do instituição',
            },
            {
              min: 3,
              max: 100,
              message: 'Insira um nome entre 3 e 100 caracteres',
            },
          ]}
        >
          <Input disabled={isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
