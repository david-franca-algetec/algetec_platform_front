import { Tag } from 'antd';

import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { MouseEvent, useMemo } from 'react';
import { getUniqueColor } from '../../helpers';

export const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // eslint-disable-next-line consistent-return
  const color = useMemo(() => {
    if (typeof value === 'string') {
      const newValue = value.split('#')[1];

      if (newValue && newValue.length > 0) {
        return `#${newValue}`;
      }
    }
  }, [value]);
  return (
    <Tag
      color={color || getUniqueColor(label?.toString() || '')}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
