import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import meet from '../../images/meet2.jpg';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/userActions.js';

const Login = ({ history }) => {
	const dispatch = useDispatch();
	const { authenticated, error } = useSelector((state) => state.auth.user);

	const [form] = Form.useForm();

	useEffect(() => {
		if (authenticated) {
			history.push('/home');
		}
	}, [authenticated, history]);

	useEffect(() => {
		const { path, message } = error;
		form.setFields([{ name: path, errors: [message] }]);
	}, [error]);

	const handleSubmit = async (data) => {
		dispatch(login(data));
	};

	return (
		<div className="login">
			<Row justify="space-around" align="middle">
				<Col span={8}>
					<img className="logo" src={meet} alt="Meeting" />
				</Col>
				<Col span={8}>
					<Form name="login" form={form} onFinish={handleSubmit} className="login-form">
						<Form.Item
							name="email"
							rules={[
								{
									required: true,
									message: 'Informe o email',
								},
							]}
						>
							<Input
								placeholder="Informe o Email"
								prefix={<UserOutlined className="site-form-item-icon" />}
							/>
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: 'Informe a senha',
								},
							]}
						>
							<Input.Password
								prefix={<LockOutlined className="site-form-item-icon" />}
								placeholder="Informe a Senha"
							/>
						</Form.Item>
						<Button type="primary" htmlType="submit" className="login-button">
							Entrar
						</Button>
					</Form>
				</Col>
			</Row>
		</div>
	);
};

export default withRouter(Login);
