import { useFormik } from 'formik';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Button, Center, Flex, Spinner } from '../../components';
import { Fieldset, Input, Label } from '../../components/Dialog';
import { InstitutionUpdate } from '../../models/institution.model';
import { useGetInstitutionQuery, useUpdateInstitutionMutation } from '../../services/institution.service';

interface EditClientProps {
  onClose: (open: boolean) => void;
  id: number;
}

export function EditClient({ onClose, id }: EditClientProps) {
  const { data: institutionData, isLoading } = useGetInstitutionQuery(id, { skip: !id });
  const [updateInstitution, { isLoading: userUpdateLoading, isSuccess, isError }] = useUpdateInstitutionMutation();
  const initialValues: InstitutionUpdate = {
    id: 0,
    name: 'Teste',
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      updateInstitution(values);
    },
  });

  useEffect(() => {
    if (institutionData) {
      formik.setValues({
        id: institutionData[0].id,
        name: institutionData[0].name,
      });
    }
  }, [institutionData]);

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao criar instituição');
    }
    if (isSuccess) {
      formik.resetForm();
      toast.success('Instituição criada com sucesso');
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
      <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
        <Button color="green" isLoading={userUpdateLoading}>
          Salvar
        </Button>
      </Flex>
    </form>
  );
}
