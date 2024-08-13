import { BoxProfile, IconSpinLoading } from '@auxo-dev/frontend-common';
import { Box, Container, Typography } from '@mui/material';
import { useFetchUserProfile, useUserProfile } from 'src/state/userProfile/state';

export default function Profile() {
    const [value] = useUserProfile();
    const fetchProfile = useFetchUserProfile();
    if (value.state === 'loading') {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    if (value.state === 'hasError') {
        return <Typography>Error: {JSON.stringify(value.error) || ''}</Typography>;
    }
    return (
        <Container sx={{ py: 5 }}>
            <BoxProfile
                titlePage="Organizer Profile"
                role={import.meta.env.VITE_APP_USER_ROLE as any}
                initData={value.data}
                getProfile={() => {
                    fetchProfile();
                }}
                editable
            />
        </Container>
    );
}
