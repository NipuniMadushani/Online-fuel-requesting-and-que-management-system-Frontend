import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ViewVahicleDetails from 'views/pages/vehicleManagement/ViewVahicleDetails';
import ViewGenerateToken from 'views/pages/generateQRCode/ViewGenerateToken';
import ViewFuelRequst from 'views/pages/fuelRequest/ViewFuelRequest';
import ViewGoogleMap from 'views/pages/googleMap/ViewGoogleMap';
import ViewPayment from 'views/pages/payment/ViewPayment';
import ViewFuelStationRegistrtion from 'views/pages/fuelStation/ViewFuelStationRegistration';
import { element } from 'prop-types';
import ViewNewSchedule from 'views/pages/newSchedule/ViewNewSchedule';
import ViewFuelRequestFS from 'views/pages/fillingStationFuelRequest/ViewFuelRequestFS';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            // element: <SamplePage />
            element: <ViewGoogleMap />
        },
        {
            path: 'manage-vehicle',
            element: <ViewVahicleDetails />
        },
        {
            path: 'generate-token',
            element: <ViewGenerateToken />
        },
        {
            path: 'fuel-request',
            element: <ViewFuelRequst />
        },
        {
            path: 'google-map',
            element: <ViewGoogleMap />
        },
        {
            path: 'payment',
            element: <ViewPayment />
        },
        {
            path: 'fuel-station',
            element: <ViewFuelStationRegistrtion />
        },
        {
            path: 'new-schedule',
            element: <ViewNewSchedule />
        },
        {
            path: 'fuel-request-filling-station',
            element: <ViewFuelRequestFS />
        }
    ]
};

export default MainRoutes;
