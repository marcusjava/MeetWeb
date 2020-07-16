import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import Table from './Table';
import CadModal from './CadModal';
import axios from 'axios';

const Places = () => {
	const [places, setPlaces] = useState([]);
	const [loading, setLoading] = useState(false);

	const getPlaces = async () => {
		setLoading(true);
		const response = await axios.get('/locals');
		setPlaces(response.data);

		setLoading(false);
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
					<Table places={places} getPlaces={getPlaces} loading={loading} />
				</Col>
			</Row>
		</div>
	);
};

export default Places;
