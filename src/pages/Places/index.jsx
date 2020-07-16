import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import api from '../../utils/api';
import Table from './Table';
import CadModal from './CadModal';

const Places = () => {
	const [places, setPlaces] = useState([]);
	const [place, setPlace] = useState({});

	const getPlaces = async () => {
		console.log('get places');
		const response = await api.get('/locals');
		setPlaces(response.data);
	};

	useEffect(() => {
		getPlaces();
	}, []);
	return (
		<div className="places">
			<Row justify="center" align="middle"></Row>
			<Row justify="end" style={{ marginTop: '150px' }}>
				<Col span={24}>
					<CadModal places={getPlaces} />
				</Col>
			</Row>
			<Row justify="center" style={{ marginTop: '30px' }}>
				<Col span={24}>
					<Table places={places} getPlaces={getPlaces} />
				</Col>
			</Row>
		</div>
	);
};

export default Places;
