import { styled } from '../../config/styles/stitches.config';

export const HeaderContainer = styled('header', {
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  width: 'calc(85vw - 17px)',
  padding: '$md',
  background: 'linear-gradient(90deg, $mauve5 0%, $mauve2 100%)',
});

export const HeaderContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  width: '100%',

  '@sm': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export const P = styled('p', {
  fontSize: '$normal',
  fontWeight: '$bold',
  marginBottom: '$sm',
});

export const HeaderSection = styled('section', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '@sm': {
    flexDirection: 'row',
  },
});

export const HeaderForm = styled('form', {
  display: 'flex',
  justifyContent: 'space-between',
  width: '300px',
  border: '1px solid',
  borderRadius: '20px',
  marginRight: '$sm',

  '@sm': {
    width: '100%',
  },
});

export const HeaderInput = styled('input', {
  background: 'transparent',
  margin: 0,
  padding: '7px 8px',
  fontSize: '14px',
  color: 'inherit',
  borderRadius: 'inherit',
  width: '100%',
  border: '1px solid transparent',

  '&:focus': {
    outline: 'none',
  },

  '&::placeholder': {
    color: '$mauve10',
  },

  '&:focus::placeholder': {
    color: 'transparent',
  },
});

export const SearchButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  width: '30px',
  padding: 0,
  margin: 0,
  border: 'none',
  borderRadius: 'inherit',
  background: 'transparent',
  cursor: 'pointer',
  opacity: 0.7,
  transition: '$default',

  '&:hover': {
    opacity: 1,
  },

  '& svg': {
    width: '60%',
    height: '60%',
  },

  '&:focus': {
    outline: 'none',
  },
});

export const HeaderButtons = styled('div', {
  display: 'flex',
  borderRadius: '25px',
});

export const HeaderButton = styled('button', {
  border: '1px solid',
  background: 'none',
  padding: '9px',
  transition: '$default',
  borderColor: '$mauve12',

  '&:first-child': {
    borderRadius: '25px 0px 0px 25px',
  },

  '&:last-child': {
    borderRadius: '0px 25px 25px 0px',
  },

  '& a': {
    textDecoration: 'none',
    color: 'inherit',
  },

  '&:hover': {
    background: '$blue6',
    borderColor: '$blue9',
  },

  variants: {
    isHome: {
      true: {
        background: '$blue6',
        borderColor: '$blue9',
      },
    },
  },
});

export const HeaderLoginArea = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '5px',

  '@sm': {
    paddingTop: '15px',
  },
});

export const HeaderUser = styled('div', {
  padding: '15px',
  boxShadow: '$md',
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: 'none',
});

export const HeaderBreadcrumb = styled('div', {
  '& span': {
    fontSize: '$normal',
    fontWeight: '$regular',
  },
});

export const HeaderUserTitle = styled('p', {
  marginRight: '15px',
  userSelect: 'none',
});

export const Box = styled('div', {});

export const UserMenu = styled('div', {
  display: 'none',
  width: '100%',
  flexDirection: 'column',
  position: 'absolute',
  top: '100%',
  left: 0,
  boxShadow: '$md',
  // padding: '10px',
  zIndex: 1,
  background: '$mauve4',
});

export const UserMenuItem = styled('button', {
  border: 'none',
  background: 'none',
  padding: '15px',
  transition: 'background 200ms',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '10px',

  '&:hover': {
    background: '$blue6',
    color: '$blue9',

    ' & svg': {
      color: '$blue9',
    },
  },
});
