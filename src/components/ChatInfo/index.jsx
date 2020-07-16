import React, { useEffect, useState } from 'react';
import { Space, Avatar, Comment } from 'antd';
import './styles.css';
const ChatInfo = ({ users }) => {
	console.log(users);
	return (
		<div id="users-list">
			{users.map((user, index) => (
				<Comment
					key={index}
					content={
						<div>
							<p style={{ color: 'white' }}>{user.username}</p>
							<p style={{ color: 'white' }}>{user.local}</p>
						</div>
					}
					avatar={<Avatar src={user.avatar} />}
				/>
			))}
		</div>
	);
};

export default ChatInfo;
