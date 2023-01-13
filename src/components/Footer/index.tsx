import logoBranca from '../../assets/logo-branca.png';
import { Box, Copyright, FooterContainer, Image, Info, Section } from './style';

export function Footer() {
  return (
    <FooterContainer>
      <Section>
        <Info>
          <Image src={logoBranca} alt="Logo Branca" />

          <Box css={{ marginBottom: '10px' }}>
            <p>ALGETEC - Soluções para Ensino e Aprendizagem</p>
            <p>Rua Baixão, 578, Galpões 3, 4 e 5</p>
            <p>Luis Anselmo, Salvador-BA, Brasil</p>
            <p>CEP. 40.260-215</p>
          </Box>
          <div className="contact">
            <p>+55 (71) 3272-3504</p>
            <p>contato@algetec.com.br</p>
          </div>
        </Info>
      </Section>
      <Copyright>
        <p>© COPYRIGHT 2022. Todos os direitos reservados. Desenvolvido por Algetec+</p>
      </Copyright>
    </FooterContainer>
  );
}
