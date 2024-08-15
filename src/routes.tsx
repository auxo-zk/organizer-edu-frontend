import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AppLayout from './layout';
import Profile from './pages/profile/Profile';
import YourCampaigns from './pages/your-campaigns/YourCampaigns';
import CreateCampaign from './pages/create-campaign/CreateCampaign';
import ProfileGuest from './pages/profile-guest/ProfileGuest';

export default function AppRouter() {
    return useRoutes([
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    path: 'your-campaigns',
                    element: <YourCampaigns />,
                },
                {
                    path: 'your-campaigns/create',
                    element: <CreateCampaign />,
                },
                {
                    path: 'profile',
                    element: <Profile />,
                },
                {
                    path: 'profile/:userAddress',
                    element: <ProfileGuest />,
                },
                {
                    path: '*',
                    element: <div>404</div>,
                },
                {
                    path: '',
                    element: <Navigate to={'/your-campaigns'} />,
                },
            ],
        },
    ]);
}
