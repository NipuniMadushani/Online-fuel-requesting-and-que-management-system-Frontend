import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase, Menu, MenuItem } from '@mui/material';
// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import { useState } from 'react';
import { useEffect } from 'react';

import AuthService from 'services/auth.service';
import { useNavigate } from 'react-router';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const [vehicleOwnerVisible, setVehicleOwnerVisible] = useState(false);
    const [fuelInAdminVisible, setFuelInAdminVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const manageVehicleDetails = () => {
        setAnchorEl(null);
        navigate('/manage-vehicle', { replace: true });
        // setShowPassword(!showPassword);
    };

    const manageFuelStationDetails = () => {
        setAnchorEl(null);
        navigate('/fuel-station', { replace: true });
        // setShowPassword(!showPassword);
    };

    const manageFuelRequest = () => {
        setAnchorEl(null);
        navigate('/fuel-request', { replace: true });
        // setShowPassword(!showPassword);
    };

    const makePayement = () => {
        setAnchorEl(null);
        navigate('/payment', { replace: true });
        // setShowPassword(!showPassword);
    };
    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        console.log(currentUser?.roles[0]);
        if (currentUser?.roles[0] === 'ROLE_CUSTOMER') {
            setVehicleOwnerVisible(true);
        } else {
            setVehicleOwnerVisible(false);
        }

        if (currentUser?.roles[0] === 'ROLE_ADMIN') {
            setFuelInAdminVisible(true);
        } else {
            setFuelInAdminVisible(false);
        }
    }, []);

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            <SearchSection />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            <Box>
                {/* <MegaMenuSection /> */}
                <Box>
                    {vehicleOwnerVisible && (
                        <Box>
                            <Button
                                id="demo-positioned-button"
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                Vehicle Owner
                            </Button>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                            >
                                <MenuItem onClick={manageVehicleDetails}> Manage Vehicle Details </MenuItem>
                                <MenuItem onClick={manageFuelRequest}> Fuel Request </MenuItem>
                                <MenuItem onClick={manageFuelRequest}> QR Code Generate </MenuItem>
                                <MenuItem onClick={makePayement}> Make Payment </MenuItem>

                                {/* <MenuItem onClick={handleClose}>View Income Report</MenuItem>
                         <MenuItem onClick={handleClose}>Manage User </MenuItem> */}
                            </Menu>
                        </Box>
                    )}
                </Box>

                <Box>
                    {fuelInAdminVisible && (
                        <Box>
                            <Button
                                id="demo-positioned-button"
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                FuelIn Admin
                            </Button>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                            >
                                <MenuItem onClick={manageFuelStationDetails}> Add Fuel Station </MenuItem>
                                <MenuItem onClick={manageFuelRequest}> Fuel Request </MenuItem>
                                <MenuItem onClick={makePayement}> Make Payment </MenuItem>

                                {/* <MenuItem onClick={handleClose}>View Income Report</MenuItem>
                         <MenuItem onClick={handleClose}>Manage User </MenuItem> */}
                            </Menu>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* <Box>
                {vehicleOwnerVisible && (
                    <Box>
                        <Button
                            id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            Vehicle Owner
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                        >
                            <MenuItem onClick={handleClickShowVehicleRegistrationForm}>Register Vehicle & Manage </MenuItem>
                            {/* <MenuItem onClick={handleClose}>View Income Report</MenuItem>
                         <MenuItem onClick={handleClose}>Manage User </MenuItem> */}

            {/* notification & profile */}
            <NotificationSection />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
