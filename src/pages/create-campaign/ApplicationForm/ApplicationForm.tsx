import React from 'react';
import { InputCreateBanner } from '../CreateCampaign';
import { Box, Button, IconButton, Paper, Switch, TextField, Typography } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { CustomEditor } from '@auxo-dev/frontend-common';
import { v4 as uuid } from 'uuid';

type Props = Pick<InputCreateBanner, 'applicationForm'> & {
    setInputCreateBanner: React.Dispatch<React.SetStateAction<InputCreateBanner>>;
};

export default function ApplicationForm({ applicationForm, setInputCreateBanner }: Props) {
    function handleAddItem() {
        setInputCreateBanner((prev) => ({ ...prev, applicationForm: [...prev.applicationForm, { id: uuid(), question: '', hint: '', isRequired: true }] }));
    }
    function deleteApplicationFormItem(index: number) {
        setInputCreateBanner((prev) => ({ ...prev, applicationForm: prev.applicationForm.filter((_, i) => i !== index) }));
    }
    function handleItemChange(index: number, data: Partial<InputCreateBanner['applicationForm'][number]>) {
        setInputCreateBanner((prev) => ({
            ...prev,
            applicationForm: prev.applicationForm.map((item, i) => (i === index ? { ...item, ...data } : item)),
        }));
    }
    return (
        <>
            <Typography variant="h6" mt={6} mb={3}>
                Application Form
            </Typography>
            <Paper sx={{ p: 3, backgroundColor: '#FFF8F6', my: 2 }}>
                {applicationForm.map((item, index) => {
                    return (
                        <Box key={item.id + index} sx={{ mb: 6 }}>
                            <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center' }}>
                                <Typography variant="h6">Question {index + 1}</Typography>
                                <IconButton onClick={() => deleteApplicationFormItem(index)}>
                                    <DeleteOutlineOutlined sx={{ color: 'primary.light' }} />
                                </IconButton>
                            </Box>
                            <CustomEditor value={item.question} onChange={(v) => handleItemChange(index, { question: v })} />
                            <TextField label="Hint (optional)" value={item.hint} onChange={(e) => handleItemChange(index, { hint: e.target.value })} fullWidth sx={{ mt: 2, background: 'white' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 1 }}>
                                <Typography>Required</Typography>
                                <Switch checked={item.isRequired} onChange={(e) => handleItemChange(index, { isRequired: e.target.checked })} />
                            </Box>
                        </Box>
                    );
                })}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={handleAddItem}>
                    Add Question
                </Button>
            </Box>
        </>
    );
}
