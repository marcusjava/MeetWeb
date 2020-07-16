import React, { useEffect, useState } from 'react';
import { Table, Typography, Popover, Tag, Input, Button, Space } from 'antd';
import Spinner from '../../components/layout/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/actions/userActions';
import { SearchOutlined } from '@ant-design/icons';
import CadModal from './CadModal';
import moment from 'moment';

const { Text, Link } = Typography;

const UsersTable = () => {
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [searchColumn, setSearchColumn] = useState('');

	const dispatch = useDispatch();

	const { items } = useSelector((state) => state.auth.users);

	const loadUsers = () => {
		dispatch(getUsers());
	};

	useEffect(() => {
		loadUsers();
	}, []);

	useEffect(() => {
		if (items) {
			setData(
				items.map((user) => ({
					key: user._id,
					name: user.name,
					email: user.email,
					contact1: user.contact1,
					contact2: user.contact2,
					local: user.local,
					role: user.role,
					createdAt: user.createdAt,
					status: user.status,
					avatar: user.avatar_url,
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
					onPressEnter={() => handleSearch(selectedKeys, confirm)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm)}
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
			if (dataIndex === 'local') {
				return record[dataIndex].name.toString().toLowerCase().includes(value.toLowerCase());
			}
			return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
		},
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) setTimeout(() => searchInput.select());
		},
	});

	const columns = [
		{
			title: '',
			dataIndex: 'avatar',
			key: 'avatar',
			render: (avatar) => (
				<img src={avatar} alt="perfil" style={{ width: '50px', height: '50px', borderRadius: '50px' }} />
			),
		},
		{ title: 'Nome', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name') },
		{ title: 'Email', dataIndex: 'email', key: 'email', ...getColumnSearchProps('email') },
		{
			title: 'Localidade',
			dataIndex: 'local',
			key: 'local',
			render: (local) => {
				const content = (
					<div>
						<p>Email - {local.email}</p>
						<p>Contato - {local.contact1}</p>
						<p>Cidade - {local.address.city}</p>
						<p>Estado - {local.address.state}</p>
					</div>
				);
				return (
					<Popover title={local.name} content={content}>
						<p>{local.name}</p>
					</Popover>
				);
			},
			...getColumnSearchProps('local'),
		},
		{ title: 'Contato 1', dataIndex: 'contact1', key: 'contact1' },
		{ title: 'Contato 2', dataIndex: 'contact2', key: 'contact2' },
		{
			title: 'Grupo',
			dataIndex: 'role',
			key: 'role',
			filters: [
				{ text: 'Usuario', value: 'Usuario' },
				{ text: 'Administrador', value: 'Administrador' },
			],
			onFilter: (value, record) => record.role.indexOf(value) === 0,
			sorter: (a, b) => a.role.length - b.role.length,
			render: (role) => <Tag color={role === 'Usuario' ? 'purple' : 'green'}>{role}</Tag>,
		},
		{
			title: 'Criado em',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (text) => moment(text).format('DD-MM-YYYY HH:mm'),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text) => <Tag color={text === 'Ativo' ? '#2db7f5' : '#f50'}>{text}</Tag>,
		},
		{
			title: 'Açoes',
			render: (record) => {
				return <CadModal editMode={true} data={record} />;
			},
		},
	];

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};
	return items.length > 0 ? <Table dataSource={data} columns={columns} /> : <Spinner />;
};

export default UsersTable;
