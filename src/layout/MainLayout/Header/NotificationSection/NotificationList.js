// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';

import AuthService from 'services/auth.service';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import NewSchedule from 'views/pages/newSchedule/NewSchedule';
import { useState } from 'react';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const [fuelRequstId, setFuelRequstId] = useState('');
    const [openNewSchedule, setOpenNewSchedule] = useState(false);
    const [mode, setMode] = useState('VIEW');
    const [vehicleObject, setVehicleObject] = useState();
    const [newRequestVisible, setNewRequestVisible] = useState(false);

    const handleClose = () => {
        setOpenNewSchedule(false);
    };

    const showNewRequest = () => {
        // setFuelRequstId('');
        // setOpenNewSchedule(true);
        navigate('/new-schedule', { replace: true });
    };

    useEffect(() => {
        if (currentUser?.roles[0] === 'ROLE_CUSTOMER') {
            setNewRequestVisible(true);
        } else {
            setNewRequestVisible(false);
        }
    }, []);

    const requstList = [];

    useEffect(() => {
        AuthService.fetchNewRequstByUserId(currentUser.id).then((res) => {
            let newRequest = res.data;
            requstList.push(newRequest?.payload[0]);
            console.log(requstList);
        });
    }, []);

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

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        height: 28
    };

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            <Divider />
            <ListItemWrapper>
                <ListItem alignItems="center">
                    {newRequestVisible ? (
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    color: theme.palette.success.dark,
                                    backgroundColor: theme.palette.success.light,
                                    border: 'none',
                                    borderColor: theme.palette.success.main
                                }}
                            >
                                <IconBuildingStore onClick={showNewRequest} stroke={1.5} size="1.3rem" />
                            </Avatar>
                        </ListItemAvatar>
                    ) : (
                        ''
                    )}
                    <ListItemText primary={<Typography variant="subtitle1"> New Schedule</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    2 min ago
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">Your Request Has been rejected.You have received New Schedule</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Chip label="Unread" sx={chipErrorSX} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>
            {openNewSchedule ? (
                <NewSchedule
                    open={openNewSchedule}
                    handleClose={handleClose}
                    fuelRequestId={fuelRequstId}
                    mode={mode}
                    vehicleObj={vehicleObject}
                />
            ) : (
                ''
            )}
        </List>
    );
};

export default NotificationList;
