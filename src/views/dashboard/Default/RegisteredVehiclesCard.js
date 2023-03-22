// material-ui
import { Card, CardContent, Grid, Typography } from '@mui/material';

// assets
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
// ===========================|| WIDGET STATISTICS - WEATHER CARD ||=========================== //

const RegisteredVehiclesCard = () => (
    <Card>
        <CardContent
            sx={{
                padding: '0px !important',
                '& svg': {
                    width: 40,
                    height: 40
                }
            }}
        >
            <Grid container alignItems="center" spacing={0}>
                <Grid item xs={6} sx={{ p: 3 }}>
                    <Typography variant="h2" align="center">
                        1
                    </Typography>
                    <Typography variant="subtitle2" align="center">
                        Registered Vehicles
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ bgcolor: 'success.dark', p: 3 }}>
                    <Typography variant="subtitle2" align="center">
                        <DirectionsBusFilledIcon sx={{ color: '#fff' }} />
                    </Typography>
                    <Typography variant="subtitle2" align="center" sx={{ color: '#fff' }}>
                        Fuelin -Kaluthara
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default RegisteredVehiclesCard;
