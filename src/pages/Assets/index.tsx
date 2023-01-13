import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { Flex, Header } from '../../components';
import { useAppSelector } from '../../config/hooks';
import { Asset } from '../../models/asset.model';
import { useAllAssetsQuery } from '../../services/asset.service';
import { Container, Table } from './styles';

export function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { data: assetsData, error: assetsError, isLoading: assetsLoading } = useAllAssetsQuery();

  useEffect(() => {
    if (assetsData) {
      setAssets(assetsData);
    }
  }, [assetsData]);

  if (assetsLoading) {
    return <div>Loading...</div>;
  }

  if (assetsError) {
    return <div>Something went wrong</div>;
  }

  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container>
      <Header />

      <Flex
        css={{
          margin: '0 auto',
          width: '100%',
          padding: '1rem',
          overflowX: 'auto',

          '@md': {
            padding: '1rem 2rem',
          },

          '@lg': {
            padding: '1rem 3rem',
          },
        }}
      >
        <Table.Root>
          <Table.Head>
            <tr>
              <Table.Header>
                <input type="checkbox" />
              </Table.Header>
              <Table.Header>ID</Table.Header>
              <Table.Header>Image</Table.Header>
              <Table.Header>Name</Table.Header>
              <Table.Header>Version</Table.Header>
              <Table.Header>Variant</Table.Header>
              <Table.Header>Created At</Table.Header>
              <Table.Header>Updated At</Table.Header>
              <Table.Header>Used By</Table.Header>
              <Table.Header>Description</Table.Header>
              <Table.Header>File</Table.Header>
              <Table.Header>Note</Table.Header>
              <Table.Header>Is Clean?</Table.Header>
              <Table.Header>Modified By</Table.Header>
            </tr>
          </Table.Head>
          <Table.Body>
            {assets.map((asset) => (
              <Table.Row key={asset.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{asset.id}</td>
                <td>{asset.image ? 'Yes' : 'No'}</td>
                <td>{asset.name}</td>
                <td>{asset.version}</td>
                <td>{asset.variant}</td>
                <td>{asset.created_at}</td>
                <td>{asset.updated_at}</td>
                <td>{asset.experiments.length}</td>
                <td>{asset.description ? 'Yes' : 'No'}</td>
                <td>{asset.file ? 'Yes' : 'No'}</td>
                <td>{asset.note ? 'Yes' : 'No'}</td>
                <td>{asset.isClean ? 'Yes' : 'No'}</td>
                <td>{asset.modified_by_id ? 'Yes' : 'No'}</td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
    </Container>
  );
}
