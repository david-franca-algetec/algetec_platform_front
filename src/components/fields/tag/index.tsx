/* eslint-disable react/jsx-props-no-spreading */
import { Tag } from 'antd';

import { TagFieldProps } from '../../../pages/types';

/**
 * This field lets you display a value in a tag. It uses Ant Design's {@link https://ant.design/components/tag/ `<Tag>`} component.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/fields/tag} for more details.
 */
export function TagField({ value, ...rest }: TagFieldProps) {
  return <Tag {...rest}>{value?.toString()}</Tag>;
}
