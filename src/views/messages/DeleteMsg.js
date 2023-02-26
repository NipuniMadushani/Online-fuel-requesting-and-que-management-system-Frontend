import React from 'react';
import Alert from '@mui/material/Alert';
import './message.scss';
import Snackbar from '@mui/material/Snackbar';

function DeleteMsg({ openToast, handleToast, mode }) {
    return (
        <div>
            <Snackbar
                open={openToast}
                autoHideDuration={4000}
                onClose={handleToast}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <Alert onClose={handleToast} severity="error" sx={{ width: '100%' }}>
                    {mode === 'DELETE' ? 'DELETE SUCCESSFULLL' : 'DELETE UNSUCCESSFULLL'}
                    {/* {mode === 'ACCEPT' ? 'ACCEPT UNSUCCESSFULLL' : 'ACCEPT SUCCESSFULLL'}
                    {mode === 'REJECT' ? 'REJECT UNSUCCESSFULLL' : 'REJECT SUCCESSFULLL'} */}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default DeleteMsg;
