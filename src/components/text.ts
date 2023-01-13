import { styled } from '../config/styles/stitches.config';

export const Text = styled('p', {
  fontSize: '$normal',
  fontWeight: '$regular',
  color: '$violet11',
  width: '100%',
  textAlign: 'start',
  marginBottom: '8px',

  variants: {
    size: {
      small: {
        fontSize: '$small',
      },
      normal: {
        fontSize: '$normal',
      },
    },
    color: {
      indigo: {
        color: '$violet11',
      },
      white: {
        color: '$gray1',
      },
      whiteSmoke: {
        color: '$gray3',
      },
      slateBlue: {
        color: '$violet8',
      },
      smalt: {
        color: '$violet9',
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
        fontWeight: '$regular',
      },
    },
    align: {
      start: {
        textAlign: 'start',
      },
      center: {
        textAlign: 'center',
      },
      end: {
        textAlign: 'end',
      },
    },
  },
});

export const Title = styled('h1', {
  fontSize: '$title',
  fontWeight: '$bold',
  color: '$violet11',
  width: '100%',
  textAlign: 'start',

  variants: {
    size: {
      large: {
        fontSize: '$large',
      },
      extraLarge: {
        fontSize: '$extraLarge',
      },
    },
  },
});
