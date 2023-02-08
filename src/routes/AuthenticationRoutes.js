import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import UserProfile from 'views/profile/profile';
import AuthService from 'services/auth.service';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //
const currentUser = AuthService.getCurrentUser();
const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/pages/login',
            element: <AuthLogin3 />
        },
        {
            path: '/pages/register',
            element: <AuthRegister3 />
        },
        {
            path: '/pages/profile',
            element: <UserProfile />
        }
    ]
};

export default AuthenticationRoutes;
