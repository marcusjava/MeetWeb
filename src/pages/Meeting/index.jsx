import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Spin, Row, Col, message, Card, DatePicker, Comment, Avatar, Transfer } from 'antd';
import api from '../../utils/api';
import moment from 'moment';
import { save, clear } from '../../redux/actions/meetActions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Meeting = () => {
	const [participants, setParticipants] = useState([]);
	const [selectedKeys, setSelectedKeys] = useState([]);

	const { error, success } = useSelector((state) => state.meeting.meeting);

	const dispatch = useDispatch();

	const history = useHistory();

	const [form] = Form.useForm();

	useEffect(() => {
		async function getParticipants() {
			const response = await api.get('/users');
			setParticipants(response.data);
		}

		getParticipants();
		return function cleanup() {
			dispatch(clear());
		};
	}, []);

	useEffect(() => {
		if (success) {
			message.success('Videoconferência agendada com sucesso');
			setSelectedKeys([]);
			form.resetFields();
			history.push('/home');
		}

		if (error) {
			form.setFields([{ name: error.path, errors: [error.message] }]);
		}
	}, [error, success]);

	const handleSubmit = async (data) => {
		const newMeet = {
			date: data.date.format('YYYY-MM-DDTHH:mm'),
			description: data.description,
			participants: data.participants,
			room_link: data.room_link,
			observations: data.observations,
		};

		dispatch(save(newMeet));
	};

	const filterOption = (inputValue, option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

	const renderItems = (item) => {
		const label = (
			<Comment
				author={item.name}
				avatar={<Avatar src={item.avatar_url} alt="avatar" />}
				content={item.local.name}
			/>
		);
		return {
			label,
			value: item.name,
		};
	};

	const handleChange = (targetKeys) => {
		setSelectedKeys(targetKeys);
	};
	return (
		<Row>
			<Col span={24}>
				<Card bordered={false} style={{ width: '50%' }}>
					<Form name="cadastro" form={form} layout="vertical" onFinish={handleSubmit}>
						<Form.Item
							name="date"
							label="Data/Hora"
							rules={[
								{
									required: true,
									message: 'Informe o email',
								},
							]}
						>
							<DatePicker showTime format="DD/MM/YYYY HH:mm" />
						</Form.Item>
						<Form.Item
							name="description"
							label="Descrição"
							rules={[
								{
									required: true,
									message: 'Informe a descrição',
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item label="Participantes" name="participants">
							<Transfer
								rowKey={(record) => record.id}
								listStyle={{
									width: 350,
								}}
								dataSource={participants}
								targetKeys={selectedKeys}
								showSearch
								filterOption={filterOption}
								render={renderItems}
								onChange={handleChange}
							/>
						</Form.Item>

						<Form.Item name="room_link" label="Link da Sala">
							<Input />
						</Form.Item>
						<Form.Item name="observations" label="Observações">
							<Input.TextArea />
						</Form.Item>

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

export default Meeting;
