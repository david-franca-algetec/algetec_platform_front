import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { ComponentProps } from '@stitches/react';

import { styled } from '../../config/styles/stitches.config';

const SeparatorRoot = styled(SeparatorPrimitive.Root, {
  backgroundColor: '$violet6',
  '&[data-orientation=horizontal]': { height: 1, width: '100%' },
  '&[data-orientation=vertical]': { height: '100%', width: 1 },
});

type SeparatorProps = {
  orientation?: ComponentProps<typeof SeparatorRoot>['orientation'];
};

export function Separator({ orientation }: SeparatorProps) {
  return <SeparatorRoot css={{ marginBottom: '$sm' }} decorative orientation={orientation} />;
}

Separator.defaultProps = {
  orientation: 'horizontal',
};
