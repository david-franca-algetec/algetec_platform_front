import { styled } from '../../config/styles/stitches.config';

export const Input = styled('input', {
  all: 'unset',
  width: 'fit-content',
  height: '$lg',
  borderRadius: '$sm',
  border: '1px solid $mauve11',
  padding: '$sm',
});

export const Label = styled('label', {
  all: 'unset',
  fontSize: '$md',
  lineHeight: 1,
  userSelect: 'none',
  fontWeight: '$bold',
  marginRight: '$sm',
  color: '$violet11',
});

export const FormContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  marginBottom: '10px',
});

export const Form = styled('form', {
  all: 'unset',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  margin: '$md',
});
