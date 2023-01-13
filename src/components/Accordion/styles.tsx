/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ComponentProps, forwardRef } from 'react';

import { keyframes, styled } from '../../config/styles/stitches.config';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordion = styled(Accordion, {
  borderRadius: 6,
  width: '$p100',
  backgroundColor: '$mauve6',
  boxShadow: `0 2px 10px $blackA4`,
});

const StyledItem = styled(AccordionItem, {
  overflow: 'hidden',
  marginTop: 1,

  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  '&:last-child': {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});

const StyledHeader = styled(AccordionHeader, {
  all: 'unset',
  display: 'flex',
});

const StyledTrigger = styled(AccordionTrigger, {
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  padding: '0 20px',
  height: 45,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '$3',
  fontWeight: '$bold',
  lineHeight: 1,
  color: '$mauve12',
  boxShadow: '0 1px 0 $mauve6',
  '&[data-state="closed"]': { backgroundColor: 'white' },
  '&[data-state="open"]': { backgroundColor: '$mauve6' },
  '&:hover': { backgroundColor: '$mauve4' },
});

const StyledContent = styled(AccordionContent, {
  overflow: 'hidden',
  fontSize: 15,
  color: '$mauve11',
  backgroundColor: '$mauve2',

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const StyledContentText = styled('div', {
  padding: '15px 20px',
});

const StyledChevron = styled(ChevronDownIcon, {
  color: '$mauve12',
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
  '[data-state=closed] &': { transform: 'rotate(0deg)' },
});

const AccordionContainer = StyledAccordion;
const AccordionItemStyled = StyledItem;

interface AccordionTriggerProps extends ComponentProps<typeof StyledTrigger> {
  children: JSX.Element | JSX.Element[] | string;
  styleChevron?: ComponentProps<typeof StyledChevron>;
}

const AccordionTriggerStyled = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, styleChevron, ...props }, forwardedRef) => (
    <StyledHeader>
      <StyledTrigger {...props} ref={forwardedRef}>
        {children}
        <StyledChevron aria-hidden {...styleChevron} />
      </StyledTrigger>
    </StyledHeader>
  ),
);

AccordionTriggerStyled.displayName = 'AccordionTrigger';

interface AccordionContentProps extends ComponentProps<typeof StyledContent> {
  children: JSX.Element | JSX.Element[] | string;
}

const AccordionContentStyled = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, ...props }, forwardedRef) => (
    <StyledContent {...props} ref={forwardedRef}>
      <StyledContentText>{children}</StyledContentText>
    </StyledContent>
  ),
);

AccordionContentStyled.displayName = 'AccordionContent';

export { AccordionContainer, AccordionItemStyled, AccordionTriggerStyled, AccordionContentStyled };
