/* eslint-disable react/jsx-props-no-spreading */
import {
  amber,
  blue,
  brown,
  crimson,
  cyan,
  grass,
  green,
  indigo,
  lime,
  mint,
  orange,
  pink,
  plum,
  purple,
  red,
  sky,
  teal,
  tomato,
  yellow,
} from '@radix-ui/colors';
import { ComponentProps } from '@stitches/react';
import { forwardRef, ReactNode } from 'react';
import { ThreeDots } from 'react-loader-spinner';

import { styled } from '../config/styles/stitches.config';

export const ButtonComponent = styled('button', {
  all: 'unset',
  width: 'fit-content',
  height: 'fit-content',
  borderRadius: '$sm',
  padding: '$sm',
  backgroundColor: '$violet11',
  color: 'white',
  fontSize: '$normal',
  fontWeight: '$bold',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$sm',

  '& a': {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '$small',
  },

  '&:hover': {
    backgroundColor: '$violet12',
  },

  variants: {
    color: {
      violet: {
        backgroundColor: '$violet11',
        '&:hover': {
          backgroundColor: '$violet12',
        },
      },
      tomato: {
        backgroundColor: tomato.tomato11,
        '&:hover': {
          backgroundColor: tomato.tomato12,
        },
      },
      teal: {
        backgroundColor: teal.teal11,
        '&:hover': {
          backgroundColor: teal.teal12,
        },
      },
      red: {
        backgroundColor: red.red11,
        '&:hover': {
          backgroundColor: red.red12,
        },
      },
      crimson: {
        backgroundColor: crimson.crimson11,
        '&:hover': {
          backgroundColor: crimson.crimson12,
        },
      },
      pink: {
        backgroundColor: pink.pink11,
        '&:hover': {
          backgroundColor: pink.pink12,
        },
      },
      plum: {
        backgroundColor: plum.plum11,
        '&:hover': {
          backgroundColor: plum.plum12,
        },
      },
      purple: {
        backgroundColor: purple.purple11,
        '&:hover': {
          backgroundColor: purple.purple12,
        },
      },
      indigo: {
        backgroundColor: indigo.indigo11,
        '&:hover': {
          backgroundColor: indigo.indigo12,
        },
      },
      blue: {
        backgroundColor: blue.blue11,
        '&:hover': {
          backgroundColor: blue.blue12,
        },
      },
      cyan: {
        backgroundColor: cyan.cyan11,
        '&:hover': {
          backgroundColor: cyan.cyan12,
        },
      },
      green: {
        backgroundColor: green.green11,
        '&:hover': {
          backgroundColor: green.green12,
        },
      },
      grass: {
        backgroundColor: grass.grass11,
        '&:hover': {
          backgroundColor: grass.grass12,
        },
      },
      orange: {
        backgroundColor: orange.orange11,
        '&:hover': {
          backgroundColor: orange.orange12,
        },
      },
      brown: {
        backgroundColor: brown.brown11,
        '&:hover': {
          backgroundColor: brown.brown12,
        },
      },
      sky: {
        backgroundColor: sky.sky11,
        '&:hover': {
          backgroundColor: sky.sky12,
        },
      },
      lime: {
        backgroundColor: lime.lime11,
        '&:hover': {
          backgroundColor: lime.lime12,
        },
      },
      mint: {
        backgroundColor: mint.mint11,
        '&:hover': {
          backgroundColor: mint.mint12,
        },
      },
      yellow: {
        backgroundColor: yellow.yellow11,
        '&:hover': {
          backgroundColor: yellow.yellow12,
        },
      },
      amber: {
        backgroundColor: amber.amber11,
        '&:hover': {
          backgroundColor: amber.amber12,
        },
      },
    },
  },
});

const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$sm',
});

interface ButtonProps extends ComponentProps<typeof ButtonComponent> {
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, isLoading, ...props }, forwardedRef) => (
  <ButtonComponent
    ref={forwardedRef}
    disabled={isLoading}
    css={{
      opacity: isLoading ? 0.5 : 1,
      cursor: isLoading ? 'not-allowed' : 'pointer',
    }}
    {...props}
  >
    {isLoading ? (
      <Flex>
        Carregando...
        <ThreeDots
          height="25"
          width="25"
          radius="9"
          color="#FFF"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible
        />
      </Flex>
    ) : (
      children
    )}
  </ButtonComponent>
));

Button.displayName = 'Button';

export { Button };
