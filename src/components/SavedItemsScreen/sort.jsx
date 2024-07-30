import React from 'react';
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const StyledSelect = styled(Select)({
    '& .MuiSelect-select': {
        color: 'white',
    },
    '& .MuiSelect-icon': {
        color: 'white',
    },
    '& fieldset': {
        borderColor: '#FFFFFF',
    },
    '&:hover fieldset': {
        borderColor: '#FFFFFF !important',
    },
    '&.Mui-focused fieldset': {
        borderColor: '#FFD700 !important',
    },
    '& .MuiInputLabel-root': {
        color: '#FFFFFF', 
    },
},
);

export default function SortingComponent({ handleSortChange }) {
    return (
        <div>
            <FormControl sx={{ m: 1, width: 200 }}>
                <InputLabel id="demo-simple-select-helper-label"
                    sx={{
                        "&.Mui-focused": {
                            color: "#FFD700"
                        },
                    }}
                >
                    מיון לפי
                </InputLabel>
                <StyledSelect
                    label="מיון לפי"
                    onChange={(e) => handleSortChange(e.target.value)}
                    style={{ direction: 'rtl' }}
                    variant='outlined'
                >
                    <MenuItem value="name" style={{ direction: 'rtl' }}>מיון לפי שם הפריט</MenuItem>
                    <MenuItem value="category" style={{ direction: 'rtl' }}>מיון לפי קטגוריה</MenuItem>
                    <MenuItem value="date" style={{ direction: 'rtl' }}>מיון לפי תאריך עידכון</MenuItem>
                </StyledSelect>
            </FormControl>
        </div>
    );
}