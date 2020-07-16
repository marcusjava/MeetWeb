import React from 'react';
import './styles.css';
import { Comment, Avatar, Tooltip } from 'antd';
import moment from 'moment';

const Message = ({ message: { user_id, user, text, avatar, createdAt }, name, id }) => {
	let sendByUser = false;

	if (user_id === id) {
		sendByUser = true;
	}

	return sendByUser ? (
		<div className="messageContainer justifyEnd">
			<div className="messageBox backgroundBlue text-white">
				<Comment
					author={user}
					datetime={
						<Tooltip title={moment(createdAt).format('DD-MM-YYYY HH:mm')}>
							<span>{moment().fromNow()}</span>
						</Tooltip>
					}
					avatar={<Avatar src={avatar} />}
					content={<p>{text}</p>}
				/>
			</div>
		</div>
	) : (
		<div className="messageContainer justifyStart">
			<div className="messageBox backgroundLight text-dark">
				<Comment
					author={user}
					avatar={<Avatar src={avatar} />}
					datetime={
						<Tooltip title={moment(createdAt).format('DD-MM-YYYY HH:mm')}>
							<span>{moment().fromNow()}</span>
						</Tooltip>
					}
					content={<p>{text}</p>}
				/>
			</div>
		</div>
	);
};

export default Message;
