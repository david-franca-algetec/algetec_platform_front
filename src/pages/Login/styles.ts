import { CSSProperties } from 'react';

const layout: CSSProperties = {
  background: 'radial-gradient(50% 50% at 50% 50%, #42386a 0%, #0c0438 100%)',
  backgroundSize: 'cover',
};

const container: CSSProperties = {
  maxWidth: '408px',
  margin: 'auto',
};

const title: CSSProperties = {
  textAlign: 'center',
  fontSize: '30px',
  letterSpacing: '-0.04em',
};

const imageContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
};

export { layout, container, title, imageContainer };
