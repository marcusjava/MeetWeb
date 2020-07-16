import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { FrownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const NotFound = () => (
	<div
		style={{
			marginTop: 200,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
		}}
	>
		<FrownOutlined style={{ fontSize: 200 }} />
		<h1>Pagina não encontrada</h1>
		<Link to="/">voltar</Link>
	</div>
);

export default NotFound;
