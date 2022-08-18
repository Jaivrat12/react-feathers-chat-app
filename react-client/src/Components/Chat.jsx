import { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Message from './Message';
import MessageInput from './MessageInput';
import client from '../feathers';

const Chat = ({ messages }) => {

	const chatBoxRef = useRef(null);

	useEffect(() => {
		chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
	}, [messages]);

    return (

        <Box
			display="flex"
			flexDirection="column"
			height="100%"
		>
            <Box
                padding={ 1.5 }
                display="flex"
                justifyContent="space-between"
                sx={{ background: '#1976d2', color: 'white' }}
            >
                <Typography
                    variant="h5"
                    textAlign="center"
                >
                    Chat App
                </Typography>
                <Button
                    onClick={() => client.logout()}
                    sx={{ color: 'inherit' }}
                >
                    Logout
                </Button>
            </Box>

			<Box
				ref={ chatBoxRef }
				flex={ 1 }
				paddingTop={ 1.5 }
				sx={{ overflowY: 'scroll' }}
			>
				{ messages.length ? messages.map((message) => (

					<Message
						key={ message._id }
						username={ message.user.email }
						text={ message.text }
					/>
				)) : (

					<Typography
						color="text.secondary"
						textAlign="center"
						fontStyle="italic"
					>
						No messages here yet...
					</Typography>
				)}
			</Box>

			<MessageInput />
		</Box>
    );
}

export default Chat;