import React from 'react';
import Alert from '@mui/material/Alert';
import './message.scss';
import Snackbar from '@mui/material/Snackbar';

function SuccessMsgFillingStation({ openToast, email, handleToast, mode }) {
    return (
        <div>
            <Snackbar
                open={openToast}
                autoHideDuration={6000}
                onClose={handleToast}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <Alert
                    style={{
                        backgroundColor: '#5cb85c',
                        color: 'white'
                    }}
                    onClose={handleToast}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {mode === 'INSERT'
                        ? 'FUEL STATION REGISTERED SUCCESSFULLY.MANAGER PASSWORD IS SENT TO  ' + { email }
                        : 'SUCCESSFULLY UPDATED'}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SuccessMsgFillingStation;
