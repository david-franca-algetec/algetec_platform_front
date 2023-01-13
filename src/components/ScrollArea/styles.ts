import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { styled } from '../../config/styles/stitches.config';

export const ScrollAreaContainer = styled(ScrollAreaPrimitive.Root, {
  width: '100%',
  height: 400,
  maxHeight: 400,
  borderRadius: '$sm',
  overflow: 'hidden',
});

export const ScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

const SCROLLBAR_SIZE = 10;

export const ScrollAreaScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  padding: 2,
  background: '$blackA6',
  transition: '$default',
  '&:hover': { background: '$blackA8' },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

export const ScrollAreaThumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  background: '$mauve10',
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

export const ScrollAreaCorner = styled(ScrollAreaPrimitive.Corner, {
  background: '$blackA8',
});
