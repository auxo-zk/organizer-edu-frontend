import { Campaign, CardCampaign, getCampaigns, IconSpinLoading, NoData } from '@auxo-dev/frontend-common';
import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ListCampaigns() {
    const { address } = useAccount();
    const [data, setData] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    async function fetchCourses(addressUser: string) {
        try {
            const response = await getCampaigns();
            setData(response);
        } catch (error) {
            console.error(error);
            setData([]);
        }
        setLoading(false);
    }
    useEffect(() => {
        if (address) {
            fetchCourses(address);
        }
    }, [address]);

    if (loading) {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    return (
        <Box mt={3}>
            <Box textAlign={'center'}>{data.length === 0 && <NoData />}</Box>
            <Box>
                <Grid container spacing={2}>
                    {data.map((item, index) => {
                        return (
                            <Grid key={item.campaignId + index} item xs={12} xsm={6}>
                                <CardCampaign data={item} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}
