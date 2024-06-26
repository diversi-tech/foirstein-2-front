import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Filter(props) {
    return (
        <>
            <Autocomplete
                options={top}
                sx={{ width: '15%',
                    marginLeft: '2%',
                 }} // Adjust width as needed
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label={props.filterBy}
                        placeholder={props.filterBy} 
                        size="small" // Set the size to small
                        InputLabelProps={{
                            shrink: true, 
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                height: '5%', // Adjust height as needed
                                minHeight: 'unset',
                            },
                        }}
                    />
                )}
            />
        </>
    );
}

const top = [
    // Add your options here
];
