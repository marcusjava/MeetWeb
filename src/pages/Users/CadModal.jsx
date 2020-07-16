import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Spin, Row, Col, message } from 'antd';
import { FcManager, FcDocument } from 'react-icons/fc';
import { register, updateUser } from '../../redux/actions/userActions';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './styles.css';
import UploadFile from '../../components/Upload';
import * as Yup from 'yup';

const { Option } = Select;

const UserModal = ({ editMode = false, data }) => {
	const [visible, setVisible] = useState(false);
	const [locations, setLocations] = useState([]);
	const [filteredLocations, setFilteredLocations] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const { success, error } = useSelector((state) => state.auth.user);

	async function getLocations() {
		const response = await axios.get('/locals');
		setLocations(response.data);
	}

	useEffect(() => {
		getLocations();
	}, []);

	useEffect(() => {
		if (editMode && visible) {
			form.setFieldsValue({
				id: data.key,
				name: data.name,
				email: data.email,
				local: data.local.id,
				contact1: data.contact1,
				contact2: data.contact2,
				role: data.role,
				status: data.status,
			});
		}
	}, [editMode, visible]);

	useEffect(() => {
		if (success && visible) {
			message.success('Usuario atualizado com sucesso');
			setVisible(false);
			form.resetFields();
		}

		if (error && visible) {
			form.setFields([{ name: error.path, errors: [error.message] }]);
		}
	}, [error, success]);

	const handleSubmit = async (data) => {
		try {
			const schema = Yup.object().shape({
				password: Yup.string().oneOf([Yup.ref('password2'), null], 'Senhas não conferem!'),
			});
			await schema.validate(data, { abortEarly: false });
			const newUser = new FormData();
			newUser.append('avatar', selectedFile);
			newUser.append('id', data.id);
			newUser.append('email', data.email);
			newUser.append('name', data.name);
			newUser.append('local', data.local);
			newUser.append('password', data.password);
			newUser.append('password2', data.password2);
			newUser.append('contact1', data.contact1);
			newUser.append('contact2', data.contact2);
			newUser.append('role', data.role);
			newUser.append('status', data.status);
			editMode ? dispatch(updateUser(newUser, data.id)) : dispatch(register(newUser));
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				error.inner.forEach((erro) => {
					form.setFields([{ name: erro.path, errors: [erro.message] }]);
				});
			}
		}
	};

	const searchLocations = (value) => {
		const filtered = locations
			.map((l) => ({ ...l, name: l.name.toLowerCase() }))
			.filter((l) => l.name.includes(value.toLowerCase()));

		setFilteredLocations(filtered);
	};

	const onClose = (e) => {
		form.resetFields();
		setSelectedFile(null);
	};

	const onCancel = (e) => {
		form.resetFields();
		setSelectedFile(null);
		setVisible(false);
	};

	const buttonType = editMode ? (
		<FcDocument size={18} onClick={() => setVisible(true)} style={{ cursor: 'pointer' }} />
	) : (
		<Button
			type="primary"
			icon={<FcManager size={18} />}
			onClick={() => setVisible(true)}
			style={{ fontSize: '16px' }}
		>
			Novo
		</Button>
	);

	return (
		<div>
			{buttonType}
			<Modal
				title="Cadastro Usuario"
				visible={visible}
				centered
				destroyOnClose
				footer={null}
				onCancel={() => setVisible(false)}
				afterClose={onClose}
				forceRender
			>
				<Form name="new-user" form={form} onFinish={handleSubmit}>
					<Row justify="center">
						<Col span={8}>
							<Form.Item name="avatar">
								<UploadFile onFileUpload={setSelectedFile} imageURL={editMode ? data.avatar : null} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name="id">
						<Input type="hidden" />
					</Form.Item>

					<Form.Item
						name="name"
						label="Nome"
						rules={[
							{
								required: true,
								message: 'Informe o nome',
							},
						]}
					>
						<Input placeholder="Informe o Nome" />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{
								required: true,
								message: 'Informe o email',
								type: 'email',
							},
						]}
					>
						<Input placeholder="Informe o Email" />
					</Form.Item>
					<Form.Item
						name="local"
						label="Localidade"
						rules={[
							{
								required: true,
								message: 'Informe o local',
							},
						]}
					>
						<Select
							showSearch
							placeholder="Selecione uma localidade"
							optionFilterProp="children"
							onSearch={searchLocations}
							notFoundContent={locations.length === 0 ? <Spin size="small" /> : null}
							filterOption={(input, option) => {
								return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
							}}
						>
							{locations.map((location) => (
								<Option key={location._id} value={location._id}>
									{location.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item>
						<Form.Item
							name="password"
							label="Senha"
							rules={[{ required: editMode ? false : true, message: 'Informe a senha' }]}
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<Input.Password placeholder="Senha" />
						</Form.Item>
						<Form.Item
							name="password2"
							label="Confirma senha"
							rules={[{ required: editMode ? false : true, message: 'Confirme a senha' }]}
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
						>
							<Input.Password placeholder="Confirma Senha" />
						</Form.Item>
					</Form.Item>
					<Form.Item>
						<Form.Item
							name="contact1"
							label="Contato 1"
							rules={[
								{
									required: true,
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
					<Form.Item>
						<Form.Item
							name="role"
							label="Grupo"
							rules={[{ required: true, message: 'Informe a qual grupo o usuario pertence' }]}
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<Select placeholder="Selecione o grupo">
								<Option key="Usuario">Usuario</Option>
								<Option key="Administrador">Administrador</Option>
							</Select>
						</Form.Item>
						{editMode && (
							<Form.Item
								name="status"
								label="Status"
								style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
							>
								<Select placeholder="Selecione">
									<Option key="Ativo">Ativo</Option>
									<Option key="Inativo">Inativo</Option>
								</Select>
							</Form.Item>
						)}
					</Form.Item>
					<Button type="primary" htmlType="submit">
						{editMode ? 'Atualizar' : 'Salvar'}
					</Button>
					<Button type="danger" htmlType="button" onClick={onCancel}>
						Limpar
					</Button>
				</Form>
			</Modal>
		</div>
	);
};

export default UserModal;
