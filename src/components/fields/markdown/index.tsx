/* eslint-disable @typescript-eslint/ban-types */
// noinspection JSUnusedGlobalSymbols

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

export type RefineFieldCommonProps<T = unknown> = {
  /**
   * The value of the field.
   */
  value: T;
};

export type RefineFieldMarkdownProps<
  TValueType = string | undefined,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

/**
 * This field lets you display markdown content. It supports {@link https://github.github.com/gfm/ GitHub Flavored Markdown}.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/fields/markdown} for more details.
 */
export function MarkdownField({ value = '' }: RefineFieldMarkdownProps) {
  return <ReactMarkdown remarkPlugins={[gfm]}>{value}</ReactMarkdown>;
}
