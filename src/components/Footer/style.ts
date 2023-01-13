import { Link as RouterLink } from 'react-router-dom';

import { styled } from '../../config/styles/stitches.config';

export const FooterContainer = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  padding: '50px 25px',
  backgroundColor: '#556F83',
  color: '#E1E1E1',

  '@sm': {
    padding: '50px 0',
  },
});

export const Section = styled('section', {
  display: 'flex',
  flexDirection: 'row',
  paddingBottom: '40px',

  '@sm': {
    flexDirection: 'column',
    paddingBottom: '0',
  },
});

export const Info = styled('div', {
  paddingRight: '50px',
  fontWeight: '$regular',
  lineHeight: '150%',

  '@sm': {
    padding: '0px 0px 20px 25px',
  },
});

export const Image = styled('img', {
  maxWidth: '120px',
  height: 'auto',
  width: '100%',
  marginBottom: '20px',

  '@sm': {
    maxWidth: '180px',
  },
});

export const Box = styled('div', {});

export const Paragraph = styled('p', {
  marginBottom: '10px',
  fontWeight: '$black',
  textTransform: 'uppercase',
});

export const UnorderedList = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  fontWeight: '$regular',
  lineHeight: '200%',
});

export const NewsLetter = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '40px',
  backgroundColor: '#37444e',
  marginTop: '$sm',
  marginLeft: '$lg',

  '@sm': {
    marginTop: '0',
    marginLeft: '0',
  },
});

export const Copyright = styled('section', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '20px',
  fontWeight: '$regular',
  lineHeight: '150%',

  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',

    '& p': {
      marginBottom: '20px',
      textAlign: 'center',
    },
  },
});

export const Language = styled('div', {
  border: '1px solid #E1E1E1',
  borderRadius: '$md',
  padding: '$md',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Select = styled('select', {
  border: 'none',
  backgroundColor: 'transparent',
  color: '#E1E1E1',

  '& option': {
    backgroundColor: '#37444e',
    color: '#E1E1E1',
    margin: '5px',
  },
});

export const Link = styled(RouterLink, {
  color: '#E1E1E1',
  textDecoration: 'none',
  fontWeight: '$regular',
  lineHeight: '150%',
  '&:hover': {
    color: '#E1E1E1',
    textDecoration: 'underline',
  },
});
