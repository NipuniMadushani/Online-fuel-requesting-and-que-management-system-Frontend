// assets
import { IconKey } from '@tabler/icons';
import AuthService from 'services/auth.service';

// constant
const icons = {
    IconKey
};
const currentUser = AuthService.getCurrentUser();

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Authentication',
            type: 'collapse',
            icon: icons.IconKey,

            children: [
                {
                    id: 'login3',
                    title: 'Login',
                    type: 'item',

                    url: '/pages/login',
                    target: true
                },
                {
                    id: 'register3',
                    title: 'Register',
                    type: 'item',
                    url: '/pages/register',
                    target: true
                },
                {
                    id: 'profile',
                    title: 'Profile',
                    type: 'item',
                    url: '/pages/profile',
                    target: true
                }
            ]
        }
    ]
};

export default pages;
