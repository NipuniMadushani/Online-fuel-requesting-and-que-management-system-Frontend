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
const currentUser = AuthService.getCurrentUser();

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function NewSchedule({ open, handleClose, mode, fuelRequestId, vehicleObj }) {
    console.log(currentUser);
    const [selectedDate, handleDateChange] = useState(new Date());

    useEffect(() => {
        dispatch(getAllVehicleData(currentUser.id));
        dispatch(getAllFillingStationData());
        dispatch(getWeekEndDate());
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);
    const dateofSunday = useSelector((state) => state.fuelRequestReducer.dateofSunday);
    const initialValues = {
        id: '',
        customer: currentUser,
        vehicle: null,
        actualQuata: '',
        balanceQuata: '',
        eligibleQuata: '',
        requestedDate: '',
        scheduleTime: '',
        vehicleType: '',
        fuelType: '',
        fuelAmount: '',
        pricePerLiter: '',
        fuelStation: null,
        lastDate: dateofSunday,
        activeState: true
    };
    const today = Date.now();
    // alert(today);

    // const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();
    const [vehicleDetails, setVehicleDetails] = useState();
    const [fillingStationDetails, setFillingStationDetails] = useState();
    const [vehicleData, setVehicle] = useState(null);
    const duplicateVehicleNumber = useSelector((state) => state.vehicleReducer.duplicateVehicleNumber);
    const duplicateChassisNumber = useSelector((state) => state.vehicleReducer.duplicateChassisNumber);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);
    const fillingStationList = useSelector((state) => state.fillingStationReducer.fillingStationList);
    const eligibleQuotaDetails = useSelector((state) => state.fuelRequestReducer.eligibleQuotaDetails);
    const fuelRequstToUpdate = useSelector((state) => state.fuelRequestReducer.fuelRequstToUpdate);
    const [alreadyAcceptedOrRejected, setAlreadyAcceptedOrRejected] = useState(false);

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
    const validationSchema = yup.object().shape({
        // status: yup.boolean(),
        balanceQuata: yup.number(),
        fuelStation: yup.object().typeError('Required field'),
        // actualQuata: yup.number().lessThan([yup.ref('balanceQuata')], 'should be less than balance quata'),
        // actualQuata: yup.number().when('balanceQuata', {
        //     is: (balanceQuata) => balanceQuata < actualQuata,
        //     then: yup.number().required('Cant be ')
        // }),
        actualQuata: yup.number().max(yup.ref('balanceQuata'), 'Requested Quota Should be less than Remaining Quota'),

        lastDate: yup.date(),

        requestedDate: yup
            .date()
            .label('startsAt')
            .required('Required')
            .min(new Date(Date.now() - 86400000), 'Date cannot be in the past'),

        // requestedDate: yupg Quota
        //     .date()
        //     .default(() => new Date())
        //     .required('Required Field')

        vehicle: yup.object().typeError('Required field')
        // chassisNumber: yup.string().required('Required field').checkDuplicateChassis('Already Exist Chassis Number'),
        // vehicleType: yup.string().required('Required field'),
        // fuelType: yup.string().required('Required field')
    });

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

    useEffect(() => {
        setVehicleDetails(vehicleList);
    }, [vehicleList]);

    useEffect(() => {
        if (mode !== 'INSERT' && fuelRequstToUpdate != null) {
            setVehicleOwnerId(fuelRequstToUpdate?.userId);
            setFuelRequst(fuelRequstToUpdate);
            const initialValues = {
                id: fuelRequstToUpdate?.id,
                // userId: fuelRequstToUpdate?.userId,
                vehicle: fuelRequstToUpdate.vehicle,
                actualQuata: fuelRequstToUpdate.actualQuata,
                balanceQuata: fuelRequstToUpdate?.eligibleQuata - fuelRequstToUpdate?.actualQuata,
                eligibleQuata: fuelRequstToUpdate.eligibleQuata,
                requestedDate: fuelRequstToUpdate.requestedDate,
                vehicleType: fuelRequstToUpdate.vehicleType,
                fuelType: fuelRequstToUpdate.fuelType,
                fuelAmount: fuelRequstToUpdate.fuelAmount,
                pricePerLiter: fuelRequstToUpdate.pricePerLiter,
                fuelStation: fuelRequstToUpdate.fuelStation,
                scheduleTime: fuelRequstToUpdate.scheduleTime
            };
            setLoadValues(initialValues);

            console.log('appr:' + fuelRequstToUpdate?.approvalState);
            console.log('reje:' + fuelRequstToUpdate?.rejectState);

            if (fuelRequstToUpdate?.rejectState || fuelRequstToUpdate?.approvalState) {
                setAlreadyAcceptedOrRejected(true);
            } else {
                setAlreadyAcceptedOrRejected(false);
            }
        } else {
            setLoadValues(initialValues);
        }
        // setVehicleDetails(vehicleList);
    }, [fuelRequstToUpdate]);

    useEffect(() => {
        if (mode != 'INSERT') {
            dispatch(getFuelRequestDetailsByCode(fuelRequestId));
        }
    }, [fuelRequestId]);

    useEffect(() => {
        setFillingStationDetails(fillingStationList);
    }, [fillingStationList]);

    useEffect(() => {
        if (eligibleQuotaDetails !== null && mode == 'INSERT') {
            const initialValues = {
                id: '',
                // customer: currentUser,
                vehicle: eligibleQuotaDetails.vehicle,
                actualQuata: eligibleQuotaDetails.balanceQuata,
                balanceQuata: eligibleQuotaDetails.balanceQuata,
                eligibleQuata: eligibleQuotaDetails.eligibleQuata,
                // requestedDate: data.requestedDate,
                vehicleType: eligibleQuotaDetails.vehicleType,
                fuelType: eligibleQuotaDetails.fuelType,
                fuelAmount: eligibleQuotaDetails.fuelAmount,
                pricePerLiter: eligibleQuotaDetails.pricePerLiter

                // fuelStation: data.fuelStation
            };
            setLoadValues(initialValues);
        }

        // }
    }, [eligibleQuotaDetails]);

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
                            New Token Schedule
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
                                                    <Autocomplete
                                                        value={values.vehicle}
                                                        name="vehicle"
                                                        onChange={(_, value) => {
                                                            getEligibleQuotaByNumber(value.vehicleNumber);
                                                            console.log(value);
                                                            setFieldValue(`vehicle`, value);
                                                            setVehicle(value);
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                        options={vehicleDetails}
                                                        getOptionLabel={(option) => `${option.vehicleNumber}-${option.vehicleType}`}
                                                        // isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Vehicle Number "
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                sx={{
                                                                    width: {
                                                                        sm: 250
                                                                    },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                                variant="outlined"
                                                                name="vehicle"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.vehicle && errors.vehicle)}
                                                                helperText={touched.vehicle && errors.vehicle ? errors.vehicle : ''}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Grid container></Grid>
                                                    <Grid></Grid>
                                                    <Autocomplete
                                                        value={values.fuelStation}
                                                        name="fuelStation"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`fuelStation`, value);
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                        options={fillingStationDetails}
                                                        getOptionLabel={(option) => `${option.displayName}-${option.location}`}
                                                        // isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Fuel Station"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                sx={{
                                                                    width: {
                                                                        sm: 250
                                                                    },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                                variant="outlined"
                                                                name="fuelStation"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.fuelStation && errors.fuelStation)}
                                                                helperText={
                                                                    touched.fuelStation && errors.fuelStation ? errors.fuelStation : ''
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {mode === 'INSERT' ? (
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            disabled
                                                            // label={vehicleNumber}
                                                            label="Fuel Type"
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
                                                            id="fuelType"
                                                            name="fuelType"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.fuelType}
                                                            // error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                            // helperText={
                                                            //     touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                            // }
                                                        />
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}

                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                        // label={vehicleNumber}
                                                        label="Request Amount Of Quota (L)"
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
                                                        id="actualQuata"
                                                        name="actualQuata"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.actualQuata}
                                                        error={Boolean(touched.actualQuata && errors.actualQuata)}
                                                        helperText={touched.actualQuata && errors.actualQuata ? errors.actualQuata : ''}
                                                    />
                                                </Grid>
                                                {mode === 'INSERT' ? (
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                            // label={vehicleNumber}
                                                            label="Price For Liter(RS.)"
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
                                                            id="pricePerLiter"
                                                            name="pricePerLiter"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.pricePerLiter}
                                                            // error={Boolean(touched.pricePerLite && errors.pricePerLite)}
                                                            // helperText={
                                                            //     touched.pricePerLite && errors.pricePerLite ? errors.pricePerLite : ''
                                                            // }
                                                        />
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}
                                                {mode === 'INSERT' ? (
                                                    <Grid item xs={6}>
                                                        {/* {values.pricePerLiter ? values.pricePerLiter * values.actualQuata : 0} */}
                                                        <TextField
                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW' || mode == 'APPROVE'}
                                                            // label={vehicleNumber}
                                                            label="Amount (RS.) "
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
                                                            id="fuelAmount"
                                                            name="fuelAmount"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.pricePerLiter * values.actualQuata}
                                                            // error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                            // helperText={
                                                            //     touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                            // }
                                                        />
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}
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
                                                            minDate={new Date()}
                                                            maxDate={dateofSunday}
                                                            name="requestedDate"
                                                            // minDate={addDays(today, 21)}
                                                            // maxDate={addMonths(addDays(today, 21), 6)}
                                                            // disabled={
                                                            //     mode == 'VIEW_UPDATE' ||
                                                            //     mode == 'VIEW'
                                                            // // }
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
                                                            // disabled={
                                                            //     mode == 'VIEW_UPDATE' ||
                                                            //     mode == 'VIEW'
                                                            // }
                                                            // inputFormat="DD/MM/YYYY"
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
                                                                    // error={Boolean(
                                                                    //     touched.guideClassDetails &&
                                                                    //         touched
                                                                    //             .guideClassDetails[
                                                                    //             idx
                                                                    //         ] &&
                                                                    //         touched
                                                                    //             .guideClassDetails[
                                                                    //             idx
                                                                    //         ].fromDate &&
                                                                    //         errors.guideClassDetails &&
                                                                    //         errors
                                                                    //             .guideClassDetails[
                                                                    //             idx
                                                                    //         ] &&
                                                                    //         errors
                                                                    //             .guideClassDetails[
                                                                    //             idx
                                                                    //         ].fromDate
                                                                    // )}
                                                                    // helperText={
                                                                    //     touched.guideClassDetails &&
                                                                    //     touched
                                                                    //         .guideClassDetails[
                                                                    //         idx
                                                                    //     ] &&
                                                                    //     touched
                                                                    //         .guideClassDetails[
                                                                    //         idx
                                                                    //     ].fromDate &&
                                                                    //     errors.guideClassDetails &&
                                                                    //     errors
                                                                    //         .guideClassDetails[
                                                                    //         idx
                                                                    //     ] &&
                                                                    //     errors
                                                                    //         .guideClassDetails[
                                                                    //         idx
                                                                    //     ].fromDate
                                                                    //         ? errors
                                                                    //               .guideClassDetails[
                                                                    //               idx
                                                                    //           ].fromDate
                                                                    //         : ''
                                                                    // }
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
                                                {mode === 'APPROVE' && currentUser?.roles[0] === 'ROLE_ADMIN' ? (
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="contained"
                                                            type="submit"
                                                            disabled={alreadyAcceptedOrRejected}
                                                            style={{
                                                                // backgroundColor: '#B22222',
                                                                marginLeft: '10px'
                                                            }}
                                                            // onClick={(e) => approveRequest(values.id)}
                                                        >
                                                            SAVE & SEND EMAIL WITH NEW SCHEDULE
                                                        </Button>

                                                        {/* <Button
                                                            color="error"
                                                            variant="contained"
                                                            type="button"
                                                            disabled={alreadyAcceptedOrRejected}
                                                            style={{
                                                                // backgroundColor: '#B22222',
                                                                marginLeft: '10px'
                                                            }}
                                                            onClick={(e) => rejectRequest(values.id)}
                                                            // onClick={(e) => resetForm()}
                                                        >
                                                            REJECT
                                                        </Button>

                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            type="button"
                                                            disabled={alreadyAcceptedOrRejected}
                                                            style={{
                                                                // backgroundColor: '#B22222',
                                                                marginLeft: '10px'
                                                            }}
                                                            onClick={(e) => rejectAndNewScheduleRequest(values.id)}
                                                            // onClick={(e) => resetForm()}
                                                        >
                                                            REJECT WITH NEW SCHEDULE
                                                        </Button> */}
                                                        {/* <FormControl>
                                                            <FormLabel id="demo-controlled-radio-buttons-group">Approve/ Reject</FormLabel>
                                                            <RadioGroup
                                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                                name="fuelType"
                                                                value={values.fuelType}
                                                                onChange={handleChange}
                                                            >
                                                                <FormControlLabel value="approve" control={<Radio />} label="Approve" />
                                                                <FormControlLabel value="reject" control={<Radio />} label="Reject" />
                                                            </RadioGroup>
                                                        </FormControl> */}
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}

                                                {/* <Grid item xs={6}>
                                                    <FormControl>
                                                        <FormLabel id="demo-controlled-radio-buttons-group">Fuel Type</FormLabel>
                                                        <RadioGroup
                                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                                            name="fuelType"
                                                            value={values.fuelType}
                                                            onChange={handleChange}
                                                        >
                                                            <FormControlLabel value="petrol" control={<Radio />} label="Petrol" />
                                                            <FormControlLabel value="diesel" control={<Radio />} label="Diesel" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid> */}
                                            </Grid>
                                        </Box>
                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                            {mode == 'INSERT' ? (
                                                <Button
                                                    variant="outlined"
                                                    type="button"
                                                    style={{
                                                        // backgroundColor: '#B22222',
                                                        marginLeft: '10px'
                                                    }}
                                                    onClick={(e) => resetForm()}
                                                >
                                                    CLEAR
                                                </Button>
                                            ) : (
                                                ''
                                            )}

                                            {mode == 'INSERT' ? (
                                                <Button className="btnSave" variant="contained" type="submit">
                                                    {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                                </Button>
                                            ) : (
                                                ''
                                            )}
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

export default NewSchedule;
