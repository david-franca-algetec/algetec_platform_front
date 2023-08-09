import { Image, Layout, Space, Typography } from 'antd';

import logoBranca from '../../assets/logo-branca.png';
import { useAppSelector } from '../../config/hooks';

const { Footer: AFooter } = Layout;
const { Text } = Typography;

export function Footer() {
  const { isDarkMode } = useAppSelector((state) => state.auth);
  return (
    <AFooter style={{ background: isDarkMode ? '#000a14' : '#556F83' }}>
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <Image preview={false} style={{ maxWidth: 150 }} src={logoBranca} alt="Logo Branca" />

        <Text style={{ alignItems: 'center', color: '#FFF' }}>
          &copy; {new Date().getFullYear()}. Todos os direitos reservados. Desenvolvido por Algetec+
        </Text>
      </Space>
    </AFooter>
  );
}
