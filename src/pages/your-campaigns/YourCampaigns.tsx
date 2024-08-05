import { BoxIntroducePage } from '@auxo-dev/frontend-common';
import { AddRounded } from '@mui/icons-material';
import { Box, Button, Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListCampaigns from './ListCampaigns/ListCampaigns';

export default function YourCampaigns() {
    const navigate = useNavigate();
    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage thumnail="/images/auxo-thumbnail3.png" title="Your Campaigns"></BoxIntroducePage>
            <Box textAlign={'right'}>
                <Button variant="contained" startIcon={<AddRounded />} onClick={() => navigate('/your-campaigns/create')}>
                    Create new campaign
                </Button>
            </Box>
            <ListCampaigns />
        </Container>
    );
}
