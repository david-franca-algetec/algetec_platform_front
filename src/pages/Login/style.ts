import { Link } from 'react-router-dom';

import { styled } from '../../config/styles/stitches.config';

const url =
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d6d8db' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

export const Container = styled('div', {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(180deg, rgba(187, 36, 62, 0.2) 0%, rgba(255,255,255, 1) 100% ), url("${url}")`,
});

export const Flex = styled('div', {
  display: 'flex',
});

export const Sidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #00CAD2 0%, #189FAC 100%), #189FAC',

  '@sm': {
    display: 'none',
  },
});

export const ImageContainer = styled('div', {
  height: '50%',
  paddingTop: '$xl',
});

export const Image = styled('img', {
  height: '1.5rem',
  width: 'auto',
  padding: '0 $xl 0 $xl',
  alignSelf: 'flex-start',
});

export const Text = styled('p', {
  color: '#FFFFFF',
  fontSize: '$normal',
  fontWeight: '$bold',
  height: '50%',
  textAlign: 'center',
  lineHeight: '1.5rem',

  variants: {
    color: {
      white: {
        color: '#FFFFFF',
      },
      black: {
        color: '#000000',
      },
    },
    weight: {
      bold: {
        fontWeight: '$bold',
      },
      normal: {
        fontWeight: '$normal',
      },
    },
  },
});

export const FormStyled = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$xl $xxl',
  backgroundColor: '#FFFFFF',

  '@sm': {
    width: '100%',
  },
});

export const FormContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '$md',
});

export const FormLabel = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100%',
  paddingRight: '20px',
  fontWeight: '$regular',
  lineHeight: '150%',
  fontSize: '$normal',
  textTransform: 'uppercase',
});

export const FormInput = styled('input', {
  padding: '10px',
  border: '1px solid transparent',
  borderBottomColor: '#E1E1E1',
  backgroundColor: 'transparent',
  opacity: '0.5',
  margin: '$sm',

  '&:focus': {
    outline: 'none',
    borderBottomColor: '$cyan11',
  },

  '&:hover': {
    borderBottomColor: '$cyan11',
  },
});

export const Helpers = styled('div', {
  fontSize: '$small',
  margin: '$sm $md',
});

export const Anchor = styled(Link, {
  color: '$cyan11',
  textDecoration: 'none',
  fontWeight: '$bold',
  cursor: 'pointer',
  paddingLeft: '$sm',

  '&:hover': {
    textDecoration: 'underline',
  },
});
