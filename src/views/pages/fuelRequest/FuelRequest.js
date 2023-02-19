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
import { getAllFillingStationData } from 'store/actions/FillingStationAction';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function FuelRequest({ open, handleClose, mode, vehicleId }) {
    const currentUser = AuthService.getCurrentUser();
    const [selectedDate, handleDateChange] = useState(new Date());
    const initialValues = {
        id: '',
        vehicleNumber: null,
        scheduleDate: '',
        scheduleTime: '',
        vehicleType: '',
        fuelType: '',
        createdBy: 'admin',
        userId: currentUser.id
    };
    const today = Date.now();
    // alert(today);

    const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();
    const [vehicleDetails, setVehicleDetails] = useState();
    const [fillingStationDetails, setFillingStationDetails] = useState();

    const vehicleToUpdate = useSelector((state) => state.vehicleReducer.vehicleToUpdate);
    const duplicateVehicleNumber = useSelector((state) => state.vehicleReducer.duplicateVehicleNumber);

    const duplicateChassisNumber = useSelector((state) => state.vehicleReducer.duplicateChassisNumber);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);
    const fillingStationList = useSelector((state) => state.fillingStationReducer.fillingStationList);
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
        // status: yup.boolean(),
        scheduleDate: yup
            .date()
            .label('startsAt')
            .required('Required')
            .min(new Date(Date.now() - 86400000), 'Date cannot be in the past')
        // scheduleDate: yup
        //     .date()
        //     .default(() => new Date())
        //     .required('Required Field')

        // vehicleNumber: yup.string().required('Required field').checkDuplicateVehicleNumber('Already Exist Vehicle Number'),
        // chassisNumber: yup.string().required('Required field').checkDuplicateChassis('Already Exist Chassis Number'),
        // vehicleType: yup.string().required('Required field'),
        // fuelType: yup.string().required('Required field')
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveVehicleData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            dispatch(updateVehicleData(data));
        }

        handleClose();
    };

    useEffect(() => {
        setVehicleDetails(vehicleList);
    }, [vehicleList]);

    useEffect(() => {
        setFillingStationDetails(fillingStationList);
    }, [fillingStationList]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && vehicleToUpdate != null) || (mode === 'VIEW' && vehicleToUpdate != null)) {
            console.log(vehicleToUpdate);
            // if (taxToUpdate.toDate === null) {
            //     vehicleToUpdate.toDate = '';
            // }
            setLoadValues(vehicleToUpdate);
        }
    }, [vehicleToUpdate]);

    useEffect(() => {
        dispatch(getAllVehicleData(currentUser.id));
        dispatch(getAllFillingStationData());
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);

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
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View  ' : ''}
                            Fuel Request Token
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
                                                <Grid item xs={6}>
                                                    <Autocomplete
                                                        // value={values.locationCode}
                                                        name="vehicleNumber"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`vehicleNumber`, value);
                                                            
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        options={vehicleDetails}
                                                        getOptionLabel={(option) => `${option.vehicleNumber}-${option.vehicleType}`}
                                                        // isOptionEqualToValue={(option, value) =>
                                                        //     option.location_id === value.location_id
                                                        // }
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
                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                variant="outlined"
                                                                name="locationCode"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Grid container></Grid>
                                                    <Grid></Grid>
                                                    <Autocomplete
                                                        // value={values.locationCode}
                                                        name="fillingStation"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`fillingStation`, value);
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        options={fillingStationDetails}
                                                        getOptionLabel={(option) => `${option.name}-${option.location}`}
                                                        // isOptionEqualToValue={(option, value) =>
                                                        //     option.location_id === value.location_id
                                                        // }
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
                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                variant="outlined"
                                                                name="fillingStation"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={vehicleNumber}
                                                        label="Eligible Fuel Quota"
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
                                                        id="vehicleNumber"
                                                        name="vehicleNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.vehicleNumber}
                                                        error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                        helperText={
                                                            touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={vehicleNumber}
                                                        label="Remaining Quota"
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
                                                        id="vehicleNumber"
                                                        name="vehicleNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.vehicleNumber}
                                                        error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                        helperText={
                                                            touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={vehicleNumber}
                                                        label="Request Amount Of Quota"
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
                                                        id="vehicleNumber"
                                                        name="vehicleNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.vehicleNumber}
                                                        error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                        helperText={
                                                            touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={vehicleNumber}
                                                        label="Amount"
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
                                                        id="vehicleNumber"
                                                        name="vehicleNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.vehicleNumber}
                                                        error={Boolean(touched.vehicleNumber && errors.vehicleNumber)}
                                                        helperText={
                                                            touched.vehicleNumber && errors.vehicleNumber ? errors.vehicleNumber : ''
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <DatePicker
                                                            onChange={(value) => {
                                                                setFieldValue(`scheduleDate`, value);
                                                            }}
                                                            label="Schedule Date"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            minDate={new Date()}
                                                            // minDate={addDays(today, 21)}
                                                            // maxDate={addMonths(addDays(today, 21), 6)}
                                                            // disabled={
                                                            //     mode == 'VIEW_UPDATE' ||
                                                            //     mode == 'VIEW'
                                                            // // }
                                                            inputFormat="DD/MM/YYYY"
                                                            value={values.scheduleDate}
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
                                                                    name="scheduleDate"
                                                                    onBlur={handleBlur}
                                                                    error={Boolean(touched.scheduleDate && errors.scheduleDate)}
                                                                    helperText={
                                                                        touched.scheduleDate && errors.scheduleDate
                                                                            ? errors.scheduleDate
                                                                            : ''
                                                                    }
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

export default FuelRequest;
