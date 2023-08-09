import { useCallback, useState } from 'react';

import { useCallbackRef } from './useCallbackRef';

export interface UseDisclosureProps {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  id?: string;
  onClose?(): void;
  onOpen?(): void;
}

/**
 * `useDisclosure` is a custom hook used to help handle common open, close, or toggle scenarios.
 * It can be used to control a feedback component such as `Modal`, `AlertDialog`, `Drawer`, etc.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-disclosure
 */
export function useDisclosure(props: UseDisclosureProps = {}) {
  const { onClose: onCloseProp, onOpen: onOpenProp, isOpen: isOpenProp } = props;

  const handleOpen = useCallbackRef(onOpenProp);
  const handleClose = useCallbackRef(onCloseProp);

  const [isOpenState, setIsOpen] = useState(props.defaultIsOpen ?? false);

  const isOpen = isOpenProp ?? isOpenState;

  const isControlled = isOpenProp !== undefined;

  const onClose = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    handleClose?.();
  }, [isControlled, handleClose]);

  const onOpen = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    handleOpen?.();
  }, [isControlled, handleOpen]);

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);
  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    isControlled,
  };
}
