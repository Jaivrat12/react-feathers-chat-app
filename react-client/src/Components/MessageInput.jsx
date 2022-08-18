import { useRef, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import client from '../feathers';

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        // borderRadius: 0,
    }
};

const MessageInput = () => {

    const messageInputForm = useRef(null);

    const [text, setText] = useState('');

    const onChange = (e) => setText(e.target.value);

    const onKeyDown = (e) => {

        if (['Enter', 'NumpadEnter'].includes(e.code)) {
            sendMessage();
        }
    }

    const sendMessage = () => {

        if (text) {

            client.service('messages')
                .create({ text })
                .then(() => setText(''));
        }
    };

    const onSubmit = (e) => {

        e.preventDefault();
        sendMessage();
    }

    return (

        <form
            ref={ messageInputForm }
            onSubmit={ onSubmit }
        >
            {/* <TextField
                value={ message.username }
                onChange={ (e) => onChange('username', e.target.value) }
                name="username"
                id="username"
                placeholder="Username"
                fullWidth
                autoFocus
                sx={ textFieldSx }
            /> */}

            <Box
                padding="0.5rem"
                display="flex"
                gap={ 1 }
            >
                <TextField
                    value={ text }
                    onChange={ onChange }
                    onKeyDown={ onKeyDown }
                    name="text"
                    id="text"
                    placeholder="Type a message"
                    fullWidth
                    autoFocus
                    multiline
                    maxRows={4}
                    sx={ textFieldSx }
                />

                <Button
                    type="submit"
                    variant="contained"
                    // fullWidth
                    // sx={{ p: 1.5, borderRadius: 0 }}
                >
                    Send
                </Button>
            </Box>
        </form>
    );
}

export default MessageInput;