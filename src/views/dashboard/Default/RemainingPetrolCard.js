// material-ui
import { Card, CardContent, Grid, Typography } from '@mui/material';

// assets
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import EvStationIcon from '@mui/icons-material/EvStation';
// ===========================|| WIDGET STATISTICS - WEATHER CARD ||=========================== //

const RemainingPetrolCard = () => (
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
                        500 L{/* <sup> Petrol : 500 L </sup> */}
                    </Typography>
                    <Typography variant="subtitle2" align="center">
                        Fuel Status- Remaining Petrol
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ bgcolor: 'info.dark', p: 3 }}>
                    <Typography variant="subtitle2" align="center">
                        <EvStationIcon sx={{ color: '#fff' }} />
                    </Typography>
                    <Typography variant="subtitle2" align="center" sx={{ color: '#fff' }}>
                        FuelIn -Kaluthara
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default RemainingPetrolCard;
