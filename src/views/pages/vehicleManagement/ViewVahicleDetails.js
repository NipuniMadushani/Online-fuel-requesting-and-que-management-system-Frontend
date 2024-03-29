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
import VehicleDetails from './VehicleDetails';

function ViewVahicleDetails() {
    const currentUser = AuthService.getCurrentUser();
    const [open, setOpen] = useState(false);
    const [vehicleId, setVehicleId] = useState('');
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
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.vehicleReducer.errorMsg);
    const vehicle = useSelector((state) => state.vehicleReducer.vehicle);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);

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

    // get all
    useEffect(() => {
        console.log(currentUser.id);
        dispatch(getAllVehicleData(currentUser.id));
    }, []);

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
    return (
        <div>
            <MainCard title="Vehicle Details">
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

                                {open ? <VehicleDetails open={open} handleClose={handleClose} vehicleId={vehicleId} mode={mode} /> : ''}
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

export default ViewVahicleDetails;
