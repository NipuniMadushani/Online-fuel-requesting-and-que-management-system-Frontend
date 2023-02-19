import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { useEffect } from 'react';
import AuthService from 'services/auth.service';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const TotalIncomeLightCard = ({ isLoading }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [vehicleOwnerCardVisible, setVehicleOwnerCardVisible] = useState(false);

    const manageFuelRequstDetails = () => {
        setAnchorEl(null);
        navigate('/fuel-request', { replace: true });
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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        {vehicleOwnerCardVisible ? (
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container justifyContent="space-between">
                                        <Grid item sx={{ mb: 0.75 }}>
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500,
                                                    color: theme.palette.secondary[200]
                                                }}
                                            >
                                                Fuel Request
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.warning[800],
                                                    mt: 1
                                                }}
                                            >
                                                <LocalGasStationIcon fontSize="inherit" onClick={manageFuelRequstDetails} />
                                                {/* <DirectionsCarIcon /> */}
                                                {/* <img src={EarningIcon} alt="Notification" /> */}
                                            </Avatar>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container>
                                        <Grid item>
                                            <Typography sx={{ mr: 1, mt: 1.75, mb: 0.75 }}>
                                                Each Vehicle Once registered for the Fuel Pass, will be allocated a weekly quota of fuel,
                                                which will be refreshed every Sunday night and provide fuel within the available balance.
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

TotalIncomeLightCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalIncomeLightCard;
