import { useEffect, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';

import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'react-redux';

import MainCard from 'ui-component/cards/MainCard';

import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';

import SuccessMsg from 'views/messages/SuccessMsg';
import ErrorMsg from 'views/messages/ErrorMsg';
import { getAllVehicleData } from 'store/actions/VehicleAction';
import AuthService from 'services/auth.service';
import FuelRequest from './FuelRequest';
// import VehicleDetails from './VehicleDetails';

function ViewFuelRequst() {
    const currentUser = AuthService.getCurrentUser();
    const [open, setOpen] = useState(false);
    const [fuelRequstId, setFuelRequstId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);

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
        if (vehicleList?.length > 0) {
            setTableData(vehicleList);
        }
    }, [vehicleList]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (vehicle) {
            console.log(currentUser.id);
            setHandleToast(true);
            dispatch(getAllVehicleData(currentUser.id));
        }
    }, [vehicle]);

    useEffect(() => {
        dispatch(getAllVehicleData(currentUser.id));
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setFuelRequstId(data.id);
        } else if (type === 'INSERT') {
            setFuelRequstId('');
            setMode(type);
        } else {
            setMode(type);
            setFuelRequstId(data.id);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        dispatch(getAllVehicleData(currentUser.id));
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    return (
        <div>
            <MainCard title="Fuel Request">
                {/* <div style={{ textAlign: 'right' }}> Last Modified Date : {lastModifiedTimeDate}</div> */}
                <br />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <MaterialTable
                                    columns={columns}
                                    data={tableData}
                                    actions={[
                                        {
                                            icon: tableIcons.Add,
                                            tooltip: 'Add New',
                                            isFreeAction: true,
                                            onClick: () => handleClickOpen('INSERT', null)
                                        },
                                        // (rowData) => ({
                                        //     icon: tableIcons.Edit,
                                        //     tooltip: 'Edit',
                                        //     onClick: () => handleClickOpen('VIEW_UPDATE', rowData)
                                        // }),
                                        (rowData) => ({
                                            icon: tableIcons.VisibilityIcon,
                                            tooltip: 'View',
                                            onClick: () => handleClickOpen('VIEW', rowData)
                                        })
                                    ]}
                                    options={{
                                        padding: 'dense',
                                        showTitle: false,
                                        sorting: true,
                                        search: true,
                                        searchFieldAlignment: 'right',
                                        searchAutoFocus: true,
                                        searchFieldVariant: 'standard',
                                        filtering: true,
                                        paging: true,
                                        pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
                                        pageSize: 5,
                                        paginationType: 'stepped',
                                        showFirstLastPageButtons: false,
                                        exportButton: true,
                                        exportAllData: true,
                                        exportFileName: 'TableData',
                                        actionsColumnIndex: -1,
                                        columnsButton: true,

                                        headerStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            maxHeight: 20,
                                            padding: 2,
                                            fontSize: '14px',
                                            background: '-moz-linear-gradient(top, #0790E8, #3180e6)',
                                            background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
                                            background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
                                            // textAlign: 'center',
                                            color: '#FFF'
                                        },
                                        rowStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            fontSize: '13px',
                                            padding: 0
                                        }
                                    }}
                                />

                                {open ? <FuelRequest open={open} handleClose={handleClose} vehicleId={fuelRequstId} mode={mode} /> : ''}
                                {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                                {openErrorToast ? (
                                    <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={mode} />
                                ) : null}
                            </Grid>
                        </Grid>
                        {/* </SubCard> */}
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
}

export default ViewFuelRequst;

// import React, { Component } from 'react';
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
// export class ViewFuelRequest extends Component {
//     render() {
//         return (
//             <Map google={this.props.google} zoom={14}>
//                 <Marker onClick={this.onMarkerClick} name={'Current location'} />

//                 <InfoWindow onClose={this.onInfoWindowClose}>
//                     <div>{/* <h1>{this.state.selectedPlace.name}</h1> */}</div>
//                 </InfoWindow>
//             </Map>
//         );
//     }
// }

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyCmlZj4mYFWhw5LZPMRTLZPThcO0qE5HCM'
// })(ViewFuelRequest);
