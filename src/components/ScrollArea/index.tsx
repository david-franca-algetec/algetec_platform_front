import { PropsWithChildren } from 'react';

import {
  ScrollAreaContainer,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './styles';

export function ScrollArea({ children }: PropsWithChildren) {
  return (
    <ScrollAreaContainer>
      <ScrollAreaViewport css={{ backgroundColor: 'inherit' }}>{children}</ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollAreaContainer>
  );
}
