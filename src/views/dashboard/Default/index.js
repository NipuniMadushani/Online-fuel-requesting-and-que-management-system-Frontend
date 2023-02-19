import { useEffect, useState } from 'react';

// material-ui
import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
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
import { Chart } from 'react-google-charts';

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
        console.log(fillingStationDetails);
        setHandleToast(true);
        // if (fillingStationDetails?.length > 0) {
        setTableData(fillingStationDetails);
        // }
    }, [fillingStationDetails]);
    // useEffect(() => {
    //     if (fillingStationList?.length > 0) {
    //         setTableData(fillingStationList);
    //     }
    // }, [fillingStationList]);

    useEffect(() => {
        setLoading(false);
        const currentUser = AuthService.getCurrentUser();
        console.log(currentUser?.roles[0]);
        if (currentUser?.roles[0] === 'ROLE_FUEL_STATION') {
            dispatch(getFillingStationDetailsManagerWise(currentUser.username));
            // dispatch(getAllFillingStationData());
            setFillingDetailDetailsShow(true);
        } else {
            setFillingDetailDetailsShow(false);
        }
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

    // useEffect(() => {
    //     if (fillingStation) {
    //         // console.log(currentUser.id);
    //         // setManagerEmail(fillingStation.managerEmail);
    //         setHandleToast(true);
    //         dispatch(getFillingStationDetailsManagerWise(currentUser.username));
    //         // dispatch(getAllFillingStationData());
    //     }
    // }, [fillingStation]);

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    // const data = [
    //     ['Task', 'Hours per Day'],
    //     ['Work', 11],
    //     ['Eat', 2],
    //     ['Commute', 2],
    //     ['Watch TV', 2],
    //     ['Sleep', 7]
    // ];

    const options = {
        title: 'My Daily Activities',
        is3D: true
    };
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalIncomeLightCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid>
                </Grid>

                <Grid container spacing={gridSpacing}>
                    <Chart chartType="PieChart" data={data} options={options} width={'100%'} height={'400px'} />
                </Grid>

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
                ) : (
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={8}>
                                <TotalGrowthBarChart isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <PopularCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
            </Grid>
        </Grid>
    );
};

export default Dashboard;
