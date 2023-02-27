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

import { Divider } from '@material-ui/core';

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
import { getFillingStationDetailsByCode, saveFillingStationData, updateFillingStationData } from 'store/actions/FillingStationAction';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function FuelStation({ open, handleClose, mode, fuelStationId }) {
    const currentUser = AuthService.getCurrentUser();
    const initialValues = {
        id: '',
        ownerName: '',
        displayName: '',
        nearByTown: '',
        location: '',
        activeState: true,
        managerFirstName: '',
        managerLastName: '',
        managerEmail: '',
        managerContactNumber: '',
        createdBy: currentUser.id,
        petrolStock: 0,
        remainingPetrolStock: 0,
        dieselStock: 0,
        remainingDieselStock: 0
        // userId: currentUser.id
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();

    const fillingStationToUpdate = useSelector((state) => state.fillingStationReducer.fillingStationToUpdate);
    const duplicateVehicleNumber = useSelector((state) => state.vehicleReducer.duplicateVehicleNumber);

    const duplicateChassisNumber = useSelector((state) => state.vehicleReducer.duplicateChassisNumber);
    const [fillingDetailDetailsShow, setFillingDetailDetailsShow] = useState(true);
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

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const validationSchema = yup.object().shape({
        activeStatus: yup.boolean(),
        ownerName: yup.string().required('Required field'),
        displayName: yup.string().required('Required field'),
        location: yup.string().required('Required field'),
        managerFirstName: yup.string().required('Required field'),
        managerEmail: yup.string().required('Required field').email(),
        managerContactNumber: yup
            .string()
            .required('Required field')
            .matches(phoneRegExp, 'Not valid')
            .min(10, 'Must be exactly 10 digits')
            .max(10, 'Must be 10 digits')
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveFillingStationData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            dispatch(updateFillingStationData(data));
        }

        handleClose();
    };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log('fuelStationId:' + fuelStationId);
            dispatch(getFillingStationDetailsByCode(fuelStationId));
        }
    }, [mode]);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        console.log(currentUser?.roles[0]);
        if (currentUser?.roles[0] === 'ROLE_FUEL_STATION') {
            // dispatch(getFillingStationDetailsManagerWise(currentUser.username));
            // dispatch(getAllFillingStationData());
            setFillingDetailDetailsShow(true);
        } else {
            setFillingDetailDetailsShow(false);
        }
    }, []);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && fillingStationToUpdate != null) || (mode === 'VIEW' && fillingStationToUpdate != null)) {
            console.log(fillingStationToUpdate);
            // if (taxToUpdate.toDate === null) {
            //     fillingStationToUpdate.toDate = '';
            // }
            setLoadValues(fillingStationToUpdate);
        }
    }, [fillingStationToUpdate]);

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
                            Fuel Station
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
                                                        disabled={mode == 'VIEW'}
                                                        // label={vehicleNumber}
                                                        label="Fuel Station Owner"
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
                                                        id="ownerName"
                                                        name="ownerName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.ownerName}
                                                        error={Boolean(touched.ownerName && errors.ownerName)}
                                                        helperText={touched.ownerName && errors.ownerName ? errors.ownerName : ''}
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
                                                        disabled={mode == 'VIEW'}
                                                        label="Display Name"
                                                        name="displayName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.displayName}
                                                        error={Boolean(touched.displayName && errors.displayName)}
                                                        helperText={touched.displayName && errors.displayName ? errors.displayName : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW'}
                                                        label="Nearly Town"
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
                                                        id="nearByTown"
                                                        name="nearByTown"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.nearByTown}
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
                                                        disabled={mode == 'VIEW'}
                                                        label="Address"
                                                        name="location"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.location}
                                                        error={Boolean(touched.location && errors.location)}
                                                        helperText={touched.location && errors.location ? errors.location : ''}
                                                    ></TextField>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            name="activeState"
                                                            control={<Switch />}
                                                            label="Status"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={handleChange}
                                                            checked={values.activeState}
                                                            value={values.activeState}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <br />
                                        <Divider />
                                        <Box sx={{ width: '100%' }}>
                                            <Typography mt={2} align="justify">
                                                Fuel Station Manager Details
                                            </Typography>
                                        </Box>

                                        <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                    // label={vehicleNumber}
                                                    label="First Name"
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
                                                    id="managerFirstName"
                                                    name="managerFirstName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.managerFirstName}
                                                    error={Boolean(touched.managerFirstName && errors.managerFirstName)}
                                                    helperText={
                                                        touched.managerFirstName && errors.managerFirstName ? errors.managerFirstName : ''
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                    label="Last Name"
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
                                                    id="managerLastName"
                                                    name="managerLastName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.managerLastName}
                                                    // error={Boolean(touched.chassisNumber && errors.chassisNumber)}
                                                    // helperText={touched.chassisNumber && errors.chassisNumber ? errors.chassisNumber : ''}
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
                                                    disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                    label="Email"
                                                    name="managerEmail"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                    // defaultValue={values.groupType}
                                                    value={values.managerEmail}
                                                    error={Boolean(touched.managerEmail && errors.managerEmail)}
                                                    helperText={touched.managerEmail && errors.managerEmail ? errors.managerEmail : ''}
                                                ></TextField>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    sx={{
                                                        width: { sm: 200, md: 250 },
                                                        '& .MuiInputBase-root': {
                                                            height: 40
                                                        }
                                                    }}
                                                    disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                    label="Contact Number"
                                                    name="managerContactNumber"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                    // defaultValue={values.groupType}
                                                    value={values.managerContactNumber}
                                                    error={Boolean(touched.managerContactNumber && errors.managerContactNumber)}
                                                    helperText={
                                                        touched.managerContactNumber && errors.managerContactNumber
                                                            ? errors.managerContactNumber
                                                            : ''
                                                    }
                                                ></TextField>
                                            </Grid>
                                        </Grid>
                                        {fillingDetailDetailsShow ? (
                                            <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{
                                                            width: { sm: 200, md: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        type="number"
                                                        disabled={mode == 'VIEW'}
                                                        label="Petrol Stock"
                                                        name="petrolStock"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.petrolStock}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{
                                                            width: { sm: 200, md: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled={mode == 'VIEW'}
                                                        label="Remaining Petrol Stock"
                                                        name="remainingPetrolStock"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.remainingPetrolStock}
                                                    ></TextField>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{
                                                            width: { sm: 200, md: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        type="number"
                                                        disabled={mode == 'VIEW'}
                                                        label="Diesel Stock"
                                                        name="dieselStock"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.dieselStock}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{
                                                            width: { sm: 200, md: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled={mode == 'VIEW'}
                                                        label="Remaining Diesel Stock"
                                                        name="remainingDieselStock"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        // defaultValue={values.groupType}
                                                        value={values.remainingDieselStock}
                                                    ></TextField>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            ''
                                        )}

                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                            {mode != 'VIEW' ? (
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

                                            {mode != 'VIEW' ? (
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

export default FuelStation;
