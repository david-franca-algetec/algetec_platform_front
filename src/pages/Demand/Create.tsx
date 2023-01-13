import 'react-datepicker/dist/react-datepicker.css';

import { useFormik } from 'formik';
import { useEffect, useMemo } from 'react';
import SelectComponent from 'react-select';
import { toast } from 'react-toastify';

import { Button, Center, DashboardComponent, Inline, Title } from '../../components';
import { Card } from '../../components/Card';
import { Form } from '../../components/Dashboard/styles';
import { DatePickerMulti } from '../../components/Datepicker';
import { Select } from '../../components/Select';
import { Separator } from '../../components/Separator';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { numberOfBusinessDays } from '../../helpers/isBusinessDay';
import { DemandCreate } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { useGetExperimentsQuery, useStoreDemandMutation } from '../../services/demands.service';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { useGetUsersQuery } from '../../services/user.service';
import { FormContainer, Input, Label } from '../Dashboard/styles';

export default function CreateDemandPage() {
  const { data: institutions, isLoading: institutionsLoading } = useGetInstitutionsQuery();
  const { data: experiments, isLoading: experimentsLoading } = useGetExperimentsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const [storeDemand, { isLoading: storeDemandLoading, isSuccess: storeDemandSuccess, isError: storeDemandError }] =
    useStoreDemandMutation();

  const users = useMemo(() => {
    if (usersData) {
      return usersData.map((user) => ({
        value: user.id,
        label: user.name,
      }));
    }
    return [];
  }, [usersData]);

  const selectComponentsStyles = useMemo(
    () => ({
      minHeight: 40,
      width: '100%',
      borderColor: 'inherit',
      border: '1px solid #aa99ec',
      padding: '0 10px',
      color: '#5746af',
    }),
    [],
  );

  const currentUser = useAppSelector(selectCurrentUser);

  const initialValues: DemandCreate = {
    institution_id: 0,
    experiment_id: 0,
    status: DemandStatus.DEVELOPMENT,
    logger_id: currentUser ? currentUser.id : 0,
    testing_deadline: 0,
    testing_finishedAt: '',
    testing_startedAt: '',
    testing_developers: [],
    coding_deadline: 0,
    coding_finishedAt: '',
    coding_startedAt: '',
    coding_developers: [],
    scripting_deadline: 0,
    scripting_finishedAt: '',
    scripting_startedAt: '',
    scripting_developers: [],
    ualab_deadline: 0,
    ualab_finishedAt: '',
    ualab_startedAt: '',
    ualab_developers: [],
    modeling_deadline: 0,
    modeling_finishedAt: '',
    modeling_startedAt: '',
    modeling_developers: [],
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const demand: DemandCreate = {
        ...values,
        testing_startedAt: new Date(values.testing_startedAt).toISOString(),
        testing_finishedAt: new Date(values.testing_finishedAt).toISOString(),
        coding_startedAt: new Date(values.coding_startedAt).toISOString(),
        coding_finishedAt: new Date(values.coding_finishedAt).toISOString(),
        scripting_startedAt: new Date(values.scripting_startedAt).toISOString(),
        scripting_finishedAt: new Date(values.scripting_finishedAt).toISOString(),
        ualab_startedAt: new Date(values.ualab_startedAt).toISOString(),
        ualab_finishedAt: new Date(values.ualab_finishedAt).toISOString(),
        modeling_startedAt: new Date(values.modeling_startedAt).toISOString(),
        modeling_finishedAt: new Date(values.modeling_finishedAt).toISOString(),
      };

      storeDemand(demand);
    },
  });

  const statusOptions = useMemo(
    () => [
      { value: DemandStatus.DEVELOPMENT, label: 'Desenvolvimento' },
      { value: DemandStatus.CORRECTION, label: 'Correção' },
      { value: DemandStatus.READY, label: 'Pronto' },
      { value: DemandStatus.REVALIDATION, label: 'Revalidação' },
      { value: DemandStatus.VALIDATION, label: 'Validação' },
    ],
    [DemandStatus],
  );
  const institutionOptions = useMemo(
    () =>
      institutions
        ? [
            { value: '0', label: 'Selecione uma instituição' },
            ...institutions.map((institution) => ({
              value: institution.id.toString(),
              label: institution.name,
            })),
          ]
        : [],
    [institutions],
  );
  const experimentOptions = useMemo(
    () =>
      experiments
        ? experiments.map((experiment) => ({
            value: experiment.id.toString(),
            label: `${experiment.id} - ${experiment.name}`,
          }))
        : [],
    [experiments],
  );

  const ualabDeadline = useMemo(() => {
    if (formik.values.ualab_startedAt && formik.values.ualab_finishedAt) {
      const deadline = numberOfBusinessDays(
        new Date(formik.values.ualab_startedAt),
        new Date(formik.values.ualab_finishedAt),
      );
      formik.setFieldValue('ualab_deadline', deadline);
      return deadline;
    }
    return 0;
  }, [formik.values.ualab_startedAt, formik.values.ualab_finishedAt]);

  const codingDeadline = useMemo(() => {
    if (formik.values.coding_startedAt && formik.values.coding_finishedAt) {
      const deadline = numberOfBusinessDays(
        new Date(formik.values.coding_startedAt),
        new Date(formik.values.coding_finishedAt),
      );
      formik.setFieldValue('coding_deadline', deadline);
      return deadline;
    }
    return 0;
  }, [formik.values.coding_startedAt, formik.values.coding_finishedAt]);

  const modelingDeadline = useMemo(() => {
    if (formik.values.modeling_startedAt && formik.values.modeling_finishedAt) {
      const deadline = numberOfBusinessDays(
        new Date(formik.values.modeling_startedAt),
        new Date(formik.values.modeling_finishedAt),
      );
      formik.setFieldValue('modeling_deadline', deadline);
      return deadline;
    }
    return 0;
  }, [formik.values.modeling_startedAt, formik.values.modeling_finishedAt]);

  const testingDeadline = useMemo(() => {
    if (formik.values.testing_startedAt && formik.values.testing_finishedAt) {
      const deadline = numberOfBusinessDays(
        new Date(formik.values.testing_startedAt),
        new Date(formik.values.testing_finishedAt),
      );
      formik.setFieldValue('testing_deadline', deadline);
      return deadline;
    }
    return 0;
  }, [formik.values.testing_startedAt, formik.values.testing_finishedAt]);

  const scriptingDeadline = useMemo(() => {
    if (formik.values.scripting_startedAt && formik.values.scripting_finishedAt) {
      const deadline = numberOfBusinessDays(
        new Date(formik.values.scripting_startedAt),
        new Date(formik.values.scripting_finishedAt),
      );
      formik.setFieldValue('scripting_deadline', deadline);
      return deadline;
    }
    return 0;
  }, [formik.values.scripting_startedAt, formik.values.scripting_finishedAt]);

  useEffect(() => {
    if (storeDemandError) {
      toast.error('Erro ao cadastrar demanda');
    }
    if (storeDemandSuccess) {
      toast.success('Demanda cadastrada com sucesso');
      formik.resetForm();
    }
  }, [storeDemandError, storeDemandSuccess]);

  return (
    <DashboardComponent>
      <Form
        noValidate
        onSubmit={formik.handleSubmit}
        css={{
          gap: '$md',
        }}
      >
        <Title size="extraLarge">Criar Demanda</Title>
        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Informações da demanda</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => {
                  formik.setFieldValue('status', value);
                }}
                items={statusOptions}
              />
            </FormContainer>

            <FormContainer>
              <Label htmlFor="institution_id">Instituição</Label>
              <Select
                disabled={institutionsLoading}
                value={formik.values.institution_id.toString()}
                onValueChange={(value) => {
                  formik.setFieldValue('institution_id', value);
                }}
                items={institutionOptions}
              />
            </FormContainer>

            <FormContainer>
              <Label htmlFor="experiment_id">Prática</Label>
              {/* <Select
                disabled={experimentsLoading}
                value={formik.values.experiment_id.toString()}
                onValueChange={(value) => {
                  formik.setFieldValue('experiment_id', value);
                }}
                items={experimentOptions}
              /> */}
              <SelectComponent
                placeholder="Selecione uma prática"
                isClearable
                isSearchable
                isDisabled={experimentsLoading}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                    color: '#5746af',
                  }),
                }}
                options={experimentOptions}
                onChange={(value) => {
                  formik.setFieldValue('experiment_id', value?.value);
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">UALAB</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="ualab_startedAt">Prazo</Label>
              <DatePickerMulti
                id="ualab_startedAt"
                getStartDate={(date) => {
                  formik.setFieldValue('ualab_startedAt', date.getTime());
                }}
                getEndDate={(date) => {
                  formik.setFieldValue('ualab_finishedAt', date.getTime());
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="ualab_deadline">Dias</Label>
              <Input id="ualab_deadline" type="number" value={ualabDeadline} readOnly disabled />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="ualab_developers">Desenvolvedores</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                isDisabled={usersLoading}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                    color: '#5746af',
                  }),
                }}
                options={users}
                onChange={(value) => {
                  formik.setFieldValue(
                    'ualab_developers',
                    value.map((item) => item.value),
                  );
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Roteirização</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="scripting_startedAt">Prazo</Label>
              <DatePickerMulti
                id="scripting_startedAt"
                getStartDate={(date) => {
                  formik.setFieldValue('scripting_startedAt', date.getTime());
                }}
                getEndDate={(date) => {
                  formik.setFieldValue('scripting_finishedAt', date.getTime());
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="scripting_deadline">Dias</Label>
              <Input id="scripting_deadline" type="number" value={scriptingDeadline} readOnly disabled />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="scripting_developers">Desenvolvedores</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                  }),
                }}
                options={users}
                onChange={(value) => {
                  formik.setFieldValue(
                    'scripting_developers',
                    value.map((item) => item.value),
                  );
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Modelagem</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="modeling_startedAt">Prazo</Label>
              <DatePickerMulti
                id="modeling_startedAt"
                getStartDate={(date) => {
                  formik.setFieldValue('modeling_startedAt', date.getTime());
                }}
                getEndDate={(date) => {
                  formik.setFieldValue('modeling_finishedAt', date.getTime());
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="modeling_deadline">Dias</Label>
              <Input id="modeling_deadline" type="number" value={modelingDeadline} readOnly disabled />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="modeling_developers">Desenvolvedores</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                  }),
                }}
                options={users}
                onChange={(value) => {
                  formik.setFieldValue(
                    'modeling_developers',
                    value.map((item) => item.value),
                  );
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Programação</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="coding_startedAt">Prazo</Label>
              <DatePickerMulti
                id="coding_startedAt"
                getStartDate={(date) => {
                  formik.setFieldValue('coding_startedAt', date.getTime());
                }}
                getEndDate={(date) => {
                  formik.setFieldValue('coding_finishedAt', date.getTime());
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="coding_deadline">Dias</Label>
              <Input id="coding_deadline" type="number" value={codingDeadline} readOnly disabled />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="coding_developers">Desenvolvedores</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                  }),
                }}
                options={users}
                onChange={(value) => {
                  formik.setFieldValue(
                    'coding_developers',
                    value.map((item) => item.value),
                  );
                }}
              />
            </FormContainer>
          </Inline>
        </Card>

        <Card
          css={{
            width: '100%',
          }}
        >
          <Title size="large">Testes</Title>
          <Separator />
          <Inline
            css={{
              width: '100%',
              justifyContent: 'space-between',
              gap: '$md',
            }}
          >
            <FormContainer>
              <Label htmlFor="testing_startedAt">Prazo</Label>
              <DatePickerMulti
                id="testing_startedAt"
                getStartDate={(date) => {
                  formik.setFieldValue('testing_startedAt', date.getTime());
                }}
                getEndDate={(date) => {
                  formik.setFieldValue('testing_finishedAt', date.getTime());
                }}
              />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="testing_deadline">Dias</Label>
              <Input id="testing_deadline" type="number" value={testingDeadline} readOnly disabled />
            </FormContainer>
            <FormContainer>
              <Label htmlFor="testing_developers">Desenvolvedores</Label>
              <SelectComponent
                placeholder="Selecione um responsável"
                isMulti
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...selectComponentsStyles,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: '90%',
                  }),
                }}
                options={users}
                onChange={(value) => {
                  formik.setFieldValue(
                    'testing_developers',
                    value.map((item) => item.value),
                  );
                }}
              />
            </FormContainer>
          </Inline>
        </Card>
        <Center>
          <Button type="submit" color="green" isLoading={storeDemandLoading}>
            <span>Salvar</span>
          </Button>
        </Center>
      </Form>
    </DashboardComponent>
  );
}
