import { useFormik } from 'formik';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button, Center, Flex, Spinner } from '../../components';
import { Fieldset, Input, Label } from '../../components/Dialog';
import { Select } from '../../components/Select';
import { UserUpdate } from '../../models/user.model';
import { useGetDepartmentsQuery } from '../../services/department.service';
import { useGetRolesQuery } from '../../services/role.service';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../services/user.service';

interface EditUserProps {
  onClose: (open: boolean) => void;
  id: number;
}

export function EditUser({ onClose, id }: EditUserProps) {
  const { data: userData, isLoading } = useGetUserByIdQuery(id, {
    skip: !id,
  });
  const [updateUser, { isError, isSuccess, isLoading: userUpdateLoading }] = useUpdateUserMutation();
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();

  const roleOptions = useMemo(
    () =>
      rolesData
        ? [
            { label: 'Selecione um nível de acesso', value: '0' },
            ...rolesData.map((role) => ({ label: role.name, value: role.id.toString() })),
          ]
        : [],
    [rolesData],
  );

  const departmentOptions = useMemo(
    () =>
      departmentsData
        ? [
            { label: 'Selecione um departamento', value: '0' },
            ...departmentsData.map((department) => ({ label: department.name, value: department.id.toString() })),
          ]
        : [],
    [departmentsData],
  );
  const initialValues: UserUpdate = {
    id: 0,
    name: '',
    email: '',
    password: undefined,
    department_id: 0,
    role_id: 0,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (values.password === '') {
        // eslint-disable-next-line no-param-reassign
        delete values.password;
      }
      updateUser(values);
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: '',
        department_id: userData.department_id,
        role_id: userData.role_id,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao atualizar usuário');
    }
    if (isSuccess) {
      formik.resetForm();
      toast.success('Usuário atualizado com sucesso');
      onClose(true);
    }
  }, [isError, isSuccess]);

  if (isLoading) {
    return (
      <Center css={{ width: '100%' }}>
        <Spinner />
      </Center>
    );
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Fieldset>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" type="text" onChange={formik.handleChange} value={formik.values.name} />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="department_id">Departamento</Label>
        <Select
          value={formik.values.department_id?.toString()}
          onValueChange={(value) => {
            formik.setFieldValue('department_id', value);
          }}
          items={departmentOptions}
          disabled={isLoadingDepartments}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="role_id">Nível de Acesso</Label>
        <Select
          value={formik.values.role_id?.toString()}
          onValueChange={(value) => {
            formik.setFieldValue('role_id', value);
          }}
          items={roleOptions}
          disabled={isLoadingRoles}
        />
      </Fieldset>
      <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
        <Button type="submit" color="green" isLoading={userUpdateLoading}>
          Salvar
        </Button>
      </Flex>
    </form>
  );
}
