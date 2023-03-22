import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
// material-ui
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    RadioGroup,
    Radio,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import OrderSummary from './OrderSummary';
import PaymentSelect from './PaymentSelect';
import PaymentOptions from './PaymentOptions';
import PaymentCard from './PaymentCard';
import AddPaymentCard from './AddPaymentCard';
import OrderComplete from './OrderComplete';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import { openSnackbar } from 'store/slices/snackbar';
import { gridSpacing } from 'store/constant';
import AlertTitle from '@mui/material/AlertTitle';
// assets
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { useDispatch } from 'react-redux';
import SuccessMsg from 'views/messages/SuccessMsg';
import { useNavigate } from 'react-router';
import Alert from '@mui/material/Alert';

// product color select
function getColor(color) {
    return ColorOptions.filter((item) => item.value === color);
}

// ==============================|| CHECKOUT PAYMENT - MAIN ||============================== //

const Payment = ({ checkout, onBack, onNext, handleShippingCharge, request }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [payment, setPayment] = useState('');
    const [rows, setRows] = useState('');
    const [cards, setCards] = useState('');
    const [openToast, setHandleToast] = useState(false);
    const [openToastPayment, setOpenToastPayment] = useState(false);
    const [open, setOpen] = useState(false);
    const [openQRButton, setOpenQRButton] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [complete, setComplete] = useState(false);

    const [disableCompeleteOrder, setDisableCompleteOrder] = useState(false);
    // useEffect(() => {
    //     if (checkout.step > 2) {
    //         setComplete(true);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    //     setRows(checkout.products);
    // }, [checkout.products]);

    const cardHandler = (card) => {
        if (payment === 'card') {
            setCards(card);
            // dispatch(setPaymentCard(card));
        }
    };

    const handlePaymentMethod = (value) => {
        setPayment(value);
        // dispatch(setPaymentMethod(value));
    };

    const generateQRCode = () => {
        navigate('/generate-token', { state: { request: request } }, { replace: true });
    };

    const handleToast = () => {
        setHandleToast(false);
    };

    const completeHandler = () => {
        const newRequestId = request.id;
        if (payment == 'card') {
            const res = axios({
                method: 'put',
                url: `http://localhost:8090/api/auth/v1/new-schedule/confirmSchedule/${newRequestId}`
            })
                .then((response) => {
                    setOpenQRButton(true);
                    setDisableCompleteOrder(true);
                    console.log(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            setOpenToastPayment(true);
        } else {
            // alert('Please Select Payment Method');
            setOpenAlert(true);

            // <Alert severity="error">This is an error alert — check it out!</Alert>;
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6} lg={8} xl={9}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Other Payment Options</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <FormControl>
                            <RadioGroup
                                aria-label="delivery-options"
                                value={payment}
                                onChange={(e) => handlePaymentMethod(e.target.value)}
                                name="delivery-options"
                            >
                                <Grid container spacing={gridSpacing} alignItems="center">
                                    {PaymentOptions.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <PaymentSelect item={item} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={6} sx={{ opacity: payment === 'card' ? 1 : 0.4 }}>
                        <SubCard
                            title="Add Your Card"
                            secondary={
                                <Button variant="contained" size="small" startIcon={<AddTwoToneIcon />} onClick={handleClickOpen}>
                                    Add Card
                                </Button>
                            }
                        >
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} xl={6}>
                                    <PaymentCard type="mastercard" cards={cards} cardHandler={cardHandler} />
                                </Grid>
                                <Grid item xs={12} xl={6}>
                                    <PaymentCard type="visa" cards={cards} cardHandler={cardHandler} />
                                </Grid>
                            </Grid>
                            <AddPaymentCard open={open} handleClose={handleClose} />
                        </SubCard>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Button variant="text" startIcon={<KeyboardBackspaceIcon />} onClick={onBack}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={completeHandler} disabled={disableCompeleteOrder}>
                                    Complete Order
                                </Button>
                                {/* <OrderComplete open={complete} /> */}
                            </Grid>
                            {openQRButton ? (
                                <Grid item>
                                    <Button variant="contained" color="warning" onClick={generateQRCode}>
                                        Generate QR Code
                                    </Button>
                                    {/* <OrderComplete open={complete} /> */}
                                </Grid>
                            ) : null}
                            {openAlert ? (
                                <Alert
                                    variant="filled"
                                    severity="error"
                                    onClose={() => {
                                        setOpenAlert(false);
                                    }}
                                >
                                    <AlertTitle>Warning</AlertTitle>
                                    <strong>Please Select Payment Method!</strong>
                                </Alert>
                            ) : null}
                            {openToastPayment ? <SuccessMsg openToast={openToastPayment} handleToast={handleToast} mode="INSERT" /> : null}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Payment.propTypes = {
    checkout: PropTypes.object,
    handleShippingCharge: PropTypes.func,
    onBack: PropTypes.func,
    onNext: PropTypes.func
};

export default Payment;
