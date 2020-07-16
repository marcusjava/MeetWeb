import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import pt_BR from 'antd/es/locale/pt_BR';
import { ConfigProvider } from 'antd';
import 'moment/locale/pt-br';
import moment from 'moment';

moment.locale('pt-br');

ReactDOM.render(
	<ConfigProvider locale={pt_BR}>
		<App />
	</ConfigProvider>,
	document.getElementById('root')
);
