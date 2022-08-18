import { Box } from '@mui/material';

const Message = ({ username, text }) => {

    return (

        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <b>{ username }</b>: { text }
        </Box>
    );
}

export default Message;