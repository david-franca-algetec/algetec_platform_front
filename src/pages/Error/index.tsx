import { useRouteError } from 'react-router-dom';

import pageNotFound from '../../assets/page_not_found.svg';
import { ErrorContainer } from './styles';

export function ErrorPage() {
  const error = useRouteError();

  if (error) {
    return (
      <ErrorContainer>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <img src={pageNotFound} alt="Page Not Found" />
      </ErrorContainer>
    );
  }
  return null;
}
