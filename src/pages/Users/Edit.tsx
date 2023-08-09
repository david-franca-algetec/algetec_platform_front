// noinspection JSIgnoredPromiseFromCall

import { Form, Input, message, Modal, Select } from 'antd';

import { orderBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { handleError, handleTypeName } from '../../helpers';
import { UserUpdate } from '../../models/user.model';
import { useGetDepartmentsQuery } from '../../services/department.service';
import { useGetRolesQuery } from '../../services/role.service';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../services/user.service';
import { EditProps } from '../types';

export function EditUser({ onClose, id, open }: EditProps) {
  const [toast, contextHolder] = message.useMessage();
  const { data: userData, isLoading } = useGetUserByIdQuery(id, {
    skip: !id,
  });
  const [updateUser, { isError, error, isSuccess, isLoading: userUpdateLoading }] = useUpdateUserMutation();
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
  const initialValues: UserUpdate = {
    id: 0,
    name: undefined,
    email: undefined,
    password: undefined,
    department_id: undefined,
    role_id: undefined,
  };

  const [form] = Form.useForm<UserUpdate>();

  const onFinish = async () => {
    const values = await form.validateFields();
    updateUser({ ...values, id });
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (userData && open) {
      form.setFieldsValue({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        department_id: userData.department_id,
        role_id: userData.role_id,
      });
    }
  }, [userData, open]);

  useEffect(() => {
    if (isError && error && 'data' in error) {
      toast.error(handleError(error));
    }
    if (isSuccess) {
      toast.success('Usuário atualizado com sucesso');
      form.resetFields();
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title="Editar Usuário"
      open={open}
      okText="Salvar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onFinish}
      okButtonProps={{
        loading: userUpdateLoading,
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
              message: 'O nome é obrigatório',
            },
            {
              min: 3,
              max: 100,
              message: 'O nome deve conter entre 3 e 100 caracteres',
            },
          ]}
        >
          <Input disabled={isLoading} />
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
          <Input disabled={isLoading} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Senha"
          rules={[
            {
              min: 6,
              max: 100,
              message: 'A senha deve conter entre 6 e 100 caracteres',
            },
          ]}
        >
          <Input.Password disabled={isLoading} />
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
            placeholder="Selecione um departamento"
            showSearch
            options={departmentOptions}
            disabled={isLoadingDepartments}
          />
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
          <Select
            placeholder="Selecione um nível de acesso"
            showSearch
            options={roleOptions}
            disabled={isLoadingRoles}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
