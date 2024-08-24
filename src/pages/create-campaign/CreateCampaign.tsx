import {
    abiCampaign,
    Avatar,
    ButtonLoading,
    CampaignQuestion,
    contractAddress,
    ErrorExeTransaction,
    imagePath,
    InputBanner,
    ipfsHashCreateCampaign,
    saveFile,
    TokenInfo,
    useSwitchToSelectedChain,
} from '@auxo-dev/frontend-common';
import { ChevronLeftRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, MenuItem, Switch, TextField, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import TimeLine from './TimeLine/TimeLine';
import ApplicationForm from './ApplicationForm/ApplicationForm';
import { useAccount, useWriteContract } from 'wagmi';
import { toast } from 'react-toastify';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from 'src/constants';
import TokenFunding from './TokenFunding/TokenFunding';

export type InputCreateCampaign = {
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
    tokenFunding: TokenInfo;
    applicationForm: ({
        id: string;
    } & CampaignQuestion)[];
};
export default function CreateCampaign() {
    const { address } = useAccount();
    const { switchToChainSelected, chainIdSelected } = useSwitchToSelectedChain();
    const { writeContractAsync } = useWriteContract();
    const [inputCreateCampaign, setInputCreateCampaign] = React.useState<InputCreateCampaign>({
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
        tokenFunding: {
            address: '0x00',
            decimals: 0,
            name: '',
            symbol: '',
        },
    });

    function changeDataInput(data: Partial<InputCreateCampaign>) {
        setInputCreateCampaign((prev) => ({ ...prev, ...data }));
    }

    function onChangeTokenFunding(tokenFunding: Partial<TokenInfo>) {
        setInputCreateCampaign((prev) => ({ ...prev, tokenFunding: { ...prev.tokenFunding, ...tokenFunding } }));
    }

    function onChangeBanner(file: File, image: string) {
        changeDataInput({ bannerImage: image, bannerFile: file });
    }
    function onChangeAvatar(file: File, image: string) {
        changeDataInput({ avatarImage: image, avatarFile: file });
    }

    async function handleCreateCampaign() {
        const idtoast = toast.loading('Creating transaction...', { position: 'top-center', type: 'info' });
        try {
            if (!address) {
                throw Error('Connect wallet required!');
            }
            if (!inputCreateCampaign.name) throw Error('Campaign name required!');
            if (!inputCreateCampaign.description) throw Error('Campaign description required!');
            if (!inputCreateCampaign.applicationTimeStart) throw Error('Application time start required!');
            if (!inputCreateCampaign.allocationTimeStart) throw Error('Allocation time start required!');
            if (!inputCreateCampaign.investmentTimeStart) throw Error('Investment time start required!');
            if (isNaN(inputCreateCampaign.capacity) || !Number.isInteger(inputCreateCampaign.capacity) || inputCreateCampaign.capacity <= 0) {
                throw Error('Capacity must be a positive integer number!');
            }

            if (!inputCreateCampaign.tokenFunding.address) throw Error('Token address is required');
            if (inputCreateCampaign.tokenFunding.decimals == 0) throw Error('Token address is invalid');

            let avatarUrl = '';
            if (inputCreateCampaign.avatarFile) {
                avatarUrl = (await saveFile(inputCreateCampaign.avatarFile)).URL;
            }
            if (!avatarUrl) {
                throw Error('Avatar required!');
            }

            let bannerUrl = '';
            if (inputCreateCampaign.bannerFile) {
                bannerUrl = (await saveFile(inputCreateCampaign.bannerFile)).URL;
            }
            if (!bannerUrl) {
                throw Error('Banner required!');
            }

            const _timeline = {
                startParticipation: new Date(inputCreateCampaign.applicationTimeStart).getTime() / 1000, //1
                startFunding: new Date(inputCreateCampaign.investmentTimeStart).getTime() / 1000, //2
                startRequesting: new Date(inputCreateCampaign.allocationTimeStart).getTime() / 1000, //3
            };
            const ipfs = await ipfsHashCreateCampaign({
                avatarImage: avatarUrl,
                coverImage: bannerUrl,
                name: inputCreateCampaign.name,
                capacity: inputCreateCampaign.capacity,
                description: inputCreateCampaign.description,
                fundingOption: inputCreateCampaign.fundingOption,
                privacyOption: {
                    isPrivate: inputCreateCampaign.privateFunding,
                    committeeId: 0,
                    keyId: 0,
                } as any,
                questions: inputCreateCampaign.applicationForm.map((item) => ({ question: item.question, hint: item.hint, isRequired: item.isRequired })),
                timeline: _timeline,
                tokenFunding: inputCreateCampaign.tokenFunding,
            });
            console.log(ipfs);

            await switchToChainSelected();
            const exeAction = await writeContractAsync({
                abi: abiCampaign,
                functionName: 'launchCampaign',
                args: [BigInt(_timeline.startFunding), BigInt(_timeline.startRequesting - _timeline.startFunding), inputCreateCampaign.tokenFunding.address, ipfs.HashHex],
                address: contractAddress[chainIdSelected].Campaign,
            });
            console.log({ exeAction });

            const waitTx = await waitForTransactionReceipt(config.getClient(), { hash: exeAction });
            console.log({ waitTx });

            toast.update(idtoast, { render: 'Transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
        } catch (error) {
            if (idtoast) {
                toast.update(idtoast, { render: <ErrorExeTransaction error={error} />, type: 'error', position: 'top-center', isLoading: false, autoClose: 4000, hideProgressBar: false });
            }
        }
    }

    return (
        <Container sx={{ pb: 5 }}>
            <Box sx={{ position: 'relative', mb: 9 }}>
                <InputBanner
                    src={inputCreateCampaign.bannerImage || imagePath.DEFAULT_BANNER}
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
                        src={inputCreateCampaign.avatarImage || imagePath.DEFAULT_AVATAR}
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
                value={inputCreateCampaign.name}
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
                value={inputCreateCampaign.description}
                onChange={(e) => {
                    changeDataInput({ description: e.target.value });
                }}
            />

            <TokenFunding tokenFunding={inputCreateCampaign.tokenFunding} onChangeTokenFunding={onChangeTokenFunding} />

            <Box sx={{ mt: 5 }}>
                <TimeLine
                    allocationTimeStart={inputCreateCampaign.allocationTimeStart}
                    applicationTimeStart={inputCreateCampaign.applicationTimeStart}
                    investmentTimeStart={inputCreateCampaign.investmentTimeStart}
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
                        checked={inputCreateCampaign.privateFunding}
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
                    value={inputCreateCampaign.fundingOption}
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

            <ApplicationForm applicationForm={inputCreateCampaign.applicationForm} setInputCreateCampaign={setInputCreateCampaign} />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonSubmit handleCreateCampaign={handleCreateCampaign} />
            </Box>
            {/* <button onClick={() => console.log(inputCreateCampaign)}>log</button> */}
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
