import { Button, Result } from 'antd';
import { Link, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  if (error) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Desculpe, a página que você procura não existe ou foi removida."
        extra={
          <Link to="/" replace>
            <Button type="primary">Voltar</Button>
          </Link>
        }
      />
    );
  }
  return null;
}
