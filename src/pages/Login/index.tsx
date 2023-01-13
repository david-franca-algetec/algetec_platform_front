import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import { Button, Text } from '../../components';
import { LoginRequest, useLoginMutation } from '../../services/auth.service';
import logoBranca from '../../assets/logo-branca.png';
import {
  Container,
  Flex,
  FormContainer,
  FormInput,
  FormLabel,
  FormStyled,
  Image,
  ImageContainer,
  Sidebar,
} from './style';

export function LoginPage() {
  const [login, { isLoading, isSuccess, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };
  const validationSchema = object({
    email: string().email().required('E-mail é obrigatório'),
    password: string().required('Senha é obrigatória'),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: login,
  });

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();
      toast.success('Login realizado com sucesso');
      navigate('/dashboard');
    } else if (isError) {
      toast.error('Erro ao realizar login');
    }
  }, [isSuccess, isError]);

  return (
    <Container>
      <Flex>
        <Sidebar>
          <ImageContainer>
            <Image src={logoBranca} alt="Logo Branca" />
          </ImageContainer>
          <Text color="white" weight="bold" align="center">
            LOGIN
          </Text>
        </Sidebar>

        <FormStyled noValidate onSubmit={formik.handleSubmit}>
          <FormContainer>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              placeholder="Digite seu email"
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
          </FormContainer>
          <FormContainer>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <FormInput
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
          </FormContainer>
          {/* <Helpers>
            <Text color="black" size="normal">
              Esqueceu sua senha?
              <Anchor href="/recover">Clique aqui</Anchor>
            </Text>
          </Helpers> */}
          <Flex
            css={{
              width: '100%',
              justifyContent: 'flex-end',
              margin: '$sm',
            }}
          >
            <Button color="cyan" type="submit" isLoading={isLoading}>
              Login
            </Button>
          </Flex>
          {/* <Helpers>
            <Text color="black" size="normal">
              Não tem conta?
              <Anchor href="/register">Cadastrar</Anchor>
            </Text>
          </Helpers> */}
        </FormStyled>
      </Flex>
    </Container>
  );
}
