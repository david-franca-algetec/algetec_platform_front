// eslint-disable-next-line import/no-unresolved
import { Globals, Property } from '@stitches/react/types/css';
// eslint-disable-next-line import/no-unresolved
import { Index } from '@stitches/react/types/util';
import { PropsWithChildren } from 'react';

import {
  ScrollAreaContainer,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './styles';

interface ScrollAreaProps extends PropsWithChildren {
  height?: Globals | Index | '$sm' | '$md' | '$lg' | '$xl' | '$xxl' | Property.Height;
  width?: Globals | Index | '$sm' | '$md' | '$lg' | '$xl' | '$xxl' | Property.Width;
  maxHeight?: Globals | Index | '$sm' | '$md' | '$lg' | '$xl' | '$xxl' | Property.MaxHeight;
  maxWidth?: Globals | Index | '$sm' | '$md' | '$lg' | '$xl' | '$xxl' | Property.MaxWidth;
}

export function ScrollArea({ children, height, width, maxWidth, maxHeight }: ScrollAreaProps) {
  return (
    <ScrollAreaContainer css={{ height, width, maxHeight, maxWidth }}>
      <ScrollAreaViewport css={{ backgroundColor: 'inherit' }}>{children}</ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollAreaContainer>
  );
}

ScrollArea.defaultProps = { height: 300, width: undefined, maxWidth: undefined, maxHeight: undefined };
