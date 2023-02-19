import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router';
import AuthService from 'services/auth.service';
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
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
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [vehicleOwnerCardVisible, setVehicleOwnerCardVisible] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const manageVehicleDetails = () => {
        setAnchorEl(null);
        navigate('/manage-vehicle', { replace: true });
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
                // <SkeletonEarningCard />

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
                                                Vehicle Details
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
                                                <DirectionsCarIcon fontSize="inherit" onClick={manageVehicleDetails} />
                                                {/* <img src={EarningIcon} alt="Notification" /> */}
                                            </Avatar>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={{ mr: 1, mt: 1.75, mb: 0.75 }}>
                                                Add One Or More Vehicles to your vehicle list and get the weekly fuel quota.The weekly fuel
                                                quota provided to all types of vehicles registered under the QR system has been revised
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

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
