import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { FcHome, FcBusinessman, FcShop, FcWebcam, FcVoicePresentation } from 'react-icons/fc';

const Breadcrumbs = ({ location }) => {
	const pathSnippets = location.pathname.split('/').filter((i) => i);
	const extraBreadcrumbItems = pathSnippets.map((path, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

		let icon;

		let name;

		if (path === 'home') {
			icon = <FcHome size={22} />;
			name = 'Home';
		}
		if (path === 'usuarios') {
			icon = <FcBusinessman size={22} />;
			name = 'Usuarios';
		}

		if (path === 'localidades') {
			icon = <FcShop size={22} />;
			name = 'Localidades';
		}
		if (path === 'agendar') {
			icon = <FcWebcam size={22} />;
			name = 'Agendar Videoconferencia';
		}

		if (path === 'chat') {
			icon = <FcVoicePresentation size={22} />;
			name = 'Chat';
		}

		if (path === 'usuario') {
			icon = <FcBusinessman size={22} />;
			name = 'Perfil';
		}

		return (
			<Breadcrumb.Item key={index} style={{ fontWeight: 'bold', fontSize: '18pt' }}>
				{icon}
				<Link to={url}>{name}</Link>
			</Breadcrumb.Item>
		);
	});

	return <Breadcrumb style={{ margin: '16px 0' }}>{extraBreadcrumbItems}</Breadcrumb>;
};

export default withRouter(Breadcrumbs);
