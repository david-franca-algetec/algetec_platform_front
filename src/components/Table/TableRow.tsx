import { CheckedState } from '@radix-ui/react-checkbox';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { nanoid } from '@reduxjs/toolkit';
import { cloneElement } from 'react';
import { useLocation } from 'react-router-dom';

import { Captions, Td, Tr } from '.';
import { Inline } from '../box';
import { Button } from '../button';
import { Checkbox } from '../Checkbox';
import { StyledLink } from '../Dashboard/styles';
import { Dialog } from '../Dialog';
import { Tooltip } from '../Tooltip';

interface TableRowProps<T> {
  id: string | number;
  value: T;
  checked: boolean;
  onCheckedChange: (checked: CheckedState) => void;
  editElement: JSX.Element;
  editTitle: string;
  updateLink?: boolean;
  captions: Array<Captions>;
}

export function TableRow<K>({
  id,
  value,
  checked,
  onCheckedChange,
  editElement,
  editTitle,
  updateLink,
  captions,
}: TableRowProps<K>) {
  const { pathname } = useLocation();
  return (
    <Tr key={nanoid()}>
      <Td>
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </Td>
      {captions.map(({ accessor }) => {
        const accessorValue = accessor as keyof K;
        const item = value[accessorValue] as string | number | JSX.Element | JSX.Element[];
        return (
          <Tooltip key={nanoid()} label={typeof item !== 'object' ? `${item}` : undefined}>
            {typeof item === 'number' ? (
              <Td
                css={{
                  fontWeight: '$bold',
                  textAlign: 'center',
                }}
                key={nanoid()}
              >
                {item}%
              </Td>
            ) : (
              <Td key={nanoid()}>{item}</Td>
            )}
          </Tooltip>
        );
      })}
      {/* {value.map((item) => (
        <Tooltip key={nanoid()} label={typeof item !== 'object' ? `${item}` : undefined}>
          {typeof item === 'number' ? (
            <Td
              css={{
                fontWeight: '$bold',
                textAlign: 'center',
              }}
              key={nanoid()}
            >
              {item}%
            </Td>
          ) : (
            <Td key={nanoid()}>{item}</Td>
          )}
        </Tooltip>
      ))} */}
      <Td>
        <Inline css={{ gap: '$sm' }}>
          {updateLink ? (
            <Tooltip label="Editar">
              <Button color="cyan">
                <StyledLink to={`${pathname}/edit/${id}`}>
                  <Pencil1Icon />
                </StyledLink>
              </Button>
            </Tooltip>
          ) : (
            <Dialog element={cloneElement(editElement, { id })} title={editTitle}>
              <Button color="cyan">
                <Tooltip label="Editar">
                  <Pencil1Icon />
                </Tooltip>
              </Button>
            </Dialog>
          )}
          <Button color="red">
            <Tooltip label="Deletar">
              <TrashIcon />
            </Tooltip>
          </Button>
        </Inline>
      </Td>
    </Tr>
  );
}

TableRow.defaultProps = {
  updateLink: false,
};
