import React from 'react';
import { Card, Row, Col, Form, Input, Button, Modal } from 'antd';
import Table from './Table';
import CadModal from './CadModal';

const Users = () => {
	return (
		<div className="users">
			<Row justify="center" align="middle"></Row>
			<Row justify="end" style={{ marginTop: '150px' }}>
				<Col span={24}>
					<CadModal />
				</Col>
			</Row>
			<Row justify="center" style={{ marginTop: '30px' }}>
				<Col span={24}>
					<Table />
				</Col>
			</Row>
		</div>
	);
};

export default Users;
