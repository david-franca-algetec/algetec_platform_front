// noinspection JSIgnoredPromiseFromCall

import { Button, Card, Descriptions, Form, Grid, Input, message, Space } from 'antd';
import { useEffect } from 'react';
import { SidebarWithHeader } from '../../components';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { handleError, handleTypeName } from '../../helpers';
import { useUpdateUserMutation } from '../../services/user.service';

interface IFormValues {
  password: string;
  confirmPassword: string;
}

const { useBreakpoint } = Grid;
const { Item } = Descriptions;

export function ProfilePage() {
  const [toast, contextHolder] = message.useMessage();
  const user = useAppSelector(selectCurrentUser);
  const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();
  const screenSize = useBreakpoint();
  const [form] = Form.useForm<IFormValues>();

  const onFinish = (values: IFormValues) => {
    if (user) {
      updateUser({ id: user.id, password: values.password });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Senha atualizada com sucesso.');
      form.resetFields();
    }
    if (isError && error && 'data' in error) {
      const message = handleError(error);
      toast.error(message);
    }
  }, [isSuccess, isError, error]);

  return (
    <SidebarWithHeader>
      <Card title="Perfil">
        {contextHolder}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {user ? (
            <Descriptions bordered column={1} layout={screenSize.lg ? 'horizontal' : 'vertical'}>
              <Item label="Nome">{user.name}</Item>
              <Item label="E-mail">{user.email}</Item>
              <Item label="Equipe">{handleTypeName(user.department.name)}</Item>
              <Item label="Nível de Acesso">{user.role.name}</Item>
            </Descriptions>
          ) : null}
          <Card type="inner" title="Alterar Senha">
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item
                label="Nova Senha"
                name="password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Nova senha é obrigatória',
                  },
                  {
                    min: 6,
                    message: 'Nova senha precisa ter no mínimo 6 caracteres.',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirme a Senha"
                name="confirmPassword"
                hasFeedback
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Confirmação da senha é obrigatória.',
                  },
                  {
                    min: 6,
                    message: 'Confirmação da senha precisa ter no mínimo 6 caracteres.',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As duas senhas que você digitou não correspondem!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button htmlType="submit" type="primary" loading={isLoading}>
                  Salvar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Card>
    </SidebarWithHeader>
  );
}
