import { Typography } from 'antd';

import { UrlFieldProps } from '../../../pages/types';

const { Link } = Typography;

/**
 * This field lets you embed a link. It uses Ant Design's {@link https://ant.design/components/typography/ `<Typography.Link>`} component.
 * You can pass a URL in its `value` property, and you can create a text in its place by passing any `children`.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/fields/url} for more details.
 */
export function UrlField({ children, value, ...rest }: UrlFieldProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Link href={value} {...rest}>
      {children ?? value}
    </Link>
  );
}
