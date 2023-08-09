/* eslint-disable @typescript-eslint/ban-types */
import { ImageProps, TagProps } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import { LinkProps } from 'antd/lib/typography/Link';
import { TextProps } from 'antd/lib/typography/Text';
import { ConfigType } from 'dayjs';
import { ReactElement, ReactNode } from 'react';

export interface CreateProps {
  onClose: () => void;
  open: boolean;
}

export interface EditProps {
  onClose: () => void;
  open: boolean;
  id: number;
}

export type FieldCommonProps<T = unknown> = {
  /**
   * The value of the field.
   */
  value: T;
};

export type FieldTooltipProps = {
  children?: ReactElement;
  title?: NonNullable<ReactNode>;
};

export type FieldBooleanProps<
  TValueType = boolean,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = Partial<FieldCommonProps<TValueType>> &
  FieldTooltipProps &
  TComponentProps &
  TExtraProps & {
    /**
     * If there is a value, this is the text to use.
     */
    valueLabelTrue?: string;
    /**
     * If there is no value, this is the text to use.
     */
    valueLabelFalse?: string;
    /**
     * If there is a value, this is the icon to use.
     */
    trueIcon?: ReactNode;
    /**
     * If there is no value, this is the icon to use.
     */
    falseIcon?: ReactNode;
  };

export type FieldDateProps<
  TValueType = ConfigType,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> &
  TComponentProps &
  TExtraProps & {
    /**
     * The locales of the date.
     * By default, Day.js comes with English locale only. If you need other locales, you can load them on demand.
     * [Refer to loading locales](https://day.js.org/docs/en/i18n/loading-into-browser)
     * @default English
     */
    locales?: string;
    /**
     * Gets the formatted date according to the string of the tokens passed in.
     */
    format?: string;
  };

export type FieldEmailProps<
  TValueType = ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};
export type FieldImageProps<
  TValueType = string | undefined,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

export type FieldNumberProps<
  TValueType = ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> &
  TComponentProps &
  TExtraProps & {
    /**
     * Override the browser locale in the date formatting. Passed as first argument to [`Intl.NumberFormat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    locale?: string | string[];
    /**
     * Number formatting options. Passed as second argument to [`Intl.NumberFormat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    options?: Intl.NumberFormatOptions;
  };

export type FieldTagProps<
  TValueType = ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

export type FieldTextProps<
  TValueType = ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

export type FieldUrlProps<
  TValueType = string | undefined,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = FieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

export type BooleanFieldProps = FieldBooleanProps<unknown, AbstractTooltipProps>;

export type DateFieldProps = FieldDateProps<ConfigType, TextProps>;

export type EmailFieldProps = FieldEmailProps<ReactNode, LinkProps>;

export type ImageFieldProps = FieldImageProps<
  string | undefined,
  ImageProps,
  {
    imageTitle?: string;
  }
>;

export type NumberFieldProps = FieldNumberProps<ReactNode, TextProps>;

export type TagFieldProps = FieldTagProps<ReactNode, TagProps>;

export type TextFieldProps = FieldTextProps<ReactNode, TextProps>;

export type UrlFieldProps = FieldUrlProps<string | undefined, LinkProps>;
