import React from 'react';
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
import { getAllFillingStationData, getFillingStationDetailsManagerWise } from 'store/actions/FillingStationAction';
import {
    approveFuelRequestById,
    getEligibleQuotaByVehicleNumber,
    getFuelRequestDetailsByCode,
    getWeekEndDate,
    rejectFuelRequestById,
    saveFuelRequestByFillingStationData,
    saveFuelRequestData
} from 'store/actions/FuelRequestAction';
import { acceptFuelRequestByIdDataSaga, rejectFuelRequestByIdDataSaga } from 'store/saga/FuelRequstSaga';
import NewSchedule from '../newSchedule/NewSchedule';

const currentUser = AuthService.getCurrentUser();

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function FuelRequest({ open, handleClose, mode, fuelRequestId }) {
    console.log(currentUser);
    const [selectedDate, handleDateChange] = useState(new Date());

    useEffect(() => {
        // dispatch(getAllVehicleData(currentUser.id));
        // dispatch(getAllFillingStationData());
        dispatch(getWeekEndDate());
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);
    const dateofSunday = useSelector((state) => state.fuelRequestReducer.dateofSunday);
    const fillingStationDetails = useSelector((state) => state.fillingStationReducer.fillingStationDetails);
    console.log(fillingStationDetails);

    useEffect(() => {
        // if (currentUser?.roles[0] === 'ROLE_FUEL_STATION') {
        dispatch(getFillingStationDetailsManagerWise(currentUser.username));
        // }
    }, []);
    const initialValues = {
        // id: '',
        // customer: currentUser,
        dispatchOffice: 'FuelIn-Dispatch Office',
        // fuelType: '',
        // fuelAmount: '',
        // pricePerLiter: '',
        fuelStation: fillingStationDetails[0].displayName
        // balanceQuata: '',
        // consumeQuata: '',
        // pricePerLiter: ''
    };
    const today = Date.now();
    // alert(today);

    // const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();
    const [vehicleDetails, setVehicleDetails] = useState();
    //new
    const [vehicleObject, setVehicleObject] = useState();

    const [categoryType, setCategoryType] = useState();
    const [vehicleData, setVehicle] = useState(null);
    const duplicateVehicleNumber = useSelector((state) => state.vehicleReducer.duplicateVehicleNumber);
    const duplicateChassisNumber = useSelector((state) => state.vehicleReducer.duplicateChassisNumber);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);
    const fillingStationList = useSelector((state) => state.fillingStationReducer.fillingStationList);
    const eligibleQuotaDetails = useSelector((state) => state.fuelRequestReducer.eligibleQuotaDetails);
    const fuelRequstToUpdate = useSelector((state) => state.fuelRequestReducer.fuelRequstToUpdate);
    const [alreadyAcceptedOrRejected, setAlreadyAcceptedOrRejected] = useState(false);
    const [openNewSchedule, setOpenNewSchedule] = useState(false);
    const [fuelRequstId, setFuelRequstId] = useState('');

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

    const validationSchema = yup.object().shape({
        actualQuata: yup.number().required('Required')
        // fuelType: yup.string().required('Required')
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            const initialValues = {
                id: '',
                fuelType: data.fuelType,
                fuelStation: fillingStationDetails[0],
                actualQuata: data.actualQuata,
                requestedDate: data.requestedDate,
                fuelAmount: data.pricePerLiter * data.actualQuata
            };
            dispatch(saveFuelRequestByFillingStationData(initialValues));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateVehicleData(data));
        }

        handleClose();
    };

    // const getEligibleQuotaByNumber = (value) => {
    //     if (mode === 'INSERT') {
    //         dispatch(getEligibleQuotaByVehicleNumber(value));
    //     }
    // };

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
            setFuelRequstId(value);
            setOpenNewSchedule(true);
            // dispatch(rejectFuelRequestById(value));
            // handleClose();
        }
    };

    const selectFuelType = (event) => {
        const selectedType = event.currentTarget.dataset.value;

        setCategoryType(selectedType);
    };

    useEffect(() => {
        const getRegisteredVehicleCount = async () => {
            const reqData = await fetch(
                'http://localhost:8090/api/auth/v1/fuel-station/remainingFuelCount/' + fillingStationDetails[0].id + '/' + categoryType
            ); // console.log(await reqData.json());                 const vehicleCount = await reqData.json();
            const fuelCount = await reqData.json();

            const initialValues = {
                id: '',
                balanceQuata: fuelCount.remainingPetrol,
                consumeQuata: fuelCount.consumePetrol,
                fuelType: categoryType,
                pricePerLiter: fuelCount.pricePerLiter,
                fuelAmount: ''
            };
            setLoadValues(initialValues);
            // setVehicleCount(vehicleCount);
        };
        getRegisteredVehicleCount();
    }, [categoryType]);

    useEffect(() => {
        if (mode !== 'INSERT' && fuelRequstToUpdate != null) {
            setVehicleObject(fuelRequstToUpdate.vehicle);
            const initialValues = {
                id: fuelRequstToUpdate?.id,
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
            if (fuelRequstToUpdate?.rejectState || fuelRequstToUpdate?.approvalState) {
                setAlreadyAcceptedOrRejected(true);
            } else {
                setAlreadyAcceptedOrRejected(false);
            }
        } else {
            setLoadValues(initialValues);
        }
    }, [fuelRequstToUpdate]);

    // useEffect(() => {
    //     if (mode != 'INSERT') {
    //         dispatch(getFuelRequestDetailsByCode(fuelRequestId));
    //     }
    // }, [fuelRequestId]);

    // useEffect(() => {
    //     if (eligibleQuotaDetails !== null && mode == 'INSERT') {
    //         const initialValues = {
    //             id: '',
    //             // customer: currentUser,
    //             vehicle: eligibleQuotaDetails.vehicle,
    //             actualQuata: eligibleQuotaDetails.balanceQuata,
    //             balanceQuata: eligibleQuotaDetails.balanceQuata,
    //             eligibleQuata: eligibleQuotaDetails.eligibleQuata,
    //             // requestedDate: data.requestedDate,
    //             vehicleType: eligibleQuotaDetails.vehicleType,
    //             fuelType: eligibleQuotaDetails.fuelType,
    //             fuelAmount: eligibleQuotaDetails.fuelAmount,
    //             pricePerLiter: eligibleQuotaDetails.pricePerLiter

    //             // fuelStation: data.fuelStation
    //         };
    //         setLoadValues(initialValues);
    //     }

    //     // }
    // }, [eligibleQuotaDetails]);

    // const handleClose = () => {
    //     setOpenNewSchedule(false);
    // };

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
                            {mode === 'INSERT' ? 'Request' : ''} {mode === 'DELETE' ? 'Delete' : ''} {mode === 'VIEW' ? 'View  ' : ''}
                            {mode === 'APPROVE' ? 'Approve/Reject  ' : ''}
                            Fuel from FuelIn Head Office
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
                                console.log(values);
                                handleSubmitForm(values);
                            }}
                            validationSchema={validationSchema}
                        >
                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                return (
                                    <Form>
                                        <Box sx={{ width: '100%' }}>
                                            <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                {/* <Grid item xs={6}>
                                                    <TextField
                                                        disabled
                                                        // label={vehicleNumber}
                                                        label="Fuel Station"
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
                                                        id="fuelStation"
                                                        // name="fuelStation"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.fuelStation}
                                                    />
                                                </Grid> */}
                                                {/* {mode === 'INSERT' ? (
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            disabled
                                                            // label={vehicleNumber}
                                                            label="Dispatch Office"
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
                                                            id="dispatchOffice"
                                                            // name="dispatchOffice"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.dispatchOffice}
                                                        />
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )} */}

                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{
                                                            width: { sm: 200, md: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        select
                                                        label="Fuel Type"
                                                        name="fuelType"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.fuelType}
                                                        // error={Boolean(touched.fuelType && errors.fuelType)}
                                                        // helperText={touched.fuelType && errors.fuelType ? errors.fuelType : ''}
                                                    >
                                                        <MenuItem dense={true} value={'Petrol'} onClick={selectFuelType}>
                                                            Petrol
                                                        </MenuItem>
                                                        <MenuItem dense={true} value={'Diesel'} onClick={selectFuelType}>
                                                            Diesel
                                                        </MenuItem>
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled
                                                        // label={vehicleNumber}
                                                        label="Consume Fuel Amount (L)"
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
                                                        id="consumeQuata"
                                                        name="consumeQuata"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.consumeQuata}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled
                                                        // label={vehicleNumber}
                                                        label="Remaining Stock(L)"
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
                                                        id="balanceQuata"
                                                        name="balanceQuata"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.balanceQuata}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
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
                                                            disabled
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
                                                        />
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}
                                                {mode === 'INSERT' ? (
                                                    <Grid item xs={6}>
                                                        {/* {values.pricePerLiter ? values.pricePerLiter * values.actualQuata : 0} */}
                                                        <TextField
                                                            disabled
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
                                                        />
                                                    </Grid>
                                                ) : (
                                                    ''
                                                )}

                                                {mode === 'APPROVE' && currentUser?.roles[0] === 'ROLE_ADMIN' ? (
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="contained"
                                                            type="button"
                                                            disabled={alreadyAcceptedOrRejected}
                                                            style={{
                                                                // backgroundColor: '#B22222',
                                                                marginLeft: '10px'
                                                            }}
                                                            onClick={(e) => approveRequest(values.id)}
                                                        >
                                                            APPROVE
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
                                                            onClick={(e) => rejectRequest(values.id)}
                                                            // onClick={(e) => resetForm()}
                                                        >
                                                            REJECT
                                                        </Button>

                                                        <Button
                                                            color="success"
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
                                                        </Button>
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

                                        {openNewSchedule ? (
                                            <NewSchedule
                                                open={openNewSchedule}
                                                handleClose={handleClose}
                                                fuelRequestId={fuelRequstId}
                                                mode={mode}
                                                vehicleObj={vehicleObject}
                                            />
                                        ) : (
                                            ''
                                        )}
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
                i
            </Dialog>
        </div>
    );
}

export default FuelRequest;
