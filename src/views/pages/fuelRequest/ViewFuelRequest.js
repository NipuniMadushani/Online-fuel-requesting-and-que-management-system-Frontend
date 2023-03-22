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
import {
    deleteFuelRequestById,
    getAllFuelRequestData,
    getAllFuelRequestDataByUser,
    getLatestModifiedDetails
} from 'store/actions/FuelRequestAction';
import DeleteMsg from 'views/messages/DeleteMsg';
import AcceptMsg from 'views/messages/AcceptMsg';

function ViewFuelRequst() {
    const currentUser = AuthService.getCurrentUser();
    const [open, setOpen] = useState(false);
    const [fuelRequstId, setFuelRequstId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [openAcceptToast, setAcceptHandleToast] = useState(false);
    const [openDeleteToast, setDeleteHandleToast] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [approveStatusMsg, setApproveStatusMsg] = useState('');
    const columns = [
        {
            title: 'Id',
            field: 'id',
            filterPlaceholder: 'filter',
            align: 'center',
            hidden: true
        },
        {
            title: 'Requested Date',
            field: 'requestedDate',
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
            title: 'Requested Quota(L)',
            field: 'actualQuata',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Price (RS.)',
            field: 'fuelAmount',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        // {
        //     title: 'Max Pax',
        //     field: 'maxPax',
        //     filterPlaceholder: 'filter',
        //     align: 'center'
        // },

        {
            title: 'Approval Status',
            field: 'approval_state',
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
                    }}
                >
                    {rowData.approval_state === true ? (
                        <FormGroup>
                            <FormControlLabel control={<Switch size="small" />} checked={true} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel control={<Switch size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        },

        {
            title: 'Reject Status',
            field: 'reject_state',
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
                    }}
                >
                    {rowData.reject_state === true ? (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="error" size="small" />} checked={true} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel control={<Switch size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        }
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.vehicleReducer.errorMsg);
    const fuelRequest = useSelector((state) => state.fuelRequestReducer.fuelRequest);
    const fuelRequestListByUser = useSelector((state) => state.fuelRequestReducer.fuelRequestListByUser);

    const fuelRequstList = useSelector((state) => state.fuelRequestReducer.fuelRequstList);
    const lastModifiedDate = useSelector((state) => state.fuelRequestReducer.lastModifiedDateTime);

    const deleteFuelRequest = useSelector((state) => state.fuelRequestReducer.deleteFuelRequest);
    const acceptFuelRequest = useSelector((state) => state.fuelRequestReducer.acceptFuelRequest);
    const rejectFuelRequest = useSelector((state) => state.fuelRequestReducer.rejectFuelRequest);

    useEffect(() => {
        if (deleteFuelRequest != null && deleteFuelRequest.errorMessages.length != 0) {
            setStatusMsg('DELETE');
            setDeleteHandleToast(true);
        }
        // setLastModifiedTimeDate(lastModifiedDate);
    }, [deleteFuelRequest]);

    useEffect(() => {
        if (acceptFuelRequest != null && acceptFuelRequest.errorMessages.length != 0) {
            setApproveStatusMsg('ACCEPT');
            setAcceptHandleToast(true);
        }
        dispatch(getAllFuelRequestData());
        // setLastModifiedTimeDate(lastModifiedDate);
    }, [acceptFuelRequest]);

    useEffect(() => {
        if (rejectFuelRequest != null && rejectFuelRequest.errorMessages.length != 0) {
            setApproveStatusMsg('REJECT');
            setAcceptHandleToast(true);
        }
        dispatch(getAllFuelRequestData());
        // setLastModifiedTimeDate(lastModifiedDate);
    }, [rejectFuelRequest]);

    useEffect(() => {
        if (fuelRequestListByUser?.length > 0) {
            console.log(fuelRequestListByUser[0].requestedDate);

            setTableData(fuelRequestListByUser);
        }
    }, [fuelRequestListByUser]);

    useEffect(() => {
        if (currentUser?.roles[0] === 'ROLE_ADMIN') {
            if (fuelRequstList?.length > 0) {
                // console.log(fuelRequstList[0].requestedDate);
                setTableData(fuelRequstList);
            }
        }
    }, [fuelRequstList]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (fuelRequest) {
            console.log(currentUser.id);
            setHandleToast(true);
            dispatch(getAllFuelRequestDataByUser(currentUser.id));
        }
    }, [fuelRequest]);

    // useEffect(() => {
    //     dispatch(getAllFuelRequestDataByUser(currentUser.id));
    //     // dispatch(getActivity_SupplementLatestModifiedDetails());
    // }, []);

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
        if (currentUser?.roles[0] === 'ROLE_ADMIN') {
            dispatch(getAllFuelRequestData());
        } else {
            dispatch(getAllFuelRequestDataByUser(currentUser.id));
            dispatch(getLatestModifiedDetails(currentUser.id));
        }
        // dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    useEffect(() => {
        setLastModifiedTimeDate(
            lastModifiedDate === null
                ? ''
                : new Date(lastModifiedDate).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })
        );
    }, [lastModifiedDate]);

    return (
        <div>
            <MainCard title="Fuel Request">
                <div style={{ textAlign: 'right' }}> Last Modified Date : {lastModifiedTimeDate}</div>
                <br />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <MaterialTable
                                    columns={columns}
                                    data={tableData}
                                    editable={{
                                        onRowDelete: (oldData) =>
                                            new Promise((resolve, reject) => {
                                                alert(oldData.id);
                                                dispatch(deleteFuelRequestById(oldData.id));
                                                setTimeout(() => {
                                                    const dataDelete = [...tableData];
                                                    const index = oldData.tableData.id;
                                                    dataDelete.splice(index, 1);
                                                    setTableData([...dataDelete]);

                                                    resolve();
                                                }, 1000);
                                            })
                                    }}
                                    actions={[
                                        currentUser?.roles[0] === 'ROLE_CUSTOMER'
                                            ? {
                                                  icon: tableIcons.Add,
                                                  tooltip: 'Add New',
                                                  isFreeAction: true,
                                                  onClick: () => handleClickOpen('INSERT', null)
                                              }
                                            : null,

                                        currentUser?.roles[0] === 'ROLE_ADMIN'
                                            ? (rowData) => ({
                                                  icon: tableIcons.AddTaskIcon,
                                                  tooltip: 'Approve / Reject',
                                                  onClick: () => handleClickOpen('APPROVE', rowData)
                                              })
                                            : null,

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
                                        grouping: true,
                                        exportAllData: true,
                                        exportFileName: 'Fuel Request Data',
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
                                {openDeleteToast ? (
                                    <DeleteMsg openToast={openDeleteToast} handleToast={handleToast} mode={statusMsg} />
                                ) : null}
                                {openAcceptToast ? (
                                    <AcceptMsg openToast={openAcceptToast} handleToast={handleToast} mode={approveStatusMsg} />
                                ) : null}
                                {open ? <FuelRequest open={open} handleClose={handleClose} fuelRequestId={fuelRequstId} mode={mode} /> : ''}
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
