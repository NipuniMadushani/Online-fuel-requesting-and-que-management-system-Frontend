import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Snackbar,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthService from 'services/auth.service';
import { openSnackbar } from 'store/slices/snackbar';
// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [fail, setFail] = useState(false);
    const dispatch = useDispatch();

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    let navigate = useNavigate();

    const googleHandler = async () => {
        console.error('Register');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        console.log('Register');
        // changePassword('123456');
    }, []);

    const navigateLoginPage = () => {
        console.log('navidate');
        navigate('/pages/login');
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={googleHandler}
                            size="large"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.grey[50],
                                borderColor: theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Sign up with Google
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 7,
                                borderColor: `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]}!important`,
                                fontWeight: 500,
                                borderRadius: `${customization.borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            OR
                        </Button>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    // password: '',
                    nic: '',
                    phoneNumber: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Username is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    // password: Yup.string().max(255).required('Password is required'),
                    nic: Yup.string().max(11).required('NIC is required'),
                    phoneNumber: Yup.number()
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    console.log('username:' + values.username);
                    try {
                        if (scriptedRef.current) {
                            AuthService.register(values.username, values.email, values.password, values.nic, values.phoneNumber).then(
                                (response) => {
                                    setStatus({ success: true });
                                    setSuccessful(true);
                                    setSubmitting(true);
                                    console.log('handel submit:' + response.data.message);
                                    // navigate('/pages/login');
                                    // window.location.reload();
                                },
                                (error) => {
                                    console.log('error');
                                    setStatus({ success: false });
                                    setErrors({ submit: error.message });
                                    setSubmitting(false);
                                    const resMessage =
                                        (error.response && error.response.data && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                    setFail(true);
                                }
                            );
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* <Grid item>
                            <Box sx={{ mt: 2 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        onClick={() => {
                                            try {
                                                // navigate('/dashboard/lockhood', { replace: true });
                                                AuthService.sendOTP(values.email);
                                                if (scriptedRef.current) {
                                                    // setStatus({ success: true });
                                                    // setSubmitting(false);
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: 'OTP Sent SucessFully.',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'success'
                                                            },
                                                            close: false
                                                        })
                                                    );

                                                    // setTimeout(() => {
                                                    //     navigate('/login', { replace: true });
                                                    // }, 1500);
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                if (scriptedRef.current) {
                                                    // setStatus({ success: false });
                                                    // setErrors({ submit: err.message });
                                                    // setSubmitting(false);
                                                }
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Send OTP
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid> */}

                        {/* <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    // name="fname"
                                    type="text"
                                    defaultValue=""
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    // name="lname"
                                    type="text"
                                    defaultValue=""
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                        </Grid> */}
                        <FormControl
                            fullWidth
                            error={Boolean(touched.username && errors.username)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-username-register"> Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username-register"
                                type="text"
                                value={values.username}
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.username && errors.username && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.username}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.nic && errors.nic)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-nic-register"> NIC</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-nic-register"
                                type="text"
                                value={values.nic}
                                name="nic"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.nic && errors.nic && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.nic}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-phoneNumber-register"> Phone Number</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-phoneNumber-register"
                                type="number"
                                value={values.phoneNumber}
                                name="phoneNumber"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.phoneNumber}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl> */}

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
                        {successful ? (
                            <Snackbar
                                open={true}
                                autoHideDuration={10}
                                onClose={true}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                <Alert
                                    onClose={true}
                                    severity="success"
                                    sx={{ width: '100%', bgcolor: 'success.main' }}
                                    onClick={() => navigateLoginPage(null)}
                                >
                                    <AlertTitle>SUCESSFULLY REGISTERED</AlertTitle>
                                    Use this credentials for — <strong>Sign In!</strong>
                                    {/* SUCESSFULLY REGISTERED */}
                                </Alert>
                            </Snackbar>
                        ) : null}

                        {fail ? (
                            <Snackbar
                                open={true}
                                autoHideDuration={10}
                                onClose={true}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                <Alert onClose={true} severity="error" sx={{ width: '100%', bgcolor: 'error.main' }}>
                                    REGISTRATION FAILED
                                </Alert>
                            </Snackbar>
                        ) : null}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Send OTP & Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
