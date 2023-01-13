import { Oval } from 'react-loader-spinner';
import { styled } from '../config/styles/stitches.config';

const Flex = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '2rem',
});

export function Spinner() {
  return (
    <Flex>
      <Oval
        height={80}
        width={80}
        color="#aaa"
        wrapperStyle={{}}
        wrapperClass=""
        visible
        ariaLabel="oval-loading"
        secondaryColor="#fff"
        strokeWidth={5}
        strokeWidthSecondary={5}
      />
    </Flex>
  );
}
