import { Checkbox, Indicator } from '@radix-ui/react-checkbox';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

import { styled } from '../../config/styles/stitches.config';

export const Sidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  height: '100vh',
});

export const Flex = styled('div', {
  display: 'flex',
});

export const Box = styled('div', {});

export const List = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const Li = styled('li', {
  padding: '10px 20px',
  cursor: 'pointer',
  transition: '$sm',

  '&:hover': {
    backgroundColor: '$violet8',
  },
});

export const StyledLink = styled(Link, {
  color: '$violet11',
  textDecoration: 'none',
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

export const Select = styled('select', {
  all: 'unset',
  width: '100%',
  height: '$lg',
  borderRadius: '$sm',
  border: '1px solid $grayA11',
  padding: '$sm',

  '& option': {
    all: 'unset',
    padding: '$sm',
  },
});

export const Input = styled('input', {
  all: 'unset',
  height: 40,
  borderRadius: '$sm',
  padding: '0 15px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  lineHeight: 1,
  gap: 5,
  backgroundColor: 'white',
  border: '1px solid $violet8',
  color: '$violet11',
  boxShadow: `0 2px 10px $blackA7`,

  '&:hover': { backgroundColor: '$mauve3' },
  '&:disabled': {
    backgroundColor: '$violet3',
    color: '$violet11',
    pointerEvents: 'none',
  },
});

export const FileImage = styled('div', {
  all: 'unset',
  width: '100%',
  height: 'fit-content',
  borderRadius: '$sm',
  border: `1px solid $grayA11`,
  padding: '$sm',
  backgroundColor: '$violet2',
  position: 'relative',
});

export const Image = styled('img', {
  all: 'unset',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '$sm',
});

const StyledCheckbox = styled(Checkbox, {
  all: 'unset',
  backgroundColor: 'white',
  width: 25,
  height: 25,
  border: `1px solid $blackA7`,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 2px 10px $blackA7`,
  '&:hover': { backgroundColor: '$violet4' },
  '&:focus': { boxShadow: `0 0 0 2px black` },
});

const StyledIndicator = styled(Indicator, {
  color: '$violet11',
});

// Exports
export const CheckboxComponent = StyledCheckbox;
export const CheckboxIndicator = StyledIndicator;

export const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  borderRadius: '4px',
});

export const Thead = styled('thead', {
  backgroundColor: '$violet2',
});

export const Tbody = styled('tbody', {
  backgroundColor: '$violet1',
});

export const Tr = styled('tr', {
  '&:nth-child(odd)': {
    backgroundColor: '$violet3',
  },

  '&:nth-child(even)': {
    backgroundColor: '$violet4',
  },

  '&:hover': {
    backgroundColor: '$violet6',
  },
});

export const Th = styled('th', {
  padding: '$sm',
  textAlign: 'start',
});

export const Td = styled('td', {
  padding: '$sm',
  textAlign: 'start',
});

export const CheckboxContainer = styled(Checkbox, {
  all: 'unset',
  backgroundColor: '$gray6',
  width: '$md',
  height: '$md',
  borderRadius: '$sm',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '5px',
  left: '5px',
  cursor: 'pointer',
  boxShadow: '$md',
  '&:hover': { backgroundColor: '$cyan6' },
  '&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-state="checked"]': {
    backgroundColor: 'cyan9',
  },
});

export const CheckIconStyled = styled(CheckIcon, {
  color: 'green',
  width: '$md',
  height: '$md',
});

export const CrossIconStyled = styled(Cross2Icon, {
  color: 'red',
  width: '$md',
  height: '$md',
});

export const Text = styled('p', {
  fontSize: '$md',
  fontWeight: '$bold',
  color: '$violet11',
  margin: '$sm',

  variants: {
    size: {
      small: {
        fontSize: '$md',
      },
      medium: {
        fontSize: '$md',
      },
      large: {
        fontSize: '$lg',
      },
    },
  },
});

export const Logo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '20px 50px 50px 50px',
});

export const FormContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  width: '100%',
  marginBottom: '10px',
});

export const CardDashboard = styled('div', {
  display: 'flex',
  flex: '23%',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '25%',
  padding: '$lg',
  backgroundColor: '$mauve4',
  borderRadius: '$sm',
  margin: '$sm',
  boxShadow: '$md',

  '&:hover': {
    boxShadow: '$lg',
  },

  '& a': {
    textDecoration: 'none',
    color: 'inherit',
  },
});
