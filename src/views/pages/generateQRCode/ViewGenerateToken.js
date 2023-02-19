import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Formik, Form, FieldArray } from 'formik';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import { QrReader } from 'react-qr-reader';
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
import { useState } from 'react';
import { useRef } from 'react';

const ViewGenerateToken = () => {
    const initialValues = {
        vehicleNumber: '',
        eligibleQuota: '',
        vehicleType: '',
        fromDate: '',
        toDate: '',
        createdBy: 'admin'
    };
    const [qrValue, setQrValue] = useState('Malinga Lakshan');
    const [qrImageUrl, setqrImgaeUrl] = useState('');
    const [data, setData] = useState(null);
    const [file, setFile] = useState(null);
    const [scanResultWebCam, setScanResultWebCam] = useState('');
    const fileRef = useRef();

    const handleSubmitForm = async (e) => {
        if (qrValue != '') {
            const response = await QRCode.toDataURL(qrValue);
            console.log(response);
            setqrImgaeUrl(response);
        }
    };

    const handleClick = () => {
        fileRef.current.click();
        console.log(file);
    };

    const handleChange = async (e) => {
        const file = e.target.files[0];
        setFile(file);
        const result = await QrScanner.scanImage(file);
        console.log(result);
        setData(result);
    };

    const handleErrorWebCam = (error) => {
        console.log(error);
    };
    const handleScanWebCam = (result) => {
        if (result) {
            setScanResultWebCam(result);
        }
    };

    return (
        <div>
            <MainCard title="QR Code Reader And Generator">
                {/* <div style={{ textAlign: 'right' }}> Last Modified Date : {lastModifiedTimeDate}</div> */}
                <br />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '1.125rem', fontWeight: 100, mr: 1, mt: 1.75, mb: 0.75 }}>
                                    Generate QR Code
                                </Typography>

                                <Formik
                                    enableReinitialize={true}
                                    initialValues={initialValues}
                                    onSubmit={(values) => {
                                        console.log(values);
                                        handleSubmitForm(values);
                                    }}
                                    // validationSchema={validationSchema}
                                >
                                    {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                        return (
                                            <Form>
                                                <Box sx={{ width: '100%' }}>
                                                    <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                sx={{
                                                                    width: { sm: 200, md: 200 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                // disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                id="standard-select-currency"
                                                                select
                                                                label="Select Vehicle Number"
                                                                name="vehicleNumber"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                // defaultValue={values.groupType}
                                                                value={values.vehicleNumber}

                                                                // error={Boolean(touched.groupType && errors.groupType)}
                                                                // helperText={
                                                                //     touched.groupType && errors.groupType
                                                                //         ? errors.groupType
                                                                //         : ''
                                                                // }
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
                                                            <TextField
                                                                // disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                // label={taxCode}
                                                                label="Quota"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                sx={{
                                                                    width: { xs: 150, sm: 200 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                type="text"
                                                                variant="outlined"
                                                                placeholder="ABC 1234"
                                                                id="eligibleQuota"
                                                                name="eligibleQuota"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.eligibleQuota}
                                                                // error={Boolean(touched.taxCode && errors.taxCode)}
                                                                // helperText={touched.taxCode && errors.taxCode ? errors.taxCode : ''}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={6}>
                                                            <TextField
                                                                // disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                // label={taxCode}
                                                                label="Vehivle Type"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                sx={{
                                                                    width: { xs: 150, sm: 200 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                type="text"
                                                                variant="outlined"
                                                                placeholder="ABC 1234"
                                                                id="taxCode"
                                                                name="taxCode"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                // value={values.taxCode}
                                                                // error={Boolean(touched.taxCode && errors.taxCode)}
                                                                // helperText={touched.taxCode && errors.taxCode ? errors.taxCode : ''}
                                                            />
                                                        </Grid>

                                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                            <Button
                                                                variant="outlined"
                                                                type="submit"
                                                                style={{
                                                                    // backgroundColor: '#B22222',
                                                                    marginLeft: '10px'
                                                                }}
                                                                // onClick={(e) => resetForm()}
                                                            >
                                                                GENERATE QR
                                                            </Button>
                                                        </Box>

                                                        {qrImageUrl ? (
                                                            <a href={qrImageUrl} download={qrValue}>
                                                                <img src={qrImageUrl} alt="QR Code"></img>
                                                            </a>
                                                        ) : (
                                                            // <Button className="btnSave" variant="contained" type="submit">
                                                            //     {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                                            // </Button>
                                                            ''
                                                        )}

                                                        {/* {qrImageUrl ? (
                                                            <a href={qrImageUrl} download={qrValue}>
                                                                <img src={qrImageUrl} alt="QR Code"></img>
                                                            </a>
                                                        ) : (
                                                            // <Button className="btnSave" variant="contained" type="submit">
                                                            //     {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                                            // </Button>
                                                            ''
                                                        )} */}
                                                    </Grid>
                                                </Box>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                                <h3>QR Scan by web cam</h3>
                                <Grid item>
                                    <h3>Qr Code Scan by Web Cam</h3>
                                    <QrReader delay={300} style={{ width: '100%' }} onError={handleErrorWebCam} onScan={handleScanWebCam} />
                                    <h3>Scanned By WebCam Code: {scanResultWebCam}</h3>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '1.125rem', fontWeight: 100, mr: 1, mt: 1.75, mb: 0.75 }}>
                                    Read QR Code
                                </Typography>

                                <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                    <Grid item xs={6}>
                                        {/* <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}> */}
                                        <Button
                                            variant="outlined"
                                            type="button"
                                            style={{
                                                // backgroundColor: '#B22222',
                                                marginLeft: '10px'
                                            }}
                                            onClick={handleClick}
                                        >
                                            SCAN QR CODE
                                        </Button>
                                        {/* </Box> */}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <input
                                            style={{ display: 'none' }}
                                            type="file"
                                            ref={fileRef}
                                            onChange={handleChange}
                                            accept=".png,.jpg,.jpeg"
                                        />
                                    </Grid>

                                    {file ? <img src={URL.createObjectURL(file)} alt="QR Code"></img> : ''}

                                    {data ? <p className="display-5 fw-bold mt-5">data :{data}</p> : ''}
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* </SubCard> */}
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
};

export default ViewGenerateToken;
