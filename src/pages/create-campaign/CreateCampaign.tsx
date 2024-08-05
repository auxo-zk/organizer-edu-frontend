import { Avatar, ButtonLoading, CampaignQuestion, CustomEditor, imagePath, InputBanner } from '@auxo-dev/frontend-common';
import { ChevronLeftRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, MenuItem, Switch, TextField, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import TimeLine from './TimeLine/TimeLine';
import ApplicationForm from './ApplicationForm/ApplicationForm';

export type InputCreateBanner = {
    bannerImage: string;
    avatarImage: string;
    avatarFile: File | null;
    bannerFile: File | null;
    name: string;
    description: string;
    applicationTimeStart: string;
    investmentTimeStart: string;
    allocationTimeStart: string;
    privateFunding: boolean;
    committeeId: string;
    keyId: string;
    capacity: number;
    fundingOption: number;
    applicationForm: ({
        id: string;
    } & CampaignQuestion)[];
};
export default function CreateCampaign() {
    const [inputCreateBanner, setInputCreateBanner] = React.useState<InputCreateBanner>({
        bannerImage: '',
        bannerFile: null,
        avatarImage: '',
        avatarFile: null,
        name: '',
        description: '',
        allocationTimeStart: '',
        applicationTimeStart: '',
        investmentTimeStart: '',
        privateFunding: false,
        committeeId: '',
        keyId: '',
        capacity: 0,
        fundingOption: 0,
        applicationForm: [
            {
                id: uuid(),
                hint: '',
                question: '',
                isRequired: true,
            },
        ],
    });

    function changeDataInput(data: Partial<InputCreateBanner>) {
        setInputCreateBanner((prev) => ({ ...prev, ...data }));
    }

    function onChangeBanner(file: File, image: string) {
        changeDataInput({ bannerImage: image, bannerFile: file });
    }
    function onChangeAvatar(file: File, image: string) {
        changeDataInput({ avatarImage: image, avatarFile: file });
    }

    async function handleCreateCampaign() {}

    return (
        <Container sx={{ pb: 5 }}>
            <Box sx={{ position: 'relative', mb: 9 }}>
                <InputBanner
                    src={inputCreateBanner.bannerImage || imagePath.DEFAULT_BANNER}
                    alt="banner project"
                    onChange={(files) => {
                        const file = files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                onChangeBanner(file, reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
                <Box sx={{ position: 'absolute', left: '20px', bottom: '-50px', borderRadius: '50%', border: '4px solid #FFFFFF' }}>
                    <Avatar
                        src={inputCreateBanner.avatarImage || imagePath.DEFAULT_AVATAR}
                        size={100}
                        onChange={(files) => {
                            const file = files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    onChangeAvatar(file, reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </Box>
            </Box>

            <Breadcrumbs sx={{ mt: 2 }}>
                <Link color="inherit" to="/your-campaigns" style={{ textDecoration: 'none', color: 'unset' }}>
                    <Box sx={{ display: 'flex', placeItems: 'center' }}>
                        <ChevronLeftRounded color="primary" sx={{ fontSize: '24px' }} />
                        <Typography color={'primary.main'}>Your Campaigns</Typography>
                    </Box>
                </Link>
                <Typography color={'primary.main'} fontWeight={600}>
                    {`Campaign's information editor`}
                </Typography>
            </Breadcrumbs>

            <Typography variant="h1">Campaign's information editor</Typography>
            <TextField
                size="small"
                label="Campaign's name"
                type="text"
                name="Campaign_name"
                sx={{ mt: 5, mb: 3 }}
                value={inputCreateBanner.name}
                onChange={(e) => {
                    changeDataInput({
                        name: e.target.value,
                    });
                }}
            />
            <Typography variant="h6" mt={2} mb={2}>
                Description*
            </Typography>
            <TextField
                fullWidth
                size="small"
                type="text"
                name="campaign_description"
                value={inputCreateBanner.description}
                onChange={(e) => {
                    changeDataInput({ description: e.target.value });
                }}
            />

            <Box sx={{ mt: 6 }}>
                <TimeLine
                    allocationTimeStart={inputCreateBanner.allocationTimeStart}
                    applicationTimeStart={inputCreateBanner.applicationTimeStart}
                    investmentTimeStart={inputCreateBanner.investmentTimeStart}
                    setCampaignData={changeDataInput}
                />
            </Box>

            <Typography variant="h6" mt={6}>
                Privacy Option
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '', xsm: '', md: '2fr minmax(200px, 3fr) minmax(200px, 3fr)' }, columnGap: 3, rowGap: 2 }} mt={1}>
                <Box display={'flex'} sx={{ placeItems: 'center', minWidth: 'max-content' }}>
                    <Typography variant="body1">Private funding</Typography>
                    <Switch
                        sx={{ ml: 2 }}
                        checked={inputCreateBanner.privateFunding}
                        onChange={(e, checked) => {
                            changeDataInput({ privateFunding: checked });
                        }}
                    />
                </Box>
                {/* <Box sx={{ minWidth: '200px' }}>
                    <Autocomplete
                        fullWidth
                        options={commitees.map((i) => ({ label: i.name, value: i.idCommittee }))}
                        renderInput={(params) => <TextField {...params} label="Select DKG committee" />}
                        onChange={(e, value) => {
                            setCampaignData({ committeeId: value?.value || '' });
                        }}
                    />
                </Box>
                <Box sx={{ minWidth: '200px' }}>
                    <Autocomplete
                        fullWidth
                        disabled={!Boolean(committeeId)}
                        options={keys.map((i) => ({ label: formatAddress(i.key, 6, 6), value: i.keyId }))}
                        renderInput={(params) => <TextField {...params} label="Select encryption key" />}
                        onChange={(e, value) => {
                            setCampaignData({ keyId: String(value?.value) });
                        }}
                    />
                </Box> */}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
                <Typography variant="h6" width="260px">
                    Capicity (Projects)
                </Typography>
                <Typography variant="h6" width="184px">
                    Funding option
                </Typography>
            </Box>
            <Box mt={2}>
                <TextField
                    size="small"
                    label="Capacity*"
                    sx={{ width: '140px' }}
                    onChange={(e) => {
                        changeDataInput({ capacity: Number(e.target.value) });
                    }}
                    type="number"
                />
                <TextField
                    size="small"
                    value={inputCreateBanner.fundingOption}
                    select
                    sx={{ ml: 15, width: '300px' }}
                    onChange={(e) => {
                        changeDataInput({ fundingOption: Number(e.target.value) });
                    }}
                >
                    <MenuItem value={0}>Private grant</MenuItem>
                    <MenuItem value={1}>Public funding</MenuItem>
                </TextField>
            </Box>

            <ApplicationForm applicationForm={inputCreateBanner.applicationForm} setInputCreateBanner={setInputCreateBanner} />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonSubmit handleCreateCampaign={handleCreateCampaign} />
            </Box>
        </Container>
    );
}

function ButtonSubmit({ handleCreateCampaign }: { handleCreateCampaign: () => Promise<void> }) {
    const [loading, setLoading] = React.useState(false);
    return (
        <ButtonLoading
            isLoading={loading}
            muiProps={{
                variant: 'contained',
                onClick: async () => {
                    setLoading(true);
                    await handleCreateCampaign();
                    setLoading(false);
                },
            }}
        >
            Submit
        </ButtonLoading>
    );
}
