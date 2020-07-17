import React, { useState, useEffect } from 'react';
import { Table, Typography, Input, Button, Spin, Radio } from 'antd';
import CadModal from './CadModal';

import { SearchOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const LocalTable = ({ places, getPlaces }) => {
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [searchColumn, setSearchColumn] = useState('');

	useEffect(() => {
		if (places) {
			setData(
				places.map((local) => ({
					key: local._id,
					name: local.name,
					email: local.email,
					address: local.address,
					contact1: local.contact1,
					contact2: local.contact2,
					ip: local.ip,
				}))
			);
		}
	}, [places]);

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
			return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
		},
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) setTimeout(() => searchInput.select());
		},
	});

	const columns = [
		{
			title: 'Descrição',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps('name'),
		},
		{ title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.length - b.email.length },
		{
			title: 'Endereço',
			dataIndex: 'address',
			key: 'address',
			render: (address) => {
				return address ? (
					<Text>
						{address.street},{address.city} - {address.state}
					</Text>
				) : null;
			},
		},
		{ title: 'Contato 1', dataIndex: 'contact1', key: 'contact1' },
		{ title: 'Contato 2', dataIndex: 'contact2', key: 'contact2' },
		{ title: 'IP', dataIndex: 'ip', key: 'ip' },
		{
			title: 'Açoes',
			render: (record) => {
				return <CadModal editMode={true} places={getPlaces} data={record} />;
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

	return data.length > 0 ? <Table dataSource={data} columns={columns} /> : <Spin size="large" />;
};

export default LocalTable;
