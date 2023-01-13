import { useFormik } from 'formik';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Button, Flex } from '../../components';
import { Fieldset, Input, Label } from '../../components/Dialog';
import { InstitutionCreate } from '../../models/institution.model';
import { useCreateInstitutionMutation } from '../../services/institution.service';

interface CreateInstitutionProps {
  onClose: (open: boolean) => void;
}

export function CreateInstitution({ onClose }: CreateInstitutionProps) {
  const [createInstitution, { isLoading, isSuccess, isError }] = useCreateInstitutionMutation();
  const initialValues: InstitutionCreate = {
    name: '',
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      createInstitution(values);
    },
  });

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

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Fieldset>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" type="text" onChange={formik.handleChange} value={formik.values.name} />
      </Fieldset>
      <Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
        <Button color="green" isLoading={isLoading}>
          Salvar
        </Button>
      </Flex>
    </form>
  );
}
