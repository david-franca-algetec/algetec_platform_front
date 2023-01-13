/* eslint-disable no-nested-ternary */
import { CaretDownIcon, CaretSortIcon, CaretUpIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Captions, Th, Thead } from '.';
import { Box } from '../box';
import { Tooltip } from '../Tooltip';

export type Order = 'asc' | 'desc';

interface TableHeadProps {
  captions: Array<Captions>;
  handleSorting: (accessor: string, order: Order) => void;
}

export function TableHead({ captions, handleSorting }: TableHeadProps) {
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState<Order>('asc');

  const handleSortingChange = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <Thead>
      <tr>
        <Th />
        {captions.map((caption) => {
          const caret = caption.sortable ? (
            sortField === caption.accessor && order === 'asc' ? (
              <CaretUpIcon />
            ) : sortField === caption.accessor && order === 'desc' ? (
              <CaretDownIcon />
            ) : (
              <CaretSortIcon />
            )
          ) : null;

          return caption.tooltip ? (
            <Tooltip key={caption.accessor} label={caption.tooltip}>
              <Th onClick={caption.sortable ? () => handleSortingChange(caption.accessor) : undefined}>
                <Box
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$xs',
                  }}
                >
                  {caption.caption}
                  <Box
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: '$xs',
                    }}
                  >
                    <InfoCircledIcon /> {caret}
                  </Box>
                </Box>
              </Th>
            </Tooltip>
          ) : (
            <Th
              key={caption.accessor}
              onClick={caption.sortable ? () => handleSortingChange(caption.accessor) : undefined}
            >
              {caption.caption} {caret}
            </Th>
          );
        })}
        <Th />
      </tr>
    </Thead>
  );
}
