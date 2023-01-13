import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import { styled } from '../../config/styles/stitches.config';

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'white',
  width: 25,
  height: 25,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 10px $blackA7',
  '&:hover': { backgroundColor: '$violet3' },
  '&:focus': { boxShadow: `0 0 0 2px black` },
});

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  color: '$violet11',
});

const Label = styled('label', {
  color: 'white',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
});

const Flex = styled('div', { display: 'flex' });

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: CheckboxPrimitive.CheckedState) => void;
}

export function Checkbox({ label, checked, onCheckedChange }: CheckboxProps) {
  return (
    <Flex css={{ alignItems: 'center' }}>
      <CheckboxRoot id="c1" checked={checked} onCheckedChange={onCheckedChange}>
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
      {label ? (
        <Label css={{ paddingLeft: 15 }} htmlFor="c1">
          {label}
        </Label>
      ) : null}
    </Flex>
  );
}

Checkbox.displayName = 'Checkbox';
Checkbox.defaultProps = {
  label: undefined,
};
