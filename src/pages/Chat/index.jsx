import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import ChatInfo from '../../components/ChatInfo';
import ChatInput from '../../components/ChatInput';
import ChatMessages from '../../components/ChatMessages';
import { useDipatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import api from '../../utils/api';
import './styles.css';

let socket;

const Chat = () => {
	const [userId, setUserId] = useState('');
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [received, setReceived] = useState(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	const { id } = useParams();

	const { credentials } = useSelector((state) => state.auth.user);

	useEffect(() => {
		socket = io(process.env.REACT_CHAT_ENDPOINT);
		setName(credentials.name);
		setUserId(credentials.id);
		setRoom(id);
		// async function getMessages() {
		// 	const response = await api.get(`/chats/${id}`);
		// 	const messages = response.data;
		// 	setMessages(messages);
		// }

		// getMessages();
		socket.emit(
			'join',
			{
				user_id: credentials.id,
				username: credentials.name,
				local: credentials.local,
				room: id,
				avatar: credentials.avatar_url,
			},
			() => {}
		);
		return () => {
			console.log('disconnecting');
			socket.emit('disconnect');
			socket.close();
		};
	}, []);

	useEffect(() => {
		//escutando o socket
		setReceived(false);
		socket.on('message', (message) => {
			setMessages([...messages, message]);
		});
	}, [messages]);

	useEffect(() => {
		//escutando o socket
		socket.on('roomData', ({ users }) => {
			setUsers(users);
		});
	}, [users]);

	const sendMessage = (event) => {
		event.preventDefault();
		if (message) {
			socket.emit('sendMessage', message, () => {
				setMessage('');
				setReceived(true);
			});
		}
	};

	return (
		<div id="chat-container">
			<Row>
				<Col span={6}>
					<ChatInfo users={users} />
				</Col>
				<Col span={18} style={{ display: 'flex', flexDirection: 'column' }}>
					<ChatMessages messages={messages} name={name} id={userId} />
					<ChatInput
						message={message}
						setMessage={setMessage}
						sendMessage={sendMessage}
						received={received}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default Chat;
