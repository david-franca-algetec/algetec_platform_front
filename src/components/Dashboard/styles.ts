import { blue, grass, indigo, purple, red, yellow } from '@radix-ui/colors';
import { Checkbox, Indicator } from '@radix-ui/react-checkbox';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { Link } from 'react-router-dom';

import { styled } from '../../config/styles/stitches.config';

export const Sidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '15vw',
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
  transition: '$default',

  '&:hover': {
    backgroundColor: indigo.indigo8,
  },
});

export const StyledLink = styled(Link, {
  color: indigo.indigo11,
  textDecoration: 'none',
});

export const StyledAnchor = styled('a', {
  color: indigo.indigo11,
  textDecoration: 'none',
});

export const Form = styled('form', {
  all: 'unset',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  margin: '$sm',
});

export const Label = styled('label', {
  all: 'unset',
  fontSize: '$normal',
  lineHeight: 1,
  userSelect: 'none',
  fontWeight: '$bold',
  marginRight: '$sm',
  color: '$violet11',
});

export const Select = styled('select', {
  all: 'unset',
  width: '100%',
  height: '$md',
  borderRadius: '$sm',
  border: `1px solid $grayA11`,
  padding: '$sm',

  '& option': {
    all: 'unset',
    padding: '$sm',
  },
});

export const Input = styled('input', {
  all: 'unset',
  width: '100%',
  height: '$md',
  borderRadius: '$sm',
  border: `1px solid $grayA11`,
  padding: '$sm',
});

