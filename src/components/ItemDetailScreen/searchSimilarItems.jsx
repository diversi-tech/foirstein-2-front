
import React from 'react';
import {ListSubheader, InputLabel, Select, MenuItem, FormControl} from '@mui/material';

export default function SearchSimilarItems(props) {
  const [selection, setSelection] = React.useState('');

  const handleChange = (event) => {
    setSelection(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-controlled-open-select-label" sx={{ color:'rgb(128, 126, 123)' }}>חיפוש פריטים דומים</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={selection}
          label="חיפוש פריטים דומים"
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select category or tag' }}
          sx={{ width:'180px'}}
        >
          <ListSubheader sx={{ color: 'black', fontStyle: 'italic' }}>קטגוריה</ListSubheader>
          <MenuItem value="category">{props.category}</MenuItem>
          <ListSubheader sx={{ color: 'black', fontStyle: 'italic' }}>תגיות</ListSubheader>
          {
            Object.keys(props.tags).map((key) => (
              <MenuItem key={key} value={key}>{props.tags[key]}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </div>
  );
}