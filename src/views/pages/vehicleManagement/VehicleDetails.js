import { useEffect, forwardRef, useState } from 'react';

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
    FormLabel
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'assets/scss/style.scss';
import { useDispatch, useSelector } from 'react-redux';

import * as yup from 'yup';
import { Formik, Form } from 'formik';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    checkChassisNumber,
    checkDuplicateVehiclesCode,
    checkVehicleNumber,
    getVehicleDetailsByCode,
    saveVehicleData,
    updateVehicleData
} from 'store/actions/VehicleAction';
import AuthService from 'services/auth.service';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function VehicleDetails({ open, handleClose, mode, vehicleId }) {
    const currentUser = AuthService.getCurrentUser();
    const initialValues = {
        id: '',
        vehicleNumber: '',
        chassisNumber: '',
        vehicleType: '',
        fuelType: '',
        createdBy: 'admin',
        userId: currentUser.id
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();

    const vehicleToUpdate = useSelector((state) => state.vehicleReducer.vehicleToUpdate);
    const duplicateVehicleNumber = useSelector((state) => state.vehicleReducer.duplicateVehicleNumber);

    const duplicateChassisNumber = useSelector((state) => state.vehicleReducer.duplicateChassisNumber);

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
        status: yup.boolean(),
        vehicleNumber: yup.string().required('Required field').checkDuplicateVehicleNumber('Already Exist Vehicle Number'),
        chassisNumber: yup.string().required('Required field').checkDuplicateChassis('Already Exist Chassis Number'),
        vehicleType: yup.string().required('Required field'),
        fuelType: yup.string().required('Required field')
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
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log('vehicle id:' + vehicleId);
            dispatch(getVehicleDetailsByCode(vehicleId));
        }
    }, [mode]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && vehicleToUpdate != null) || (mode === 'VIEW' && vehicleToUpdate != null)) {
            console.log(vehicleToUpdate);
            // if (taxToUpdate.toDate === null) {
            //     vehicleToUpdate.toDate = '';
            // }
            setLoadValues(vehicleToUpdate);
        }
    }, [vehicleToUpdate]);

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
                            {mode === 'INSERT' ? 'Register' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View  ' : ''}
                            Vehicle
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
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={vehicleNumber}
                                                        label="Vehicle Number"
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
                                                        placeholder="ABC 1234"
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
                                                        label="Chassis Number"
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        // label={chassisNumber}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        className="required"
                                                        type="text"
                                                        variant="outlined"
                                                        id="chassisNumber"
                                                        name="chassisNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.chassisNumber}
                                                        error={Boolean(touched.chassisNumber && errors.chassisNumber)}
                                                        helperText={
                                                            touched.chassisNumber && errors.chassisNumber ? errors.chassisNumber : ''
                                                        }
                                                    />
                                                </Grid>
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
                                                        label="Vehicle Type"
                                                        name="vehicleType"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.vehicleType}
                                                        error={Boolean(touched.vehicleType && errors.vehicleType)}
                                                        helperText={touched.vehicleType && errors.vehicleType ? errors.vehicleType : ''}
                                                    >
                                                        <MenuItem dense={true} value={'Bike'}>
                                                            Bike
                                                        </MenuItem>
                                                        <MenuItem dense={true} value={'Three Wheeler'}>
                                                            Three Wheeler
                                                        </MenuItem>
                                                        <MenuItem dense={true} value={'Bus'}>
                                                            Bus
                                                        </MenuItem>
                                                        <MenuItem dense={true} value={'Lorry'}>
                                                            Lorry
                                                        </MenuItem>
                                                        <MenuItem dense={true} value={'Van'}>
                                                            Van
                                                        </MenuItem>
                                                    </TextField>
                                                </Grid>

                                                <Grid item xs={6}>
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
                                                </Grid>
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
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default VehicleDetails;
