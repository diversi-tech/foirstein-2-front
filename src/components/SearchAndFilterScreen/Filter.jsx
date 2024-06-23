import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Filter(props) {
    return (
        <>
            <Autocomplete
                id="combo-box-demo"
                options={top}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} label={props.filterBy} />}
            />
        </>
    );
}

const top = [

]