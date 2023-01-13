import { useEffect, useId, useRef, useState } from 'react';

import { AccordionContainer, AccordionContentStyled, AccordionItemStyled, AccordionTriggerStyled } from './styles';

interface AccordionProps {
  title: string;
  open?: boolean;
  children: JSX.Element | JSX.Element[] | string;
}

export function Accordion({ children, title, open }: AccordionProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [dataState, setDataState] = useState<string | null>('closed');
  const [idSelected, setIdSelected] = useState(id);

  useEffect(() => {
    if (ref.current) {
      const openState = ref.current.getAttribute('data-state');
      setDataState(openState);
    }
  }, [ref]);

  return (
    <AccordionContainer type="single" collapsible value={open ? idSelected : undefined}>
      <AccordionItemStyled value={id} ref={ref}>
        <AccordionTriggerStyled
          styleChevron={
            dataState === 'open' ? { css: { transform: 'rotate(180deg)' } } : { css: { transform: 'rotate(0deg)' } }
          }
          onClick={() => {
            setIdSelected(dataState === 'open' ? '' : id);
            setDataState(dataState === 'open' ? 'closed' : 'open');
          }}
        >
          {title}
        </AccordionTriggerStyled>
        <AccordionContainer type="single" collapsible>
          <AccordionContentStyled>{children}</AccordionContentStyled>
        </AccordionContainer>
      </AccordionItemStyled>
    </AccordionContainer>
  );
}

Accordion.defaultProps = {
  open: false,
};
