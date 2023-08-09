/* eslint-disable react/jsx-props-no-spreading */
import { Typography } from 'antd';

import { NumberFieldProps } from '../../../pages/types';

const { Text } = Typography;

function toLocaleStringSupportsOptions() {
  return typeof Intl === 'object' && Intl && typeof Intl.NumberFormat === 'function';
}

/**
 * This field is used to display a number formatted according to the browser locale, right aligned. and uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl `Intl`} to display date format.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/fields/number} for more details.
 */
export function NumberField({ value, locale, options, ...rest }: NumberFieldProps) {
  const number = Number(value);

  return <Text {...rest}>{toLocaleStringSupportsOptions() ? number.toLocaleString(locale, options) : number}</Text>;
}
