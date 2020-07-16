import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Spin, Row, Col, message, Card } from 'antd';
import UploadFile from '../../components/Upload';
import { useParams, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';

const Profile = () => {
	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	const [form] = Form.useForm();

	const history = useHistory();

	const { id } = useParams();

	useEffect(() => {
		async function getUser() {
			setLoading(true);
			const response = await axios.get(`/users/${id}`);
			setUser(response.data);
			setLoading(false);
		}
		getUser();
	}, [id]);

	useEffect(() => {
		form.setFieldsValue({
			id: user.id,
			name: user.name,
			email: user.email,
			contact1: user.contact1,
			contact2: user.contact2,
		});
	}, [user]);

	const handleSubmit = async (data) => {
		console.log(data);
		try {
			const schema = Yup.object().shape({
				password: Yup.string().oneOf([Yup.ref('password2'), null], 'Senhas não conferem!'),
			});
			await schema.validate(data, { abortEarly: false });
			const updated = new FormData();
			updated.append('avatar', selectedFile);
			updated.append('id', data.id);
			updated.append('name', user.name);
			updated.append('email', user.email);
			updated.append('local', user.local.id);
			updated.append('contact1', data.contact1);
			updated.append('contact2', data.contact2);
			updated.append('password', data.password);
			updated.append('role', user.role);
			updated.append('status', user.role);
			axios
				.put(`/users/${id}`, updated)
				.then((response) => {
					message.success('Usuario atualizado com sucesso');
					history.push('/home');
				})
				.catch((error) => {
					const { path, message } = error.response.data;
					form.setFields([{ name: path, errors: [message] }]);
				});
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				error.inner.forEach((erro) => {
					form.setFields([{ name: erro.path, errors: [erro.message] }]);
				});
			}
		}
	};

	return loading ? (
		<Col span={12}>
			<Row justify="center">
				<Spin />
			</Row>
		</Col>
	) : (
		<Row>
			<Col span={24}>
				<Card bordered={false} style={{ width: '50%' }}>
					<Form name="profile" form={form} layout="vertical" onFinish={handleSubmit}>
						<Row justify="center">
							<Col span={8}>
								<Form.Item name="avatar">
									<UploadFile
										onFileUpload={setSelectedFile}
										imageURL={user.avatar_url ? user.avatar_url : null}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Form.Item name="id">
							<Input type="hidden" />
						</Form.Item>
						<Row>
							<Col span={12}>
								<Form.Item
									name="name"
									label="Nome"
									rules={[
										{
											message: 'Informe o nome',
										},
									]}
								>
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Form.Item>
								<Form.Item
									name="contact1"
									label="Contato 1"
									rules={[
										{
											message: 'Informe ao menos um contato',
											pattern: /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
										},
									]}
									style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
								>
									<Input placeholder="99 98888-8888" />
								</Form.Item>
								<Form.Item
									name="contact2"
									label="Contato 2"
									rules={[
										{
											message: 'Formato incorreto',
											pattern: /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
										},
									]}
									style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
								>
									<Input placeholder="99 98888-8888" />
								</Form.Item>
							</Form.Item>
						</Row>
						<Row>
							<Form.Item>
								<Form.Item
									name="password"
									label="Nova Senha"
									style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
								>
									<Input.Password />
								</Form.Item>
								<Form.Item
									name="password2"
									label="Confirma Nova Senha"
									style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
								>
									<Input.Password />
								</Form.Item>
							</Form.Item>
						</Row>
						<Button type="primary" htmlType="submit">
							Salvar
						</Button>
						<Button type="danger" htmlType="button">
							Limpar
						</Button>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};

export default Profile;
