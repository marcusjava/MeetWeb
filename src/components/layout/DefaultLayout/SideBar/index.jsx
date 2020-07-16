import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../../redux/actions/userActions';
import { Layout, Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';

import {
	CalendarOutlined,
	HomeOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
	LogoutOutlined,
	EnvironmentOutlined,
	CrownOutlined,
} from '@ant-design/icons';
import './styles.css';

import logo from '../../../../images/video-conference.png';
const { Sider } = Layout;
const { SubMenu } = Menu;

const SideBar = () => {
	const [collapsed, setCollapsed] = useState(true);

	const { avatar_url, id, name } = useSelector((state) => state.auth.user.credentials);

	console.log(avatar_url);

	const dispatch = useDispatch();

	const onCollapse = (collapsed) => {
		setCollapsed(collapsed);
	};

	return (
		<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
			<div className="logo-sidebar">
				<img src={logo} alt="logo" style={{ height: '50px', width: '50px' }} />
			</div>
			<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
				<Menu.Item key="1" icon={<HomeOutlined />}>
					<Link to="/home">Home</Link>
				</Menu.Item>
				<Menu.Item key="2" icon={<CalendarOutlined />}>
					<Link to="/home/agendar">Agendar Audiencia</Link>
				</Menu.Item>

				<SubMenu key="sub2" icon={<CrownOutlined />} title="Administrador">
					<Menu.Item key="3" icon={<TeamOutlined />}>
						<Link to="/home/usuarios">Usuarios</Link>
					</Menu.Item>
					<Menu.Item key="4" icon={<EnvironmentOutlined />}>
						<Link to="/home/localidades">Locais</Link>
					</Menu.Item>
					<Menu.Item key="5">Team 2</Menu.Item>
				</SubMenu>
				<SubMenu key="sub1" icon={<Avatar src={avatar_url} />}>
					<Menu.Item key="6">{name}</Menu.Item>
					<Menu.Item key="7" icon={<UserOutlined />}>
						<Link to={`/home/usuario/${id}`}>Perfil</Link>
					</Menu.Item>

					<Menu.Item key="8" icon={<LogoutOutlined />} onClick={() => dispatch(logout())}>
						Sair
					</Menu.Item>
				</SubMenu>
			</Menu>
		</Sider>
	);
};

export default SideBar;
