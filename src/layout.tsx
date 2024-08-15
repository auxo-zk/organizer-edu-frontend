import { AppStateProvider, IconUser, Layout, walletConfig, WalletProvider } from '@auxo-dev/frontend-common';
import { Outlet } from 'react-router-dom';
import { Dashboard } from '@mui/icons-material';
import { QueryClient } from '@tanstack/react-query';
import { config } from './constants';

const queryClient = new QueryClient();

export default function AppLayout() {
    return (
        <WalletProvider wagmiConfig={config} queryClient={queryClient}>
            <AppStateProvider>
                <Layout
                    role={import.meta.env.VITE_APP_USER_ROLE}
                    requiedLogin={true}
                    menu={[
                        {
                            icon: Dashboard,
                            title: 'Your Campaigns',
                            url: '/your-campaigns',
                            children: [],
                        },
                        {
                            icon: IconUser,
                            title: 'Profile',
                            url: '/profile',
                            children: [],
                        },
                    ]}
                >
                    <Outlet />
                </Layout>
            </AppStateProvider>
        </WalletProvider>
    );
}
