import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// material-ui
import { Drawer, FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import AuthService from 'services/auth.service';
import { useDispatch } from 'react-redux';
import { getFillingStationDetailsManagerWise } from 'store/actions/FillingStationAction';
import MainCard from 'ui-component/cards/MainCard';
import MaterialTable from 'material-table';

import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'react-redux';
import FuelStation from 'views/pages/fuelStation/FuelStation';
import SuccessMsg from 'views/messages/SuccessMsg';
import SideIconCard from 'ui-component/cards/Skeleton/SideIconCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
const currentUser = AuthService.getCurrentUser();

//pie chart
import Chart from 'react-apexcharts';
import ProjectTaskCard from 'ui-component/cards/Skeleton/ProjectTaskCard';
import RegisteredVehiclesCard from './RegisteredVehiclesCard';
import RegisteredDailyQueueCard from './RegisteredDailyQueueCard';
import RemainingDieselCard from './RemainingDieselCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [fillingDetailDetailsShow, setFillingDetailDetailsShow] = useState(true);
    const fillingStationDetails = useSelector((state) => state.fillingStationReducer.fillingStationDetails);
    const [tableData, setTableData] = useState([]);
    const [fuelStationId, setFuelStationId] = useState('');
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const fillingStation = useSelector((state) => state.fillingStationReducer.fillingStation);
    const [vehicleOwnerCardVisible, setVehicleOwnerCardVisible] = useState(false);
    const [adminCardVisible, setAdminCardVisible] = useState(false);
    const [managerCardVisible, setManagerCardVisible] = useState(false);
    const theme = useTheme();
    const [vehicleCount, setVehicleCount] = useState(null);

    const [stdudentSubject, setStudentsubject] = useState([]);
    const [studentMarks, setStudentMarks] = useState([]);

    const [weekDays, setWeekDays] = useState([]);
    const [acceptedQuota, setAcceptedQuota] = useState([]);
    const [fillingSttaionCount, setFillingStationCount] = useState(null);

    useEffect(() => {
        const sSubject = [];
        const sMarks = [];
        const getStudentdata = async () => {
            const reqData = await fetch('http://localhost:8090/api/auth/v1/fuelrequest/allIncome');
            const resData = await reqData.json();
            for (let i = 0; i < resData.length; i++) {
                sSubject.push(resData[i][0]);
                sMarks.push(parseInt(resData[i][1]));
            }
            setStudentsubject(sSubject);
            setStudentMarks(sMarks);
        };
        getStudentdata();

        const dates = [];
        const quota = [];
        const getQuotadata = async () => {
            const reqData = await fetch('http://localhost:8090/api/auth/v1/fuelrequest/allTokenRequest');
            const resData = await reqData.json();
            for (let i = 0; i < resData.length; i++) {
                dates.push(resData[i][0]);
                quota.push(parseInt(resData[i][1]));
            }
            setWeekDays(dates);
            setAcceptedQuota(quota);
        };
        getQuotadata();
    }, []);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        console.log(currentUser?.roles[0]);
        if (currentUser?.roles[0] === 'ROLE_CUSTOMER') {
            setVehicleOwnerCardVisible(true);
        } else {
            setVehicleOwnerCardVisible(false);
        }

        if (currentUser?.roles[0] === 'ROLE_ADMIN') {
            setAdminCardVisible(true);
            const getRegisteredVehicleCount = async () => {
                const reqData = await fetch('http://localhost:8090/api/auth/v1/Vehicle/allRegisteredVehiclesCount'); // console.log(await reqData.json());                 const vehicleCount = await reqData.json();
                const vehicleCount = await reqData.json();
                setVehicleCount(vehicleCount);
            };
            getRegisteredVehicleCount();

            const getFillingStationCount = async () => {
                const reqData = await fetch('http://localhost:8090/api/auth/v1/fuel-station/allRegisteredFuelStationCount');
                // console.log(await reqData.json());
                const vehicleCount = await reqData.json();
                setFillingStationCount(vehicleCount);
            };
            getFillingStationCount();
        } else {
            setAdminCardVisible(false);
        }

        // if (currentUser?.roles[0] === 'ROLE_FUEL_STATION') {
        //     setManagerCardVisible(true);
        // } else {
        //     setManagerCardVisible(false);
        // }

        if (currentUser?.roles[0] === 'ROLE_FUEL_STATION') {
            dispatch(getFillingStationDetailsManagerWise(currentUser.username));
            // dispatch(getAllFillingStationData());
            setFillingDetailDetailsShow(true);
        } else {
            setFillingDetailDetailsShow(false);
        }
    }, []);

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
            title: 'Petrol Stock (L)',
            field: 'petrolStock',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Remaining Petrol Stock (L)',
            field: 'remainingPetrolStock',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Diesel Stock (L)',
            field: 'dieselStock',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Remaining Petrol Stock (L)',
            field: 'remainingDieselStock',
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
    // const fillingStationList = useSelector((state) => state.fillingStationReducer.fillingStationList);

    useEffect(() => {
        // setHandleToast(true);
        setTableData(fillingStationDetails);
    }, [fillingStationDetails]);

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
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const data = {};
    const label = {};

    useEffect(() => {
        if (fillingStation) {
            setHandleToast(true);
            const currentUser = AuthService.getCurrentUser();
            console.log(currentUser?.roles[0]);
            if (currentUser?.roles[0] === 'ROLE_FUEL_STATION') {
                dispatch(getFillingStationDetailsManagerWise(currentUser.username));
            }
        }
        // data = fillingStation.remainingDieselStock;
        // for (var i of fillingStation) {
        //     // label.push(i.)
        // }
        // data.app fillingStation;
    }, [fillingStation]);

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <br />

                {vehicleOwnerCardVisible ? (
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <EarningCard />
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TotalIncomeLightCard />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TotalOrderLineChartCard />
                        </Grid>

                        <Grid item xs={12}>
                            <ProjectTaskCard />
                        </Grid>
                    </Grid>
                ) : (
                    ''
                )}

                {/* </Grid> */}
                <br />
                <Grid container spacing={gridSpacing}>
                    {adminCardVisible ? (
                        <Grid item xs={12} lg={4} sm={6}>
                            <SideIconCard
                                iconPrimary={LocalShippingIcon}
                                primary={vehicleCount}
                                secondary="Registered"
                                secondarySub="Vehicles"
                                color={theme.palette.error.main}
                            />
                        </Grid>
                    ) : (
                        ''
                    )}

                    {adminCardVisible ? (
                        <Grid item xs={12} lg={4} sm={6}>
                            <SideIconCard
                                iconPrimary={LocalGasStationIcon}
                                primary={fillingSttaionCount}
                                secondary="Registered"
                                secondarySub="Fuel Stations"
                                color={theme.palette.secondary.main}
                            />
                        </Grid>
                    ) : (
                        ''
                    )}

                    {adminCardVisible ? (
                        <Grid item xs={12} lg={4} sm={6}>
                            <SideIconCard
                                iconPrimary={FormatListNumberedRtlIcon}
                                primary="3,619"
                                secondary="Active"
                                secondarySub="Queue"
                                color={theme.palette.warning.dark}
                            />
                        </Grid>
                    ) : (
                        ''
                    )}
                    <Grid item>
                        {adminCardVisible ? (
                            <MainCard title="Daily FuelIn Total Income (RS.)">
                                <Chart
                                    type="pie"
                                    width={400}
                                    height={400}
                                    series={studentMarks}
                                    options={{
                                        // title: {
                                        //     text: 'Weekly Total Income'
                                        // },
                                        noData: { text: 'Empty Data' },
                                        // colors:["#f90000","#f0f"],
                                        labels: stdudentSubject
                                    }}
                                ></Chart>
                            </MainCard>
                        ) : (
                            ''
                        )}
                    </Grid>

                    <Grid item>
                        {adminCardVisible ? (
                            <MainCard title="Weekly Accepted Token Daily Wise">
                                <Chart
                                    type="pie"
                                    width={400}
                                    height={400}
                                    series={acceptedQuota}
                                    options={{
                                        // title: {
                                        //     text: 'Weekly Total Income'
                                        // },
                                        noData: { text: 'Empty Data' },
                                        // colors:["#f90000","#f0f"],
                                        labels: weekDays
                                    }}
                                ></Chart>
                            </MainCard>
                        ) : (
                            ''
                        )}
                    </Grid>
                </Grid>

                <br />
                <br />
                {fillingDetailDetailsShow ? (
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} lg={4} md={12}>
                            <RegisteredVehiclesCard />
                        </Grid>

                        <Grid item xs={12} lg={4} md={12}>
                            <RegisteredDailyQueueCard />
                        </Grid>

                        <Grid item xs={12} lg={4} md={12}>
                            <RemainingDieselCard />
                        </Grid>
                    </Grid>
                ) : (
                    ''
                )}
                <br />
                {fillingDetailDetailsShow ? (
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
                                                {
                                                    icon: tableIcons.Add,
                                                    tooltip: 'Add New',
                                                    isFreeAction: true,
                                                    onClick: () => handleClickOpen('INSERT', null)
                                                },
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

                                        {open ? (
                                            <FuelStation open={open} handleClose={handleClose} fuelStationId={fuelStationId} mode={mode} />
                                        ) : (
                                            ''
                                        )}
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
                ) : null}
            </Grid>
        </Grid>
    );
};

export default Dashboard;
