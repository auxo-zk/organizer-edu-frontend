import { ErrorExeTransaction, IconSpinLoading, TokenInfo } from '@auxo-dev/frontend-common';
import { CloseRounded, DoneRounded } from '@mui/icons-material';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Address, erc20Abi } from 'viem';
import { useReadContracts } from 'wagmi';

export default function TokenFunding({ tokenFunding, onChangeTokenFunding }: { tokenFunding: TokenInfo; onChangeTokenFunding: (tokenFunding: Partial<TokenInfo>) => void }) {
    const { data, isFetching, isError, failureReason } = useReadContracts({
        allowFailure: false,

        contracts: [
            {
                address: tokenFunding.address as Address,
                abi: erc20Abi,
                functionName: 'decimals',
            },
            {
                address: tokenFunding.address as Address,
                abi: erc20Abi,
                functionName: 'name',
            },
            {
                address: tokenFunding.address as Address,
                abi: erc20Abi,
                functionName: 'symbol',
            },
        ],
    });

    useEffect(() => {
        if (!isFetching) {
            if (data && !isError) {
                const [decimals, name, symbol] = data;

                onChangeTokenFunding({ name, symbol, decimals });
            } else {
                onChangeTokenFunding({ name: '', symbol: '', decimals: 0 });
            }
        }
    }, [isFetching]);
    return (
        <>
            <Typography variant="h6" mt={4} mb={1}>
                Token for recieve fund*
            </Typography>
            <TextField
                size="small"
                fullWidth
                type="text"
                name="token_fund"
                placeholder="Address of token for recieve fund..."
                value={tokenFunding.address}
                onChange={(e) => {
                    onChangeTokenFunding({ address: e.target.value as Address });
                }}
                disabled={isFetching}
                error={isError}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{isFetching ? <IconSpinLoading /> : isError ? <CloseRounded color="error" /> : <DoneRounded color="success" />}</InputAdornment>,
                }}
            />
            <Box>
                {isFetching ? (
                    <Typography variant="body1" sx={{ ml: 2, mt: 1 }}>
                        Fetching token infomation...
                    </Typography>
                ) : (
                    <>
                        {isError ? (
                            // <Typography variant="body1">Error: {failureReason?.message}</Typography>
                            <Box overflow={'auto'}>
                                <ErrorExeTransaction error={failureReason} />
                            </Box>
                        ) : (
                            <Box mt={1} ml={2}>
                                <Typography>
                                    Token Name:{' '}
                                    <Box component={'span'} fontWeight={600}>
                                        {data?.[1]}
                                    </Box>
                                </Typography>
                                <Typography>
                                    Symbol:{' '}
                                    <Box component={'span'} fontWeight={600}>
                                        {data?.[2]}
                                    </Box>
                                </Typography>
                                <Typography>
                                    Decimals:{' '}
                                    <Box component={'span'} fontWeight={600}>
                                        {data?.[0]}
                                    </Box>
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    );
}
