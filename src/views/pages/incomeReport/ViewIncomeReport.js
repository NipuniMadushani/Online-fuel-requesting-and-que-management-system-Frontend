import { useEffect, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';
import { useTheme, styled } from '@mui/material/styles';

import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'react-redux';

import MainCard from 'ui-component/cards/MainCard';

import { FormControlLabel, FormGroup, Grid, Switch, Chip } from '@mui/material';

import SuccessMsg from 'views/messages/SuccessMsg';
import ErrorMsg from 'views/messages/ErrorMsg';
import { getAllVehicleData } from 'store/actions/VehicleAction';
import AuthService from 'services/auth.service';
import { getFillingStationDetailsManagerWise } from 'store/actions/FillingStationAction';
// import NewScheduleOwner from './NewScheduleConfirm';

function ViewIncomeReport() {
    const currentUser = AuthService.getCurrentUser();
    const [open, setOpen] = useState(false);
    const [newRequestId, setNewRequestId] = useState('');
    const [fillingstationId, setFillingStationId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const theme = useTheme();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        marginRight: '5px'
    };

    const columns = [
        {
            title: 'Id',
            field: 'id',
            filterPlaceholder: 'filter',
            align: 'center',
            hidden: true
        },
        // {
        //     title: 'Available Date',
        //     field: 'availableDate',
        //     filterPlaceholder: 'filter',
        //     align: 'center'
        //     // type: 'date',
        //     // filterComponent: (props) => <CustomDatePicker {...props} />
        //     // dateSetting: { locale: 'ko-KR' }
        // },
        // {
        //     title: 'Time',
        //     field: 'availableTime',
        //     filterPlaceholder: 'filter',
        //     align: 'center'
        // },

        {
            title: 'Vehicle',
            field: 'vehicle',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Requested Quota (L)',
            field: 'actualQuata',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Price (RS.)',
            field: 'fualAmount',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Status',
            field: 'scheduleState',
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
                    {rowData.scheduleState === true ? (
                        <FormGroup>
                            <Chip label="NEW" sx={chipErrorSX} />
                            {/* <FormControlLabel control={<Switch size="small" />} checked={true} /> */}
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <Chip label="NEW" sx={chipErrorSX} />
                            {/* <FormControlLabel control={<Switch color="error" size="small" />} checked={false} /> */}
                        </FormGroup>
                    )}
                </div>
            )
        }
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.vehicleReducer.errorMsg);
    const vehicle = useSelector((state) => state.vehicleReducer.vehicle);
    const vehicleList = useSelector((state) => state.vehicleReducer.vehicleList);
    const fillingStation = useSelector((state) => state.fillingStationReducer.fillingStationDetails);

    useEffect(() => {
        dispatch(getFillingStationDetailsManagerWise(currentUser.username));
    }, []);

    useEffect(() => {
        console.log(fillingStation);
        setFillingStationId(fillingStation[0].id);
    }, [fillingStation]);

    // useEffect(() => {
    //     const arrayList = [];
    //     AuthService.fetchNewRequstByUserId(currentUser.id).then((res) => {
    //         let newRequest = res.data;

    //         newRequest?.payload[0].forEach((element) => {
    //             console.log(element.id);
    //             const initialValues = {
    //                 id: element.id,
    //                 customer: currentUser,
    //                 vehicle: element.vehicle.vehicleNumber,
    //                 actualQuata: element.fuelRequest.actualQuata,
    //                 balanceQuata: '',
    //                 eligibleQuata: '',
    //                 availableDate: element.availableDate,
    //                 scheduleTime: '',
    //                 vehicleType: '',
    //                 fuelType: '',
    //                 fualAmount: element.fuelRequest.fuelAmount,
    //                 pricePerLiter: '',
    //                 fuelStation: null,
    //                 // lastDate: dateofSunday,
    //                 scheduleState: element.scheduleState
    //             };
    //             arrayList.push(initialValues);
    //         });
    //         setTableData(arrayList);
    //     });
    // }, []);

    useEffect(() => {
        // const id = fillingStation.id;
        console.log(fillingstationId);
        // alert(fillingstationId);
        const getQuotadata = async () => {
            const reqData = await fetch(
                'http://localhost:8090/api/auth/v1/fuelrequest/get-daily-income-by-fuel-station-id/' + `${fillingstationId}`
            );
            const resData = await reqData.json();
            console.log(resData);
            // for (let i = 0; i < resData.length; i++) {
            //     dates.push(resData[i][0]);
            //     quota.push(parseInt(resData[i][1]));
            // }
            // setWeekDays(dates);
            // setAcceptedQuota(quota);
        };
        getQuotadata();
    }, [fillingstationId]);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW') {
            setMode(type);
            setNewRequestId(data);
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
            <MainCard title="Income Report">
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
                                            icon: tableIcons.PaymentsIcon,
                                            tooltip: 'Confirm',
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

                                {/* {open ? (
                                    <NewScheduleOwner open={open} handleClose={handleClose} newRequest={newRequestId} mode={mode} />
                                ) : (
                                    ''
                                )}
                                {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                                {openErrorToast ? (
                                    <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={mode} />
                                ) : null} */}
                            </Grid>
                        </Grid>
                        {/* </SubCard> */}
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
}

export default ViewIncomeReport;
