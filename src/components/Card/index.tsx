import { styled } from '../../config/styles/stitches.config';

export const Card = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'fit-content',
  boxShadow: '$xxl',
  backgroundColor: '$gray1',
  borderRadius: '$lg',
  padding: '$md',
  boxSizing: 'border-box',
});
