import React, { useEffect, useState } from 'react';
import { Table, Popover, Tag, Input, Button, Avatar, DatePicker, Switch, Row, Col } from 'antd';
import Spinner from '../../components/layout/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { list, update } from '../../redux/actions/meetActions';
import { Link } from 'react-router-dom';
import {
	SearchOutlined,
	CloseOutlined,
	CheckOutlined,
	CheckCircleTwoTone,
	InfoCircleTwoTone,
	CloseCircleTwoTone,
	MessageTwoTone,
} from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

const statusColors = {
	Agendada: 'processing',
	Realizada: 'success',
	'Em andamento': 'warning',
	Cancelada: 'error',
};

const MeetTable = () => {
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [selectedDate, setSelectedDate] = useState([]);
	const [searchColumn, setSearchColumn] = useState('');
	const [toggle, setToggle] = useState(true);

	const dispatch = useDispatch();

	const { items, loading } = useSelector((state) => state.meeting.meetings);

	const getMeetings = () => {
		dispatch(list({ myMeets: true }));
	};

	useEffect(() => {
		getMeetings();
	}, []);

	useEffect(() => {
		console.log(items);
		if (items) {
			setData(
				items.map((meet) => ({
					key: meet._id,
					date: meet.date,
					description: meet.description,
					participants: meet.participants,
					room_link: meet.room_link,
					observations: meet.observations,
					status: meet.status,
				}))
			);
		}
	}, [items]);

	let searchInput = null;

	const getColumnSearchProps = (dataIndex, name) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						searchInput = node;
					}}
					placeholder="Buscar"
					value={selectedKeys[0]}
					onChange={(e) => {
						return setSelectedKeys(e.target.value ? [e.target.value] : []);
					}}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Buscar
				</Button>
				<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Limpar
				</Button>
			</div>
		),
		filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) => {
			if (dataIndex === 'participants') {
				return record[dataIndex].find((item) => {
					return item.local.name.toString().toLowerCase().includes(value.toLowerCase());
				});
			}
			return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
		},
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) setTimeout(() => searchInput.select());
		},
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		console.log(selectedKeys[0], dataIndex);
		setSearchText(selectedKeys[0]);
		setSearchColumn(dataIndex);
	};

	const handleDateSearch = () => {
		const start = selectedDate[0].format('YYYY-MM-DD');
		const end = selectedDate[1].format('YYYY-MM-DD');
		dispatch(list({ start, end }));
	};

	const handleDateClear = () => {
		setSelectedDate([]);
		dispatch(list());
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const toggleHandle = (checked, e) => {
		if (checked === true) {
			dispatch(list({ myMeets: true }));
		} else {
			dispatch(list());
		}
		setToggle(checked);
	};

	const changeStatus = (record, status) => {
		const updated = { ...record, status };
		console.log(updated);
		dispatch(update(updated, updated.key, { myMeets: true }));
	};

	const columns = [
		{
			key: 'date',
			title: 'Data/Hora',
			dataIndex: 'date',
			render: (date) => <strong>{moment(date).format('DD/MM/YYYY HH:mm')}</strong>,
			sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
			filterDropdown: () => (
				<div style={{ padding: 8, display: 'flex', flexDirection: 'column' }}>
					<RangePicker
						ref={(node) => {
							searchInput = node;
						}}
						value={selectedDate}
						onChange={(dates) => setSelectedDate(dates)}
						style={{ marginBottom: 8 }}
						size="small"
					/>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							type="primary"
							disabled={selectedDate.length < 2}
							onClick={() => handleDateSearch()}
							icon={<SearchOutlined />}
							size="small"
							style={{ width: 90, marginRight: 8 }}
						>
							Buscar
						</Button>
						<Button onClick={() => handleDateClear()} size="small" style={{ width: 90 }}>
							Limpar
						</Button>
					</div>
				</div>
			),
			filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		},
		{
			key: 'description',
			title: 'Descrição',
			dataIndex: 'description',
		},
		{
			key: 'participants',
			title: 'Participantes',
			dataIndex: 'participants',
			render: (participants) => {
				return participants.map((participant) => {
					const content = (
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<Avatar
								src={participant.avatar_url}
								style={{ width: '125px', height: '125px', alignSelf: 'center' }}
							/>
							<p>Nome - {participant.name}</p>
							<p>Email - {participant.email}</p>
							<p>
								Contato - {participant.contact1} - {participant.contact2}
							</p>

							<p>Email Local - {participant.local.email}</p>
							<p>
								Telefone Local - {participant.local.contact1} - {participant.local.contact2}{' '}
							</p>
							<p>Cidade - {participant.local.address.city}</p>
							<p>Estado - {participant.local.address.state}</p>
						</div>
					);
					return (
						<div
							key={participant._id}
							style={{ display: 'flex', flexDirection: 'column', marginBottom: '5px' }}
						>
							<Popover title="Dados tecnicos" content={content}>
								{participant.local.name}
							</Popover>
						</div>
					);
				});
			},
			...getColumnSearchProps('participants'),
		},
		{
			key: 'room_link',
			title: 'Link da Sala',
			dataIndex: 'room_link',
		},
		{
			key: 'observations',
			title: 'Observações',
			dataIndex: 'observations',
		},
		{
			key: 'status',
			title: 'Status',
			dataIndex: 'status',
			filters: [
				{ text: 'Agendada', value: 'Agendada' },
				{ text: 'Realizada', value: 'Realizada' },
				{ text: 'Em andamento', value: 'Em andamento' },
				{ text: 'Cancelada', value: 'Cancelada' },
			],
			onFilter: (value, record) => record.status.indexOf(value) === 0,
			render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
		},
		{
			title: 'Açoes',
			render: (record) => {
				return (
					<div>
						<Button
							style={{
								border: 'none',
								fontSize: 25,
								backgroundColor: 'transparent',
								margin: 5,
								padding: 0,
							}}
							onClick={() => changeStatus(record, 'Realizada')}
						>
							<CheckCircleTwoTone
								twoToneColor={record.status === 'Realizada' ? '#52c41a' : '#CBCE91FF'}
							/>
						</Button>
						<Button
							style={{
								border: 'none',
								fontSize: 25,
								backgroundColor: 'transparent',
								margin: 5,
								padding: 0,
							}}
							onClick={() => changeStatus(record, 'Em andamento')}
						>
							<InfoCircleTwoTone
								twoToneColor={record.status === 'Em andamento' ? '#5B84B1FF' : '#CBCE91FF'}
							/>
						</Button>
						<Button
							style={{
								border: 'none',
								fontSize: 25,
								backgroundColor: 'transparent',
								margin: 5,
								padding: 0,
							}}
							onClick={() => changeStatus(record, 'Cancelada')}
						>
							<CloseCircleTwoTone
								twoToneColor={record.status === 'Cancelada' ? '#ED2B33FF' : '#CBCE91FF'}
							/>
						</Button>
						<Link
							style={{
								border: 'none',
								fontSize: 25,
								backgroundColor: 'transparent',
								margin: 5,
								padding: 0,
							}}
							to={`/home/chat/${record.key}`}
						>
							<MessageTwoTone twoToneColor="FC9E5B" />
						</Link>
					</div>
				);
			},
		},
	];

	return !loading ? (
		<div className="container">
			<Row style={{ marginBottom: 15 }}>
				<Col>
					<Switch
						checked={toggle}
						onChange={toggleHandle}
						checkedChildren={<CheckOutlined />}
						unCheckedChildren={<CloseOutlined />}
						defaultChecked
						checkedChildren="Minhas"
						unCheckedChildren="Todas"
					/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Table dataSource={data} columns={columns} />
				</Col>
			</Row>
		</div>
	) : (
		<Spinner />
	);
};

export default MeetTable;
