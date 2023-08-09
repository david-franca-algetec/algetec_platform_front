// noinspection JSIgnoredPromiseFromCall

import { Form, Input, message, Modal, Select } from 'antd';

import { orderBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { handleError, handleTypeName } from '../../helpers';
import { UserCreate } from '../../models/user.model';
import { useGetDepartmentsQuery } from '../../services/department.service';
import { useGetRolesQuery } from '../../services/role.service';
import { useStoreUserMutation } from '../../services/user.service';
import { CreateProps } from '../types';

export function CreateUser({ onClose, open }: CreateProps) {
  const [storeUser, { isError, isLoading, isSuccess, error }] = useStoreUserMutation();
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();

  const roleOptions = useMemo(
    () => (rolesData ? orderBy(rolesData, 'name').map((role) => ({ label: role.name, value: role.id })) : []),
    [rolesData],
  );

  const departmentOptions = useMemo(
    () =>
      departmentsData
        ? orderBy(departmentsData, 'name').map((department) => ({
            label: handleTypeName(department.name),
            value: department.id,
          }))
        : [],
    [departmentsData],
  );

  const initialValues: UserCreate = {
    name: '',
    email: '',
    password: '',
    department_id: 0,
    role_id: 0,
  };

  const [form] = Form.useForm<UserCreate>();

  const [toast, contextHolder] = message.useMessage();

  const onFinish = async () => {
    const values = await form.validateFields();
    storeUser(values);
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
      toast.success('Usuário criado com sucesso');
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title="Adicionar Usuário"
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
      <Form
        form={form}
        layout="vertical"
        initialValues={{ ...initialValues, role_id: undefined, department_id: undefined }}
      >
        <Form.Item
          name="name"
          label="Nome"
          rules={[
            {
              required: true,
              message: 'O nome é obrigatório',
            },
            {
              min: 3,
              max: 100,
              message: 'O nome deve conter entre 3 e 100 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: 'O email é obrigatório',
            },
            {
              type: 'email',
              message: 'Email inválido',
            },
            {
              min: 3,
              max: 100,
              message: 'O email deve conter entre 3 e 100 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Senha"
          rules={[
            {
              required: true,
              message: 'A senha é obrigatória',
            },
            {
              min: 6,
              max: 100,
              message: 'A senha deve conter entre 6 e 100 caracteres',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role_id"
          label="Nível de Acesso"
          rules={[
            {
              required: true,
              message: 'O nível de acesso é obrigatório',
            },
            {
              type: 'number',
              message: 'O nível de acesso deve ser um número',
            },
          ]}
        >
          <Select placeholder="Selecione um nível de acesso" options={roleOptions} disabled={isLoadingRoles} />
        </Form.Item>
        <Form.Item
          name="department_id"
          label="Departamento"
          rules={[
            {
              required: true,
              message: 'O departamento é obrigatório',
            },
            {
              type: 'number',
              message: 'O departamento deve ser um número',
            },
          ]}
        >
          <Select
            value={1}
            placeholder="Selecione um departamento"
            options={departmentOptions}
            disabled={isLoadingDepartments}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
