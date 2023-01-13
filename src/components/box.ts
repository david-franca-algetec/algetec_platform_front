import { styled } from '../config/styles/stitches.config';

export const Box = styled('div', {});

export const Flex = styled('div', {
  display: 'flex',
});

export const Grid = styled('div', {
  display: 'grid',
});

export const Stack = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const Inline = styled('div', {
  display: 'flex',
  flexDirection: 'row',
});

export const Center = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$lg',
});

export const AbsoluteCenter = styled('div', {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

export const Container = styled('div', {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 16px',
});
