import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from '../ChatMessage';
import './styles.css';

const Messages = ({ messages, name, id }) => {
	return (
		<ScrollToBottom className="messages">
			{messages.map((message, index) => (
				<div key={index}>
					<Message message={message} name={name} id={id} />
				</div>
			))}
		</ScrollToBottom>
	);
};

export default Messages;
