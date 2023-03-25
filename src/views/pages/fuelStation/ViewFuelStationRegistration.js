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
import FuelStation from './FuelStation';
import { getAllFillingStationData } from 'store/actions/FillingStationAction';
import SuccessMsgFillingStation from 'views/messages/SucessMsgFillingStation';

function ViewFuelStationRegistrtion() {
    const currentUser = AuthService.getCurrentUser();
    const [open, setOpen] = useState(false);
    const [fuelStationId, setFuelStationId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [managerEmail, setManagerEmail] = useState('');

    const columns = [
        {
            title: 'Id',
            field: 'id',
            filterPlaceholder: 'filter',
            align: 'center',
            hidden: true
        },
        {
            title: 'Owner Name',
            field: 'ownerName',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Fuel Station Name',
            field: 'displayName',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Near By Town',
            field: 'nearByTown',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Address',
            field: 'location',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Status',
            field: 'activeState',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div
                    style={{
                        alignItems: 'center',
                        align: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                        // background: rowData.status === true ? "#008000aa" : "#f90000aa",
                        // borderRadius: "4px",
                        // paddingLeft: 5,
                        // paddingRight: 5,
                    }}
                >
                    {rowData.activeState === true ? (
                        <FormGroup>
                            <FormControlLabel control={<Switch size="small" />} checked={true} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="error" size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        }
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.vehicleReducer.errorMsg);
    const fillingStation = useSelector((state) => state.fillingStationReducer.fillingStation);
    const fillingStationList = useSelector((state) => state.fillingStationReducer.fillingStationList);

    // const lastModifiedDate = useSelector((state) => state.activity_supplimentReducer.lastModifiedDateTime);

    // useEffect(() => {
    //     setLastModifiedTimeDate(lastModifiedDate);
    // }, [lastModifiedDate]);

    useEffect(() => {
        if (fillingStationList?.length > 0) {
            setTableData(fillingStationList);
        }
    }, [fillingStationList]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (fillingStation) {
            console.log(currentUser.id);
            setManagerEmail(fillingStation.managerEmail);
            localStorage.setItem('fillingStationName', fillingStation.display_name);
            setHandleToast(true);

            dispatch(getAllFillingStationData());
        }
    }, [fillingStation]);

    // get all
    useEffect(() => {
        console.log(currentUser.id);
        dispatch(getAllFillingStationData());
    }, []);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setFuelStationId(data.id);
        } else if (type === 'INSERT') {
            setFuelStationId('');
            setMode(type);
        } else {
            setMode(type);
            setFuelStationId(data.id);
        }
        currentUser?.roles[0] === 'ROLE_ADMIN' ? setOpen(true) : '';
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
            <MainCard title="Fuel Station Details">
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
                                        currentUser?.roles[0] === 'ROLE_ADMIN'
                                            ? {
                                                  icon: tableIcons.Add,
                                                  tooltip: 'Add New',
                                                  isFreeAction: true,
                                                  onClick: () => handleClickOpen('INSERT', null)
                                              }
                                            : null,
                                        (rowData) => ({
                                            icon: tableIcons.Edit,
                                            tooltip: 'Edit',
                                            onClick: () => handleClickOpen('VIEW_UPDATE', rowData)
                                        }),
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

                                {open && currentUser?.roles[0] === 'ROLE_ADMIN' ? (
                                    <FuelStation open={open} handleClose={handleClose} fuelStationId={fuelStationId} mode={mode} />
                                ) : (
                                    ''
                                )}
                                {openToast ? (
                                    <SuccessMsgFillingStation
                                        openToast={openToast}
                                        email={managerEmail}
                                        handleToast={handleToast}
                                        mode={mode}
                                    />
                                ) : null}
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

export default ViewFuelStationRegistrtion;
