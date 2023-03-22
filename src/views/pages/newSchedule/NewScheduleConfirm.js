import React from 'react';
import axios from 'axios';
import { useEffect, forwardRef, useState } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import {
    Dialog,
    Slide,
    DialogActions,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Grid,
    Switch,
    Typography,
    MenuItem,
    RadioGroup,
    Radio,
    FormControl,
    FormLabel,
    Autocomplete
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'assets/scss/style.scss';
import { useDispatch, useSelector } from 'react-redux';

// const axios = require('axios');
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import {
    checkChassisNumber,
    checkDuplicateVehiclesCode,
    checkVehicleNumber,
    getAllVehicleData,
    getVehicleDetailsByCode,
    saveVehicleData,
    updateVehicleData
} from 'store/actions/VehicleAction';
import AuthService from 'services/auth.service';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import { addDays, addMonths, format, isValid } from 'date-fns';
import { getAllFillingStationData } from 'store/actions/FillingStationAction';
import {
    approveFuelRequestById,
    getEligibleQuotaByVehicleNumber,
    getFuelRequestDetailsByCode,
    getWeekEndDate,
    rejectFuelRequestById,
    saveFuelRequestData
} from 'store/actions/FuelRequestAction';
import { acceptFuelRequestByIdDataSaga, rejectFuelRequestByIdDataSaga } from 'store/saga/FuelRequstSaga';
import SuccessMsg from 'views/messages/SuccessMsg';
import { useNavigate } from 'react-router';
const currentUser = AuthService.getCurrentUser();

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function NewScheduleOwner({ open, handleClose, mode, newRequest }) {
    const [selectedDate, handleDateChange] = useState(new Date());

    useEffect(() => {
        dispatch(getWeekEndDate());
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);
    const dateofSunday = useSelector((state) => state.fuelRequestReducer.dateofSunday);
    const initialValues = {
        id: newRequest.id,
        customer: currentUser,
        fualAmount: newRequest.fualAmount,
        requestedDate: newRequest.availableDate,
        scheduleTime: newRequest.availableTime,
        lastDate: dateofSunday,
        activeState: true
    };
    const today = Date.now();
    // alert(today);

    // const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();
    const [openPayment, setOpenPayment] = useState(false);
    const [fillingStationDetails, setFillingStationDetails] = useState();
    const [vehicleData, setVehicle] = useState(null);
    const duplicateVehicleNumber = useSelector((state) => state.vehicleReducer.duplicateVehicleNumber);
    const duplicateChassisNumber = useSelector((state) => state.vehicleReducer.duplicateChassisNumber);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);
    const fillingStationList = useSelector((state) => state.fillingStationReducer.fillingStationList);
    const eligibleQuotaDetails = useSelector((state) => state.fuelRequestReducer.eligibleQuotaDetails);
    const fuelRequstToUpdate = useSelector((state) => state.fuelRequestReducer.fuelRequstToUpdate);
    const [alreadyAcceptedOrRejected, setAlreadyAcceptedOrRejected] = useState(false);
    const navigate = useNavigate();
    const [vehicleOwnerId, setVehicleOwnerId] = useState('');

    const [fuelRequest, setFuelRequst] = useState(null);
    const [openToast, setOpenToast] = useState(false);

    const [openErrorToast, setOpenErrorToast] = useState(false);
    yup.addMethod(yup.string, 'checkDuplicateVehicleNumber', function (message) {
        return this.test('checkDuplicateVehicleNumber', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkVehicleNumber(value));

                    if (duplicateVehicleNumber != null && duplicateVehicleNumber.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                    return false; // or true as you see fit
                } catch (error) {}
            }
            return true;
        });
    });

    yup.addMethod(yup.string, 'checkDuplicateChassis', function (message) {
        return this.test('checkDuplicateChassis', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkChassisNumber(value));

                    if (duplicateChassisNumber != null && duplicateChassisNumber.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                    return false; // or true as you see fit
                } catch (error) {}
            }
            return true;
        });
    });

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };
    const validationSchema = yup.object().shape({});

    // const handleClose = () => {
    //     setSecOpen(false);
    // };

    const handleSubmitForm = (data) => {
        console.log(data);
        // if (mode === 'INSERT') {
        const initialValues = {
            id: '',
            userId: vehicleOwnerId,
            vehicle: vehicleObj,
            requstedQuota: data.balanceQuata,
            availableDate: data.requestedDate,
            availableTime: data.scheduleTime,
            fuelStation: data.fuelStation,
            fuelRequest: fuelRequest
        };
        console.log(initialValues);
        axios
            .post(`http://localhost:8090/api/auth/v1/new-schedule/`, initialValues)
            .then(function (response) {
                console.log(response.data);
                setOpenToast(true);
            })
            .catch(function (error) {
                console.error(error);
            });
        // dispatch(saveFuelRequestData(initialValues));
        // } else if (mode === 'VIEW_UPDATE') {
        //     console.log('yes click');
        //     dispatch(updateVehicleData(data));
        // }

        // handleClose();
    };

    const getEligibleQuotaByNumber = (value) => {
        if (mode === 'INSERT') {
            dispatch(getEligibleQuotaByVehicleNumber(value));
        }
    };

    const approveRequest = (value) => {
        if (mode === 'APPROVE') {
            dispatch(approveFuelRequestById(value));
            handleClose();
        }
    };

    const makePayment = (value) => {
        console.log(value);
        // setOpenPayment(true);
        navigate('/payment', { state: { value: value } }, { replace: true });
        // if (mode === 'APPROVE') {
        //     dispatch(approveFuelRequestById(value));
        //     handleClose();
        // }
    };

    const rejectRequest = (value) => {
        if (mode === 'APPROVE') {
            dispatch(rejectFuelRequestById(value));
            handleClose();
        }
    };

    const rejectAndNewScheduleRequest = (value) => {
        if (mode === 'APPROVE') {
            // dispatch(rejectFuelRequestById(value));
            // handleClose();
        }
    };

    // useEffect(() => {
    //     if (mode != 'INSERT') {
    //         dispatch(getFuelRequestDetailsByCode(fuelRequestId));
    //     }
    // }, [fuelRequestId]);

    // useEffect(() => {
    //     setFillingStationDetails(fillingStationList);
    // }, [fillingStationList]);

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {/* {mode === 'INSERT' ? 'Add' : ''} {mode === 'DELETE' ? 'Delete' : ''} {mode === 'VIEW' ? 'View  ' : ''}
                            {mode === 'APPROVE' ? 'Approve/Reject  ' : ''} */}
                            Confirm New Schedule
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={loadValues || initialValues}
                            onSubmit={(values) => {
                                // console.log(values);
                                handleSubmitForm(values);
                            }}
                            validationSchema={validationSchema}
                        >
                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                return (
                                    <Form>
                                        <Box sx={{ width: '100%' }}>
                                            <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                <Grid item xs={6}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <DatePicker
                                                            onChange={(value) => {
                                                                setFieldValue(`requestedDate`, value);
                                                                console.log('select date:' + value);
                                                            }}
                                                            label="Schedule Date"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            // disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}

                                                            name="requestedDate"
                                                            // minDate={addDays(today, 21)}
                                                            // maxDate={addMonths(addDays(today, 21), 6)}
                                                            disabled
                                                            inputFormat="DD/MM/YYYY"
                                                            value={values.requestedDate}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        width: {
                                                                            sm: 200
                                                                        },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
                                                                        }
                                                                    }}
                                                                    variant="outlined"
                                                                    name="requestedDate"
                                                                    onBlur={handleBlur}
                                                                    error={Boolean(touched.requestedDate && errors.requestedDate)}
                                                                    helperText={
                                                                        touched.requestedDate && errors.requestedDate
                                                                            ? errors.requestedDate
                                                                            : ''
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <TimePicker
                                                            onChange={(value) => {
                                                                setFieldValue(`scheduleTime`, value);
                                                            }}
                                                            label="Schedule Time"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            disabled
                                                            value={values.scheduleTime}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        width: {
                                                                            sm: 200
                                                                        },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
                                                                        }
                                                                    }}
                                                                    variant="outlined"
                                                                    name="scheduleTime"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <DatePicker
                                                            onChange={(value) => {
                                                                setFieldValue(`requestedDate`, value);
                                                                console.log('select date:' + value);
                                                            }}
                                                            label="Last Date For This Week"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            // name="lastDate"
                                                            minDate={new Date()}
                                                            // maxDate={dateofSunday}
                                                            // minDate={addDays(today, 21)}
                                                            // maxDate={addMonths(addDays(today, 21), 6)}
                                                            disabled
                                                            inputFormat="DD/MM/YYYY"
                                                            value={dateofSunday}
                                                            // value={dateofSunday}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        width: {
                                                                            sm: 200
                                                                        },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
                                                                        }
                                                                    }}
                                                                    variant="outlined"
                                                                    // name="lastDate"
                                                                    onBlur={handleBlur}
                                                                    // error={Boolean(touched.lastDate && errors.lastDate)}
                                                                    // helperText={touched.lastDate && errors.lastDate ? errors.lastDate : ''}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled
                                                        // label={vehicleNumber}
                                                        label="Fuel Amount (RS.)"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        type="text"
                                                        variant="outlined"
                                                        // placeholder="ABC 1234"
                                                        id="fualAmount"
                                                        name="fualAmount"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.fualAmount}
                                                        // error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                        // helperText={
                                                        //     touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                        // }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                            <Grid item>
                                                {' '}
                                                <Button variant="contained" color="error" type="button">
                                                    REJECT
                                                </Button>
                                            </Grid>

                                            <Grid item>
                                                {' '}
                                                <Button
                                                    color="success"
                                                    variant="contained"
                                                    type="submit"
                                                    onClick={(e) => makePayment(newRequest)}
                                                >
                                                    CONFIRM WITH PAYMENT
                                                </Button>
                                            </Grid>
                                            {/* <Grid item>
                                                <Button
                                                    variant="contained"
                                                    type="button"
                                                    style={{
                                                        // backgroundColor: '#B22222',
                                                        marginLeft: '10px'
                                                    }}
                                                    onClick={(e) => resetForm()}
                                                >
                                                    CONFIRM
                                                </Button>
                                            </Grid> */}
                                        </Box>

                                        {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                                        {/* <Box>
                                            <Grid item>
                                                {mode === 'VIEW' ? <CreatedUpdatedUserDetailsWithTableFormat formValues={values} /> : null}
                                            </Grid>
                                        </Box> */}
                                    </Form>
                                );
                            }}
                        </Formik>
                        {/* map */}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default NewScheduleOwner;
