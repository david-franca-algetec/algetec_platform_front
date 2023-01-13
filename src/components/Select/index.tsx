/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ComponentProps } from '@stitches/react';
import { forwardRef } from 'react';

import { styled } from '../../config/styles/stitches.config';

const SelectTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 13,
  lineHeight: 1,
  gap: 5,
  backgroundColor: 'white',
  height: 40,
  border: '1px solid $violet8',
  color: '$violet11',
  boxShadow: `0 2px 10px $blackA7`,
  '&:hover': { backgroundColor: '$mauve3' },
  '&[data-placeholder]': { color: '$violet9' },
  '&[data-disabled]': { color: '$mauve8', pointerEvents: 'none' },
});

const SelectIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$violet11',
});

const SelectContent = styled(SelectPrimitive.Content, {
  zIndex: 1000,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 400,
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow: '$md',
});

const SelectViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledItem = styled(SelectPrimitive.Item, {
  fontSize: 13,
  lineHeight: 1,
  color: '$violet11',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: '$mauve8',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: '$violet9',
    color: '$violet1',
  },
});

type SelectItemProps = ComponentProps<typeof StyledItem>;

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ children, ...props }, forwardedRef) => (
  <StyledItem {...props} ref={forwardedRef}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <StyledItemIndicator>
      <CheckIcon />
    </StyledItemIndicator>
  </StyledItem>
));

SelectItem.displayName = 'SelectItem';

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: 'white',
  color: '$violet11',
  cursor: 'default',
};

const SelectScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles);

const SelectScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles);

export interface SelectProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  items: Array<{
    label: string;
    value: string;
    disabled?: boolean;
  }>;
}

export function Select({ items, placeholder, value, onValueChange, disabled }: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectIcon>
          <ChevronDownIcon />
        </SelectIcon>
      </SelectTrigger>
      <SelectPrimitive.Portal>
        <SelectContent>
          <SelectScrollUpButton>
            <ChevronUpIcon />
          </SelectScrollUpButton>
          <SelectViewport>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            ))}
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
