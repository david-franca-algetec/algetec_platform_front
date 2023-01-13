/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import { CheckedState } from '@radix-ui/react-checkbox';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon, CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons';
import { nanoid } from '@reduxjs/toolkit';
import { keyframes } from '@stitches/react';
import { Fragment, ReactNode } from 'react';

import { styled } from '../../config/styles/stitches.config';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const contentStyles = {
  zIndex: 1000,
  minWidth: 220,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
};

const DropdownMenuPrimitiveContent = styled(DropdownMenuPrimitive.Content, contentStyles);
const DropdownMenuPrimitiveSubContent = styled(DropdownMenuPrimitive.SubContent, contentStyles);

const DropdownMenuPrimitiveArrow = styled(DropdownMenuPrimitive.Arrow, {
  fill: 'white',
});

const itemStyles = {
  all: 'unset',
  fontSize: 16,
  lineHeight: 1,
  color: '$violet11',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 5px',
  position: 'relative',
  paddingLeft: 25,
  userSelect: 'none',

  '& a': {
    textDecoration: 'none',
    color: '$violet11',

    '&:hover': {
      color: '$violet1',
    },
  },

  '&[data-disabled]': {
    color: '$mauve8',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$violet9',
    color: '$violet1',
  },
};

const DropdownMenuPrimitiveItem = styled(DropdownMenuPrimitive.Item, itemStyles);
export const DropdownMenuPrimitiveCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, itemStyles);
const DropdownMenuPrimitiveRadioItem = styled(DropdownMenuPrimitive.RadioItem, itemStyles);
const DropdownMenuPrimitiveSubTrigger = styled(DropdownMenuPrimitive.SubTrigger, {
  '&[data-state="open"]': {
    backgroundColor: '$violet4',
    color: '$violet11',
  },
  ...itemStyles,
});

export const DropdownMenuPrimitiveItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
  color: '$mauve11',
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: '$mauve8' },
});

const Button = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  width: 'fit-content',
  padding: '$sm',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$violet11',
  backgroundColor: 'white',
  // borderBottom: `1px solid ${violet.violet6}`,
  gap: 5,

  '&:hover': {
    backgroundColor: '$violet3',
  },
});

interface CheckboxItemProps {
  label: string;
  rightSlot?: ReactNode;
  checked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
}

export function CheckboxItem({ label, rightSlot, checked, onCheckedChange }: CheckboxItemProps) {
  return (
    <DropdownMenuPrimitiveCheckboxItem checked={checked} onCheckedChange={onCheckedChange}>
      <DropdownMenuPrimitiveItemIndicator>
        <CheckIcon />
      </DropdownMenuPrimitiveItemIndicator>
      {label}
      {rightSlot ? <RightSlot>{rightSlot}</RightSlot> : null}
    </DropdownMenuPrimitiveCheckboxItem>
  );
}

export interface DropdownMenuProps {
  label: string;
  content: Array<{
    label: JSX.Element | JSX.Element[] | string;
    value: string;
    checkbox?: {
      checked?: CheckedState;
      onCheckedChange?: (checked: CheckedState) => void;
    };
    radioGroup?: {
      value: string;
      onValueChange: (value: string) => void;
      content: Array<{ label: string; value: string; rightSlot?: ReactNode }>;
    };
    rightSlot?: ReactNode;
    onClick?: () => void;
    subContent?: Array<{
      label: string;
      value: string;
      rightSlot?: ReactNode;
      onClick: () => void;
    }>;
  }>;
}

export function DropdownMenu({ label, content }: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button>
          {label}
          <CaretDownIcon />
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitiveContent sideOffset={5}>
          {content.map((item) =>
            item.subContent ? (
              <DropdownMenuPrimitive.Sub key={nanoid()}>
                <DropdownMenuPrimitiveSubTrigger>
                  {item.label}
                  <RightSlot>
                    <ChevronRightIcon />
                  </RightSlot>
                </DropdownMenuPrimitiveSubTrigger>
                <DropdownMenuPrimitive.Portal>
                  <DropdownMenuPrimitiveSubContent sideOffset={2} alignOffset={-5}>
                    {item.subContent.map((subItem) => (
                      <DropdownMenuPrimitiveItem key={nanoid()} onClick={subItem.onClick}>
                        {subItem.label}
                        {subItem.rightSlot ? <RightSlot>{subItem.rightSlot}</RightSlot> : null}
                      </DropdownMenuPrimitiveItem>
                    ))}
                  </DropdownMenuPrimitiveSubContent>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenuPrimitive.Sub>
            ) : item.checkbox ? (
              <CheckboxItem
                key={nanoid()}
                label={item.label as string}
                rightSlot={item.rightSlot}
                checked={item.checkbox.checked}
                onCheckedChange={item.checkbox.onCheckedChange}
              />
            ) : item.radioGroup ? (
              <Fragment key={nanoid()}>
                <DropdownMenuPrimitive.RadioGroup
                  value={item.radioGroup.value}
                  onValueChange={item.radioGroup.onValueChange}
                >
                  {item.radioGroup.content.map((radioItem) => (
                    <DropdownMenuPrimitiveRadioItem value={radioItem.value} key={nanoid()}>
                      <DropdownMenuPrimitiveItemIndicator>
                        <DotFilledIcon />
                      </DropdownMenuPrimitiveItemIndicator>
                      {radioItem.label}
                      {radioItem.rightSlot ? <RightSlot>{radioItem.rightSlot}</RightSlot> : null}
                    </DropdownMenuPrimitiveRadioItem>
                  ))}
                </DropdownMenuPrimitive.RadioGroup>
              </Fragment>
            ) : (
              <DropdownMenuPrimitiveItem key={nanoid()} onClick={item.onClick}>
                {item.label}
                {item.rightSlot ? <RightSlot>{item.rightSlot}</RightSlot> : null}
              </DropdownMenuPrimitiveItem>
            ),
          )}
          <DropdownMenuPrimitiveArrow />
        </DropdownMenuPrimitiveContent>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
