import { useState } from 'react';
import {
    Box,
    Button as MuiButton,
    styled,
    TextField as MuiTextField,
    Typography
} from '@mui/material';
import client from '../feathers';

const TextField = styled(MuiTextField)`
    margin: 0.5rem 0;
`;

const Button = styled(MuiButton)`
    margin: 0.25rem 0;
    padding: 0.5rem
`;

const Login = () => {

    const [fields, setFields] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const updateFields = (prop) => (

        (e) => setFields({
            ...fields,
            [prop]: e.target.value
        })
    );

    const login = () => {

        client.authenticate({
            strategy: 'local',
            email: fields.username,
            password: fields.password
        })
        .catch((err) => setError(err));
    };

    const signup = () => {

        client.service('users')
            .create({
                email: fields.username,
                password: fields.password
            })
            .then(() => login())
            .catch((err) => setError(err));
    };

    return (

        <Box
            margin="auto"
            width="100%"
            maxWidth="420px"
            position="absolute"
            top="50%"
            left="50%"
            sx={{
                transform: "translate(-50%, -50%)"
            }}
        >
            <Box
                padding="0 1rem"
                textAlign="center"
            >
                <Box marginBottom="1.25rem">
                    <Typography variant="h4">
                        Login or Signup
                    </Typography>

                    { error && (

                        <Typography
                            margin="0.75rem 0"
                            color="error"
                        >
                            { error.message }
                        </Typography>
                    )}
                </Box>

                <Box sx={{ marginBottom: '1rem' }}>
                    <TextField
                        autoFocus
                        label="Username"
                        value={ fields.username }
                        onChange={ updateFields('username') }
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={ fields.password }
                        onChange={ updateFields('password') }
                        fullWidth
                    />
                </Box>

                <Box>
                    <Button
                        variant="contained"
                        onClick={ login }
                        fullWidth
                    >
                        Login
                    </Button>

                    <Button
                        variant="contained"
                        onClick={ signup }
                        fullWidth
                    >
                        Create Account
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;