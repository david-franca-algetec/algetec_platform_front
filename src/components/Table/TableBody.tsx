/* eslint-disable import/named */
import { nanoid } from '@reduxjs/toolkit';

import { Captions, TableComponentProps, Tbody } from '.';
import { TableRow } from './TableRow';

interface TableBodyProps<T> {
  captions: Captions[];
  content: T;
  editElement: JSX.Element;
  editTitle: string;
  updateLink?: boolean;
}

export function TableBody<T>({
  captions,
  content,
  editElement,
  editTitle,
  updateLink,
}: TableBodyProps<TableComponentProps<T>['content']>) {
  return (
    <Tbody>
      {content.map(({ value, id, checked, onCheckedChange }) => (
        <TableRow
          key={nanoid()}
          id={id}
          captions={captions}
          value={value}
          checked={checked}
          onCheckedChange={onCheckedChange}
          editElement={editElement}
          editTitle={editTitle}
          updateLink={updateLink}
        />
      ))}
    </Tbody>
  );
}

TableBody.defaultProps = {
  updateLink: false,
};
