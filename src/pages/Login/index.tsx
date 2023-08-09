// noinspection JSIgnoredPromiseFromCall

import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Image,
  Input,
  Layout,
  message,
  Row,
  Space,
  theme,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import logoBranca from '../../assets/logo-branca.png';
import { useAppSelector } from '../../config/hooks';
import { handleError, testEnvironment } from '../../helpers';
import { LoginRequest, useLoginMutation } from '../../services/auth.service';
import { container, imageContainer, layout, title } from './styles';

const { Title } = Typography;

export function LoginPage() {
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const [captcha, setCaptcha] = useState<string | null>();
  const [test, setTest] = useState(false);
  const navigate = useNavigate();
  const [toast, contextHolder] = message.useMessage();
  const { isDarkMode } = useAppSelector((state) => state.auth);
  const secret = useMemo(() => import.meta.env.VITE_SITE_KEY, []);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [form] = Form.useForm<LoginRequest>();

  const CardTitle = (
    <Title level={3} style={title}>
      Entrar na sua conta
    </Title>
  );

  const onFinish = async (values: LoginRequest) => {
    // if (captcha) {
    //   const ip = await fetch('https://api.ipify.org/?format=json')
    //     .then((res) => res.json())
    //     .then((data: { ip: string }) => data.ip);
    // }
    login(values);
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      navigate('/dashboard');
    }
    if (isError && error && 'data' in error) {
      const message = handleError(error);
      toast.error(message);
    }
  }, [isSuccess, isError, error]);

  useEffect(() => {
    if (testEnvironment() === 'local') {
      setTest(true);
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout style={layout}>
        {contextHolder}
        <Row
          justify="center"
          align="middle"
          style={{
            height: '100vh',
          }}
        >
          <Col xs={22}>
            <div style={container}>
              <div style={imageContainer}>
                <Image width={200} preview={false} src={logoBranca} alt="Algetec Logo" />
              </div>

              <Card title={CardTitle} headStyle={{ borderBottom: 0 }}>
                <Form<LoginRequest> layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                  <Form.Item
                    name="email"
                    label="E-mail"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'E-mail é obrigatório',
                      },
                      {
                        type: 'email',
                        message: 'E-mail inválido',
                      },
                    ]}
                  >
                    <Input data-cy="email" size="large" placeholder="E-mail" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Senha"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Senha é obrigatória',
                      },
                      {
                        min: 6,
                        max: 100,
                        message: 'Senha deve conter entre 6 e 100 caracteres',
                      },
                    ]}
                    style={{ marginBottom: '12px' }}
                  >
                    <Input.Password data-cy="password" placeholder="●●●●●●●●" size="large" />
                  </Form.Item>
                  {!test ? (
                    <Space align="center" direction="vertical" style={{ width: '100%', paddingTop: 8 }}>
                      <ReCAPTCHA theme={isDarkMode ? 'dark' : 'light'} sitekey={secret} onChange={setCaptcha} />
                    </Space>
                  ) : null}

                  <Button
                    style={{ marginTop: 16 }}
                    data-cy="submit"
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    disabled={!captcha && !test}
                    loading={isLoading}
                  >
                    Entrar
                  </Button>
                </Form>
              </Card>
            </div>
          </Col>
        </Row>
      </Layout>
    </ConfigProvider>
  );
}
