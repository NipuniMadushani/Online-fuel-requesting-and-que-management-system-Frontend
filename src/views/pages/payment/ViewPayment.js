import { useEffect, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';

import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'react-redux';

import MainCard from 'ui-component/cards/MainCard';

import { FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';

import SuccessMsg from 'views/messages/SuccessMsg';
import ErrorMsg from 'views/messages/ErrorMsg';
import { getAllVehicleData } from 'store/actions/VehicleAction';
import AuthService from 'services/auth.service';
import Stripe from 'react-stripe-checkout';
import axios from 'axios';
import Payment from './Checkout/Payment';
import { useLocation } from 'react-router';
import OrderSummary from './Checkout/OrderSummary';

function ViewPayment() {
    const { state } = useLocation();
    // const { statePage } = useLocation();
    const currentUser = AuthService.getCurrentUser();
    const [open, setOpen] = useState(false);
    const [vehicleId, setVehicleId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const { value } = state;
    const { pageType } = state;

    const columns = [
        {
            title: 'Id',
            field: 'id',
            filterPlaceholder: 'filter',
            align: 'center',
            hidden: true
        },
        {
            title: 'Vehicle Number',
            field: 'vehicleNumber',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Chassis Number',
            field: 'chassisNumber',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Vehicle Type',
            field: 'vehicleType',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Fuel Type',
            field: 'fuelType',
            filterPlaceholder: 'filter',
            align: 'center'
        }

        // {
        //     title: 'Location Code',
        //     field: 'locationCode',
        //     filterPlaceholder: 'filter',
        //     align: 'center'
        // },
        // {
        //     title: 'Max Pax',
        //     field: 'maxPax',
        //     filterPlaceholder: 'filter',
        //     align: 'center'
        // },

        // {
        //     title: 'Status',
        //     field: 'status',
        //     filterPlaceholder: 'True || False',
        //     align: 'center',
        //     emptyValue: () => <em>null</em>,
        //     render: (rowData) => (
        //         <div
        //             style={{
        //                 alignItems: 'center',
        //                 align: 'center',
        //                 display: 'flex',
        //                 justifyContent: 'center',
        //                 alignItems: 'center'
        //             }}
        //         >
        //             {rowData.status === true ? (
        //                 <FormGroup>
        //                     <FormControlLabel control={<Switch size="small" />} checked={true} />
        //                 </FormGroup>
        //             ) : (
        //                 <FormGroup>
        //                     <FormControlLabel control={<Switch size="small" />} checked={false} />
        //                 </FormGroup>
        //             )}
        //         </div>
        //     )
        // }
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.vehicleReducer.errorMsg);
    const vehicle = useSelector((state) => state.vehicleReducer.vehicle);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);
    // const lastModifiedDate = useSelector((state) => state.activity_supplimentReducer.lastModifiedDateTime);

    // useEffect(() => {
    //     setLastModifiedTimeDate(lastModifiedDate);
    // }, [lastModifiedDate]);

    useEffect(() => {
        console.log(value);
    }, []);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    // useEffect(() => {
    //     if (vehicle) {
    //         console.log(currentUser.id);
    //         setHandleToast(true);
    //         dispatch(getAllVehicleData(currentUser.id));
    //     }
    // }, [vehicle]);

    // useEffect(() => {
    //     console.log(currentUser.id);
    //     dispatch(getAllVehicleData(currentUser.id));
    //     // dispatch(getActivity_SupplementLatestModifiedDetails());
    // }, []);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setVehicleId(data.id);
        } else if (type === 'INSERT') {
            setVehicleId('');
            setMode(type);
        } else {
            setMode(type);
            setVehicleId(data.id);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    async function handleToken(token) {
        // console.log(token);
        await axios
            .post('http://localhost:8090/api/auth/v1/payment/charge', '', {
                headers: {
                    token: token.id,
                    amount: 500
                }
            })
            .then(() => {
                // alert('Payment Success');
            })
            .catch((error) => {
                // alert(error);
            });
    }
    return (
        <div>
            <MainCard title="Payment">
                {/* <div style={{ textAlign: 'right' }}> Last Modified Date : {lastModifiedTimeDate}</div> */}
                <br />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Pay With Stripe</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Stripe
                                    stripeKey="pk_test_51Ld3w1E1b0Yn7D2JCsh2prL6ODEGaeHvi4XzXNy859KDuBIjZFPEVGl8x7uPPSKvcEOsUR9OhfFTCaJcPiezNDqX0005Y6up44"
                                    token={handleToken}
                                />
                            </Grid>
                        </Grid>
                        {/* </SubCard> */}
                    </Grid>

                    <Grid item xs={6}>
                        <OrderSummary value={value} />
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item>
                        {' '}
                        <Payment request={value} pageType={pageType} />
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
}

export default ViewPayment;
