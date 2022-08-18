import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Chat from './Components/Chat';
import Login from './Components/Login';
import client from './feathers';

const services = {
	messages: client.service('messages'),
	users: client.service('users'),
};

function App() {

	const [login, setLogin] = useState(undefined);
	const [messages, setMessages] = useState([]);
	// const [users, setUsers] = useState([]);

	// const pushMessage = (message) => {
	// 	setMessages([ ...messages, { id: uuid(), ...message } ]);
	// };

	useEffect(() => {

		client.authenticate().catch(() => setLogin(null));

		client.on('authenticated', (loginResult) => {

			Promise.all([
				services.messages.find({
					query: {
						$sort: { createdAt: -1 },
						$limit: 100
					}
				}),
				// services.users.find()
			]).then(([messagesResponse/* , usersResponse */]) => {

				const messagesResult = messagesResponse.data.reverse();
				// const usersResult = usersResponse.data;

				setLogin(loginResult);
				setMessages(messagesResult);
				// setUsers(usersResult);
			});
		});

		client.on('logout', () => {

			setLogin(null);
			setMessages([]);
			// setUsers([]);
		});

		services.messages.on('created', (message) => {

			// console.log('created()');
			setMessages(currMessages => currMessages.concat(message.data));
		});

		// services.users.on('created', (user) => {
		// 	setUsers(currUsers => currUsers.concat(user));
		// });
	}, []);

	if (login === undefined) {

		return (

			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100%"
			>
				<Typography
					variant="h4"
					textTransform="uppercase"
				>
					Loading
				</Typography>
			</Box>
		);
	} else {

		return login === null ? (
			<Login />
		) : (
			<Chat messages={ messages } />
		);
	}
}

export default App;