export const FileImage = styled('div', {
  all: 'unset',
  width: '100%',
  height: 'fit-content',
  borderRadius: '$sm',
  border: `1px solid $grayA11`,
  padding: '$sm',
  backgroundColor: 'violet2',
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
    backgroundColor: '$cyan9',
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
  fontSize: '$normal',
  fontWeight: '$bold',
  color: '$violet11',
  margin: '$sm',

  variants: {
    size: {
      small: {
        fontSize: '$small',
      },
      medium: {
        fontSize: '$normal',
      },
      large: {
        fontSize: '$title',
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
  padding: '$md',
  backgroundColor: '$mauve4',
  borderRadius: '$sm',
  margin: '$sm',
  boxShadow: '$md',

  '&:hover': {
    boxShadow: '$md',
  },

  '& a': {
    textDecoration: 'none',
    color: 'inherit',
  },
});

export const NavigationMenu = styled(NavigationMenuPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  zIndex: 1,
  backgroundColor: '$gray1',
  width: '15vw',
});

export const NavigationMenuList = styled(NavigationMenuPrimitive.List, {
  all: 'unset',
  display: 'flex',
  justifyContent: 'center',
  padding: 4,
  listStyle: 'none',
  flexDirection: 'column',
  width: '15vw',
});

export const NavigationMenuItem = styled(NavigationMenuPrimitive.Item, {});

const itemStyles = {
  padding: '16px 12px',
  outline: 'none',
  userSelect: 'none',
  fontWeight: 500,
  lineHeight: 1,
  borderRadius: 4,
  fontSize: 15,
  color: '$violet11',
  '&:focus': { position: 'relative', boxShadow: `0 0 0 2px $blackA7` },
  '&:hover': { backgroundColor: '$violet3' },
};

export const StyledTrigger = styled(NavigationMenuPrimitive.Trigger, {
  all: 'unset',
  ...itemStyles,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  width: 'calc(100% - 36px)',
  fontWeight: '$regular',
  fontSize: '$large',
  color: indigo.indigo11,
  borderLeft: '0.5rem solid transparent',

  '&[data-state="open"]': {
    backgroundColor: '$violet3',
    borderLeft: `0.5rem solid $violet11`,
    '& div': {
      visibility: 'visible',
    },
  },

  '& span': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  '&:hover': {
    '& div': {
      visibility: 'visible',
    },
  },

  variants: {
    color: {
      violet: {
        '&:hover': {
          backgroundColor: '$violet6',
          borderLeft: `0.5rem solid $$violet11`,
        },
        '&[data-state="open"]': {
          backgroundColor: '$violet6',
          borderLeft: `0.5rem solid '$violet11'`,
        },
      },
      mauve: {
        '&:hover': {
          backgroundColor: '$mauve6',
          borderLeft: `0.5rem solid $mauve11'`,
        },
        '&[data-state="open"]': {
          backgroundColor: '$mauve6',
          borderLeft: `0.5rem solid $mauve11'`,
        },
      },
      indigo: {
        '&:hover': {
          backgroundColor: indigo.indigo6,
          borderLeft: `0.5rem solid ${indigo.indigo11}`,
        },
        '&[data-state="open"]': {
          backgroundColor: indigo.indigo6,
          borderLeft: `0.5rem solid ${indigo.indigo11}`,
        },
      },
      purple: {
        '&:hover': {
          backgroundColor: purple.purple6,
          borderLeft: `0.5rem solid ${purple.purple11}`,
        },
        '&[data-state="open"]': {
          backgroundColor: purple.purple6,
          borderLeft: `0.5rem solid ${purple.purple11}`,
        },
      },
      red: {
        '&:hover': {
          backgroundColor: red.red6,
          borderLeft: `0.5rem solid ${red.red11}`,
        },
        '&[data-state="open"]': {
          backgroundColor: red.red6,
          borderLeft: `0.5rem solid ${red.red11}`,
        },
      },
      blue: {
        '&:hover': {
          backgroundColor: blue.blue6,
          borderLeft: `0.5rem solid ${blue.blue11}`,
        },
        '&[data-state="open"]': {
          backgroundColor: blue.blue6,
          borderLeft: `0.5rem solid ${blue.blue11}`,
        },
      },
      grass: {
        '&:hover': {
          backgroundColor: grass.grass6,
          borderLeft: `0.5rem solid ${grass.grass11}`,
        },
        '&[data-state="open"]': {
          backgroundColor: grass.grass6,
          borderLeft: `0.5rem solid ${grass.grass11}`,
        },
      },
      yellow: {
        '&:hover': {
          backgroundColor: yellow.yellow6,
          borderLeft: `0.5rem solid ${yellow.yellow11}`,
        },
        '&[data-state="open"]': {
          backgroundColor: yellow.yellow6,
          borderLeft: `0.5rem solid ${yellow.yellow11}`,
        },
      },
    },
    isActive: {
      true: {},
    },
  },
  compoundVariants: [
    {
      color: 'violet',
      isActive: true,
      css: {
        backgroundColor: 'violet6',
        borderLeft: `0.5rem solid $$violet11`,
      },
    },
    {
      color: 'mauve',
      isActive: true,
      css: {
        backgroundColor: '$mauve6',
        borderLeft: `0.5rem solid $mauve11`,
      },
    },
    {
      color: 'indigo',
      isActive: true,
      css: {
        backgroundColor: indigo.indigo6,
        borderLeft: `0.5rem solid ${indigo.indigo11}`,
      },
    },
    {
      color: 'purple',
      isActive: true,
      css: {
        backgroundColor: purple.purple6,
        borderLeft: `0.5rem solid ${purple.purple11}`,
      },
    },
    {
      color: 'red',
      isActive: true,
      css: {
        backgroundColor: red.red6,
        borderLeft: `0.5rem solid ${red.red11}`,
      },
    },
    {
      color: 'blue',
      isActive: true,
      css: {
        backgroundColor: blue.blue6,
        borderLeft: `0.5rem solid ${blue.blue11}`,
      },
    },
    {
      color: 'grass',
      isActive: true,
      css: {
        backgroundColor: grass.grass6,
        borderLeft: `0.5rem solid ${grass.grass11}`,
      },
    },
    {
      color: 'yellow',
      isActive: true,
      css: {
        backgroundColor: yellow.yellow6,
        borderLeft: `0.5rem solid ${yellow.yellow11}`,
      },
    },
  ],
});

export const Icon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  visibility: 'hidden',
  color: '$violet11',

  '& svg': {
    width: 24,
    height: 24,
  },
});
