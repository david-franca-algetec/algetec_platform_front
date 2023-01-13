import {
  blackA,
  blue,
  blueDark,
  cyan,
  cyanDark,
  gray,
  grayDark,
  mauve,
  mauveDark,
  violet,
  violetDark,
} from '@radix-ui/colors';
import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } = createStitches({
  theme: {
    fonts: {
      inter: 'Inter, sans-serif',
    },
    fontSizes: {
      small: '0.75rem', // 12px
      normal: '0.875rem', // 14px
      large: '1rem', // 16px
      extraLarge: '1.25rem', // 20px
      title: '2.25rem', // 36px
    },
    sizes: {
      sm: '0.75rem', // 12px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
      xxl: '3rem', // 48px
    },
    space: {
      xs: '0.25rem', // 4px
      sm: '0.75rem', // 12px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
      xxl: '3rem', // 48px
    },
    borderWidths: {
      none: '0',
      xs: '1px',
      sm: '2px',
      md: '4px',
      lg: '8px',
      xl: '12px',
    },
    transitions: {
      default: 'all 0.3s ease-in-out',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
    radii: {
      sm: '0.25rem', // 4px
      md: '0.5rem', // 8px
      lg: '1rem', // 16px
      xl: '2rem', // 32px
      xxl: '3rem', // 48px
    },
    colors: {
      ...violet,
      ...blackA,
      ...mauve,
      ...blue,
      ...gray,
      ...cyan,
    },
  },
  media: {
    sm: '(max-width: 480px)',
    md: '(max-width: 768px)',
    lg: '(min-width: 769px)',
  },
  utils: {
    marginX: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: string | number) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: (value: string | number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
  prefix: 'platform',
});

export const darkTheme = createTheme('dark-theme', {
  colors: {
    ...violetDark,
    ...blackA,
    ...mauveDark,
    ...blueDark,
    ...grayDark,
    ...cyanDark,
  },
});

export const injectGlobalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    fontFamily: '$inter',
    margin: 0,
    padding: 0,
  },
  '*:after': {
    boxSizing: 'border-box',
    fontFamily: '$inter',
  },
  '*:before': {
    boxSizing: 'border-box',
    fontFamily: '$inter',
  },
  body: {
    margin: 0,
    padding: 0,
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  h1: {
    margin: 0,
  },
  button: {
    cursor: 'pointer',
  },
  'body, input, button, textarea': {
    fontFamily: '$inter',
    fontWeight: '$regular',
  },
});
