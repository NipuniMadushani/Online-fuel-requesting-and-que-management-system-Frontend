import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router';
import AuthService from 'services/auth.service';
import { useEffect } from 'react';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [vehicleOwnerCardVisible, setVehicleOwnerCardVisible] = useState(false);
    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    const generateToken = () => {
        // setAnchorEl(null);
        navigate('/generate-token', { replace: true });
    };
    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        console.log(currentUser?.roles[0]);
        if (currentUser?.roles[0] === 'ROLE_CUSTOMER') {
            setVehicleOwnerCardVisible(true);
        } else {
            setVehicleOwnerCardVisible(false);
        }
    }, []);

    return (
        <>
            {isLoading ? (
                ''
            ) : (
                // <SkeletonTotalOrderCard />
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        {vehicleOwnerCardVisible ? (
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container justifyContent="space-between">
                                        <Grid item sx={{ mb: 1.25 }}>
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500,
                                                    color: theme.palette.secondary[200]
                                                }}
                                            >
                                                Token Generate
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Avatar
                                                // click={generateToken}
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.primary[800],
                                                    color: '#fff',
                                                    mt: 1
                                                }}
                                            >
                                                <QrCodeIcon onClick={generateToken} fontSize="inherit" />
                                            </Avatar>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item>
                                    <Grid container>
                                        <Grid item>
                                            <Typography sx={{ mr: 1, mt: 1.75, mb: 0.75 }}>
                                                In order to obtain fuel, simply produce the QR code at the fuel station where the staff at
                                                the station will scan the QR code and validate the eligibility and allocation of fuel
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : (
                            ''
                        )}
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalOrderLineChartCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
