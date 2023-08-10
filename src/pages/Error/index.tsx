import { Button, Card, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';
import { SidebarWithHeader } from '../../components';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (error) {
    return (
      <SidebarWithHeader>
        <Card>
          <Result
            status="404"
            title="Não encontramos nada. Erro: 404"
            subTitle="Desculpe, a página que você procura não existe ou foi removida."
            extra={
              <Button type="primary" onClick={() => navigate(-1)}>
                Voltar
              </Button>
            }
          />
        </Card>
      </SidebarWithHeader>
    );
  }
  return null;
}
