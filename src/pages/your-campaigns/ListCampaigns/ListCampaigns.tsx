import { Campaign, CardCampaign, getCampaigns, NoData } from '@auxo-dev/frontend-common';
import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ListCampaigns() {
    const { address } = useAccount();
    const [data, setData] = useState<Campaign[]>([]);
    async function fetchCourses(addressUser: string) {
        try {
            const response = await getCampaigns();
            setData(response);
        } catch (error) {
            console.error(error);
            setData([]);
        }
    }
    useEffect(() => {
        if (address) {
            fetchCourses(address);
        }
    }, [address]);
    return (
        <Box>
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
