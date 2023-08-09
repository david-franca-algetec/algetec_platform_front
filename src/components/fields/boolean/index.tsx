/* eslint-disable react/jsx-props-no-spreading */
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { BooleanFieldProps } from '../../../pages/types';

/**
 * This field is used to display boolean values. It uses the {@link https://ant.design/components/tooltip/#header `<Tooltip>`} values from Ant Design.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/fields/boolean} for more details.
 */
export function BooleanField({
  value,
  valueLabelTrue = 'true',
  valueLabelFalse = 'false',
  trueIcon = <CheckOutlined style={{ color: 'green' }} />,
  falseIcon = <CloseOutlined style={{ color: 'red' }} />,
  ...rest
}: BooleanFieldProps) {
  return (
    <Tooltip title={value ? valueLabelTrue : valueLabelFalse} {...rest}>
      {value ? <span>{trueIcon}</span> : <span>{falseIcon}</span>}
    </Tooltip>
  );
}
