import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { ComponentProps } from '@stitches/react';
import { forwardRef, PropsWithChildren, ReactNode, useEffect, useState } from 'react';

import { keyframes, styled } from '../../config/styles/stitches.config';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const DialogOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '$blackA9',
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(DialogPrimitive.Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 1000,
  '&:focus': { outline: 'none' },
});

const DialogTitle = styled(DialogPrimitive.Title, {
  fontWeight: 500,
  color: '$mauve12',
  fontSize: 17,
  marginBottom: '$sm',
});

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 25,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$violet11',
  position: 'absolute',
  top: 10,
  right: 10,

  '&:hover': { backgroundColor: '$violet4' },
  '&:focus': { boxShadow: '0 0 0 2px $violet7' },
});

export const Fieldset = styled('fieldset', {
  all: 'unset',
  display: 'flex',
  gap: 20,
  alignItems: 'center',
  marginBottom: 15,
});

export const Label = styled('label', {
  fontSize: 15,
  color: '$violet11',
  width: 90,
  textAlign: 'right',
});

export const Input = styled('input', {
  all: 'unset',
  width: '100%',
  flex: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 10px',
  fontSize: 15,
  lineHeight: 1,
  color: '$violet11',
  boxShadow: '0 0 0 1px $violet8',
  height: 35,
  border: '1px solid $violet8',

  '&:focus': { boxShadow: '0 0 0 2px $violet9' },
  '&:disabled': {
    backgroundColor: '$violet6',
    color: '$violet8',
    boxShadow: '0 0 0 1px $violet2',
  },
});

export const DialogClose = styled(DialogPrimitive.Close, {});

interface DialogProps extends PropsWithChildren {
  title: string;
  element: ReactNode;
  open?: boolean;
  close?: boolean;
}

interface DialogTriggerProps extends ComponentProps<typeof DialogPrimitive.Trigger> {
  children: ReactNode;
}

const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(({ children }, ref) => (
  <DialogPrimitive.Trigger asChild ref={ref}>
    {children}
  </DialogPrimitive.Trigger>
));

DialogTrigger.displayName = 'DialogTrigger';

export function Dialog({ children, title, element, close, open }: DialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (close) {
      setOpenDialog(false);
    }
    if (open) {
      setOpenDialog(true);
    }
  }, [close, open]);
  return (
    <DialogPrimitive.Root open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          {element}

          <DialogPrimitive.Close asChild>
            <IconButton aria-label="Close">
              <Cross2Icon />
            </IconButton>
          </DialogPrimitive.Close>
        </DialogContent>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

Dialog.defaultProps = {
  open: false,
  close: false,
};
