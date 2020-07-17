import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Spin, Row, Col, message } from 'antd';
import { FcManager, FcDocument } from 'react-icons/fc';
import './styles.css';
import * as Yup from 'yup';
import axios from 'axios';

const { Option } = Select;

const PlaceModal = ({ places, editMode = false, data }) => {
	const [visible, setVisible] = useState(false);

	const [uf, setUF] = useState([]);
	const [selectedUF, setSelectedUF] = useState('');
	const [city, setCity] = useState([]);
	const [selectedCity, setSelectedCity] = useState('');

	const [form] = Form.useForm();

	useEffect(() => {
		async function getUF() {
			const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
			setUF(response.data);
		}
		getUF();
	}, []);

	useEffect(() => {
		if (editMode && visible) {
			form.setFieldsValue({
				id: data.key,
				name: data.name,
				email: data.email,
				contact1: data.contact1,
				contact2: data.contact2,
				address: {
					street: data.address.street,
					neighborhood: data.address.neighborhood,
					state: data.address.state,
					city: data.address.city,
					cep: data.address.cep,
				},
				ip: data.ip,
			});
		}
	}, [editMode, visible]);

	useEffect(() => {
		async function getCity() {
			if (selectedUF === '0') return;
			const response = await axios.get(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
			);
			setCity(response.data);
		}
		getCity();
	}, [selectedUF]);

	const handleSubmit = async (data) => {
		console.log(data);
		try {
			const schema = Yup.object().shape({
				name: Yup.string().required('Nome do local obrigatorio'),
				email: Yup.string().email('Formato incorreto'),
			});
			await schema.validate(data, { abortEarly: false });
			try {
				const local = {
					name: data.name,
					email: data.email,
					address: {
						street: data.address.street,
						neighborhood: data.address.neighborhood,
						city: data.address.city,
						state: data.address.state,
						cep: data.address.cep,
					},
					contact1: data.contact1,
					contact2: data.contact2,
					ip: data.ip,
				};
				if (editMode) {
					await axios.put(`/locals/${data.id}`, local);
					message.success('Local atualizado com sucesso');
				} else {
					const response = await axios.post('/locals', local);
					if (response.status === 201) {
						message.success('Local criado com sucesso');
					}
				}
				form.resetFields();
				places();
				setVisible(false);
			} catch (error) {
				const { path, message } = error.response.data;
				form.setFields([{ name: path, errors: [message] }]);
			}
		} catch (error) {
			if (error instanceof Yup.ValidationError) {
				error.inner.forEach((erro) => {
					form.setFields([{ name: erro.path, errors: [erro.message] }]);
				});
			}
		}
	};

	const onClose = (e) => {
		form.resetFields();
	};

	const onCancel = (e) => {
		form.resetFields();
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
				title="Cadastro Local"
				visible={visible}
				centered
				destroyOnClose
				footer={null}
				onCancel={() => setVisible(false)}
				afterClose={onClose}
				forceRender
			>
				<Form name="new-local" form={form} onFinish={handleSubmit} layout="horizontal">
					<Form.Item name="id">
						<Input type="hidden" />
					</Form.Item>
					<Form.Item
						name="name"
						label="Descrição"
						rules={[
							{
								required: true,
								message: 'Informe o nome do local',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name="email" label="Email">
						<Input />
					</Form.Item>
					<Form.Item>
						<Form.Item
							name="contact1"
							label="Contato 1"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<Input placeholder="XX XXXX-XXXX" />
						</Form.Item>
						<Form.Item
							name="contact2"
							label="Contato 2"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
						>
							<Input placeholder="XX XXXX-XXXX" />
						</Form.Item>
					</Form.Item>
					<Form.Item name={['address', 'street']} label="Rua">
						<Input />
					</Form.Item>
					<Form.Item name={['address', 'neighborhood']} label="Bairro">
						<Input />
					</Form.Item>
					<Form.Item>
						<Form.Item
							name={['address', 'state']}
							label="Estado"
							style={{ display: 'inline-block', width: '30%', marginRight: '5px' }}
						>
							<Select
								showSearch
								placeholder="Selecione"
								onChange={(value) => setSelectedUF(value)}
								notFoundContent={uf.length === 0 ? <Spin size="small" /> : null}
							>
								{uf.map((item) => (
									<Option key={item.id} value={item.sigla}>
										{item.sigla}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							name={['address', 'city']}
							label="Cidade"
							style={{ display: 'inline-block', width: '300px' }}
						>
							<Select
								showSearch
								placeholder="Selecione"
								disabled={selectedUF === ''}
								onChange={(value) => setSelectedCity(value)}
								notFoundContent={city.length === 0 ? <Spin size="small" /> : null}
							>
								{city.map((item) => (
									<Option key={item.id} value={item.nome}>
										{item.nome}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Form.Item>

					<Form.Item>
						<Form.Item
							name={['address', 'cep']}
							label="CEP"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<Input />
						</Form.Item>

						<Form.Item
							name="ip"
							label="IP aparelho"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
						>
							<Input />
						</Form.Item>
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

export default PlaceModal;
