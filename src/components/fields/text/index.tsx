/* eslint-disable react/jsx-props-no-spreading */
import { Tooltip, Typography } from 'antd';

import { TextFieldProps } from '../../../pages/types';

/**
 * This field lets you create basic text. It uses Ant Design's {@link https://ant.design/components/typography/#Typography.Text `<Typography.Text>`} component.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/fields/text} for more details.
 */

const { Text } = Typography;

export function TextField({ value, ...rest }: TextFieldProps) {
  return (
    <Tooltip title={value} placement="topLeft">
      <Text {...rest}>{value}</Text>
    </Tooltip>
  );
}
