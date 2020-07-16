import React, { useState, useEffect } from 'react';
import Table from '../Meeting/Table';
import { Row, Col } from 'antd';

const Dashboard = () => {
	return (
		<div className="dashboard">
			<Table />
		</div>
	);
};

export default Dashboard;
