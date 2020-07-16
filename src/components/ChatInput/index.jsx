import React from 'react';
import { Form, Input, Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

import './styles.css';

const ChatInput = ({ message, sendMessage, setMessage, received }) => {
	return (
		<form className="form">
			<input
				type="text"
				value={message}
				placeholder="Digite o texto"
				onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
				onChange={(event) => setMessage(event.target.value)}
				className="input"
			/>
			<button
				className="sendButton"
				icon={<PoweroffOutlined />}
				onClick={(event) => sendMessage(event)}
				loading={received}
			>
				Enviar
			</button>
		</form>
	);
};

export default ChatInput;
