/* eslint-disable react/jsx-props-no-spreading */
import {
  BellOutlined,
  BuildOutlined,
  CheckOutlined,
  DownOutlined,
  ExperimentOutlined,
  FontSizeOutlined,
  HomeOutlined,
  IssuesCloseOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  RocketOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { gray } from '@radix-ui/colors';
import { nanoid } from '@reduxjs/toolkit';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Drawer,
  Dropdown,
  Empty,
  FloatButton,
  Grid,
  Image,
  Layout,
  Menu,
  MenuProps,
  message,
  Popover,
  Space,
  Switch,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { orderBy } from 'lodash';
import { Key, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoBranca from '../../assets/logo-branca.png';

import logo from '../../assets/logo.png';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { api } from '../../config/reducers/apiSlice';
import { logout, selectCurrentUser, setMode } from '../../config/reducers/authSlice';
import { getUniqueColor, handleError } from '../../helpers';
import { ShowNotification } from '../../pages/Notification/show';
import { useLogoutMutation } from '../../services/auth.service';
import {
  useAllNotificationsQuery,
  useDeleteNotificationsMutation,
  useUpdateNotificationsMutation,
} from '../../services/notifications.service';
import { DateField } from '../fields';
import { Footer } from '../Footer';
import { ScrollArea } from '../ScrollArea';

const { Sider, Content, Header } = Layout;
const { Text, Link } = Typography;
const { useBreakpoint } = Grid;

interface SidebarContentProps {
  isDarkMode: boolean;
}

function SidebarContent({ isDarkMode }: SidebarContentProps) {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  type MenuItem = Required<MenuProps>['items'][number];

  const getItem = (label: ReactNode, key: Key, icon?: ReactNode, children?: MenuItem[], type?: 'group'): MenuItem =>
    ({
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem);

  const items: MenuItem[] = [
    getItem('Dashboard', 'dashboard', <HomeOutlined />),
    getItem(
      <Link
        target="_blank"
        href="https://catalogoalgetec.grupoa.education/login"
        style={{ fontSize: '16px', fontFamily: 'inherit' }}
      >
        Catálogo
      </Link>,
      'external',
      <FiExternalLink />,
    ),
    user?.role.admin ? getItem('Instituições', 'institutions', <StarOutlined />) : null,
    user?.role.admin ? getItem('Usuários', 'users', <UserOutlined />) : null,
    user?.role.demands ? getItem('Entregas', 'demands', <RocketOutlined />) : null,
    user?.role.demands ? getItem('Lançamentos', 'releases', <BuildOutlined />) : null,
    getItem('Tarefas', 'checklists', <CheckOutlined />),
    getItem('Problemas', 'issues', <IssuesCloseOutlined />),
    getItem('Laboratórios', 'labs', <ExperimentOutlined />),
    getItem('Documentos', 'documents', <FontSizeOutlined />),
    getItem('Currículos', 'curriculums', <ReconciliationOutlined />),
  ];

  return (
    <Menu
      mode="inline"
      theme={isDarkMode ? 'dark' : 'light'}
      style={{ fontSize: '16px' }}
      items={items}
      defaultSelectedKeys={[pathname.substring(1)]}
      onSelect={({ key }) => {
        if (key !== 'external') {
          navigate(`/${key}`);
        }
      }}
    />
  );
}

interface MobileNavProps {
  isDarkMode: boolean;
  setMode: (value: boolean) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

function MobileNav({ isDarkMode, setMode, collapsed, setCollapsed }: MobileNavProps) {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [toast, contextHolder] = message.useMessage();
  const [logoutFromServer, { isSuccess: isLogoutSuccess, isError: isLogoutError, error }] = useLogoutMutation();

  const { data: allNotifications, isLoading } = useAllNotificationsQuery(undefined, { pollingInterval: 60000 });

  const handleName = (name: string) => {
    const nameArray = name.split(' ');
    if (nameArray.length === 1) {
      return nameArray[0];
    }
    if (nameArray.length > 1) {
      return `${nameArray[0]} ${nameArray.pop()}`;
    }
    return name;
  };

  const getInitials = (name: string) => {
    const initials = name.toUpperCase().split(' ');
    if (initials.length === 1) {
      return initials[0][0];
    }
    if (initials.length > 1) {
      return `${initials[0].charAt(0)}${initials.pop()?.charAt(0)}`;
    }
    return name.toUpperCase().charAt(0);
  };
  const [id, setId] = useState<number>();
  const [notificationIds, setNotificationIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleNotifications, { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess }] =
    useDeleteNotificationsMutation();
  const [updateNotifications, { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess }] =
    useUpdateNotificationsMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setNotificationIds(checkedValues as number[]);
  };

  useEffect(() => {
    if (isLogoutSuccess) {
      toast.success('Logout realizado com sucesso!').then();
      dispatch(logout());
      dispatch(api.util.resetApiState());
    } else if (isLogoutError && error && 'data' in error) {
      toast.error(handleError(error)).then();
    }
  }, [isLogoutSuccess, isLogoutError]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setNotificationIds([]);
    }
    if (isDeleteSuccess) {
      setNotificationIds([]);
    }
  }, [isUpdateSuccess, isDeleteSuccess]);

  return (
    <Header
      style={{
        padding: 16,
        height: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isDarkMode ? '#001529' : '#FFF',
      }}
    >
      {contextHolder}
      <Space>
        <NavLink to="/dashboard">
          <Image
            src={isDarkMode ? logoBranca : logo}
            alt="Logo Algetec"
            style={{ height: '100%', maxHeight: 64 }}
            preview={false}
          />
        </NavLink>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      </Space>

      <Space>
        <Switch checkedChildren="🔆" unCheckedChildren="🌛" onChange={setMode} defaultChecked={isDarkMode} />
        <Popover
          content={
            allNotifications?.length ? (
              <Space direction="vertical">
                <ScrollArea height="50vh">
                  <Checkbox.Group onChange={onChange} value={notificationIds}>
                    <Space direction="vertical">
                      {orderBy(allNotifications, 'created_at', 'desc')?.map((el) => (
                        <Card
                          key={nanoid()}
                          bodyStyle={{
                            padding: 4,
                          }}
                          style={{
                            // eslint-disable-next-line no-nested-ternary
                            background: isDarkMode
                              ? el.read
                                ? gray.gray11
                                : gray.gray12
                              : el.read
                              ? gray.gray7
                              : 'white',
                          }}
                        >
                          <Checkbox value={el.id}>
                            <Space direction="vertical">
                              <Tooltip title={el.title}>
                                <Button
                                  type="text"
                                  onClick={() => {
                                    setId(el.id);
                                    showModal();
                                  }}
                                >
                                  <Typography.Text ellipsis style={{ width: 200 }} strong={!el.read} delete={el.read}>
                                    {el.title}
                                  </Typography.Text>
                                </Button>
                              </Tooltip>
                              <DateField value={el.created_at} className="ml-4" format="DD/MM/YYYY HH:mm" />
                            </Space>
                          </Checkbox>
                        </Card>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </ScrollArea>
                <Space direction="vertical" className="w-full">
                  <Button
                    block
                    loading={isUpdateLoading}
                    onClick={() => {
                      if (notificationIds.length > 0) {
                        updateNotifications({ id: notificationIds });
                      } else {
                        updateNotifications({ all: true });
                      }
                    }}
                  >
                    {notificationIds.length ? 'Marcar como lida' : 'Marcar todas como lida'}
                  </Button>
                  <Button
                    block
                    danger
                    type="primary"
                    loading={isDeleteLoading}
                    onClick={() => {
                      if (notificationIds.length > 0) {
                        deleNotifications({ id: notificationIds });
                      } else {
                        deleNotifications({ all: true });
                      }
                    }}
                  >
                    {notificationIds.length ? 'Deletar' : 'Deletar todas'}
                  </Button>
                </Space>
              </Space>
            ) : (
              <Empty description="Sem notificações" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
          }
        >
          <Badge count={allNotifications?.filter((el) => el.read === false).length}>
            <Button loading={isLoading} icon={<BellOutlined />} type="text" />
          </Badge>
        </Popover>
        <Dropdown
          menu={{
            items: [
              {
                label: 'Perfil',
                icon: <ProfileOutlined />,
                key: 'profile',
                onClick: () => navigate('/profile'),
              },
              { label: 'Sair', icon: <LogoutOutlined />, key: 'logout', onClick: () => logoutFromServer() },
            ],
          }}
        >
          <Button type="text" style={{ height: 'fit-content', alignSelf: 'center', justifySelf: 'center' }}>
            {user ? (
              <Space align="center">
                <Avatar style={{ backgroundColor: getUniqueColor(user.name) }}>{getInitials(user.name)}</Avatar>
                <Space direction="vertical">
                  <Text style={{ fontSize: 16 }}>{handleName(user.name)}</Text>
                  <Text style={{ fontSize: 14 }}>{user.role.name}</Text>
                </Space>
                <DownOutlined />
              </Space>
            ) : null}
          </Button>
        </Dropdown>
      </Space>
      <ShowNotification id={id} open={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />
    </Header>
  );
}

export function SidebarWithHeader({ children }: PropsWithChildren) {
  const screens = useBreakpoint();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const { isLoggedIn, isDarkMode } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const onClose = () => {
    setCollapsed(false);
  };
  const handleClick = (value: boolean) => {
    dispatch(setMode(value));
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (pathname === '/') {
    return <Navigate to="dashboard" replace />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <MobileNav setMode={handleClick} isDarkMode={isDarkMode} collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout hasSider>
          {screens.lg ? (
            <Sider
              breakpoint="lg"
              collapsedWidth={!screens.lg ? '0' : undefined}
              theme={isDarkMode ? 'dark' : 'light'}
              trigger={null}
              collapsible
              collapsed={!screens.lg ? true : collapsed}
            >
              <SidebarContent isDarkMode={isDarkMode} />
            </Sider>
          ) : (
            <Drawer
              width="50%"
              bodyStyle={{ padding: '0px', background: isDarkMode ? '#001529' : '#FFF' }}
              headerStyle={{ background: isDarkMode ? '#001529' : '#FFF' }}
              placement="left"
              onClose={onClose}
              open={collapsed}
            >
              <SidebarContent isDarkMode={isDarkMode} />
            </Drawer>
          )}
          <Content
            style={{
              padding: 16,
              background: isDarkMode ? '#00080f' : '#deedfc',
            }}
          >
            {children}
            <FloatButton.BackTop />
          </Content>
        </Layout>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
}
