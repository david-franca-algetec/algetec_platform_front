import { DesktopIcon, ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { logout } from '../../config/reducers/authSlice';
import { useLogoutMutation } from '../../services/auth.service';
import { Title } from '../text';
import {
  Box,
  HeaderBreadcrumb,
  HeaderContainer,
  HeaderContent,
  HeaderLoginArea,
  HeaderUser,
  HeaderUserTitle,
  UserMenu,
  UserMenuItem,
} from './styles';

export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [logoutFromServer, { isSuccess: isLogoutSuccess, isError: isLogoutError }] = useLogoutMutation();

  useEffect(() => {
    if (isLogoutSuccess) {
      toast.success('Logout realizado com sucesso!');
      dispatch(logout());
    } else if (isLogoutError) {
      toast.error('Erro ao realizar logout!');
    }
  }, [isLogoutSuccess, isLogoutError]);

  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderBreadcrumb>
          <Title size="extraLarge">Plataforma Algetec</Title>
          {/* <Breadcrumbs /> */}
        </HeaderBreadcrumb>
      </HeaderContent>
      <HeaderLoginArea>
        <HeaderUser
          css={{
            [`&:hover ${UserMenu}`]: {
              display: 'block',
            },
          }}
        >
          {user && (
            <Box>
              <Box css={{ display: 'flex' }}>
                <HeaderUserTitle>{user.name}</HeaderUserTitle>
                <PersonIcon />
              </Box>

              <UserMenu>
                {user.name === 'editor' ? (
                  <UserMenuItem
                    type="button"
                    css={{
                      '& a': {
                        display: 'flex',
                        alignItems: 'center',
                        color: 'inherit',
                        textDecoration: 'none',
                        gap: '10px',
                      },
                    }}
                  >
                    <Link to="/dashboard">
                      Dashboard <DesktopIcon />
                    </Link>
                  </UserMenuItem>
                ) : null}
                <UserMenuItem
                  type="button"
                  onClick={() => {
                    logoutFromServer();
                  }}
                >
                  Sair
                  <ExitIcon />
                </UserMenuItem>
              </UserMenu>
            </Box>
          )}
        </HeaderUser>
      </HeaderLoginArea>
    </HeaderContainer>
  );
}
