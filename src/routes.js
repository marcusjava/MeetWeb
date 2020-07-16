import React from 'react';
import Loadable from 'react-loadable';
import Spinner from './components/layout/Spinner';

const Loading = () => <Spinner />;

const Dashboard = Loadable({
	loader: () => import('./pages/Dashboard'),
	loading: Loading,
});

const Places = Loadable({
	loader: () => import('./pages/Places'),
	loading: Loading,
});

const Users = Loadable({
	loader: () => import('./pages/Users'),
	loading: Loading,
});

const Meeting = Loadable({
	loader: () => import('./pages/Meeting'),
	loading: Loading,
});

const Profile = Loadable({
	loader: () => import('./pages/Profile'),
	loading: Loading,
});

const Chat = Loadable({
	loader: () => import('./pages/Chat'),
	loading: Loading,
});

const routes = [
	{ path: '/home', name: 'Home', Component: Dashboard, exact: true },
	{
		path: '/home/chat/:id',
		name: 'Chat',
		Component: Chat,
	},
	{ path: '/home/agendar', name: 'Agendar Audiencia', Component: Meeting },
	{ path: '/home/localidades', name: 'Localidades', Component: Places, role: 'Administrador' },
	{ path: '/home/usuarios', name: 'Usuarios', Component: Users, role: 'Administrador' },
	{ path: '/home/usuario/:id', name: 'Perfil', Component: Profile, role: 'Administrador' },
];

export default routes;
