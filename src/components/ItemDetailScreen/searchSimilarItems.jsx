
import React from 'react';
import { ListSubheader, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import axios from 'axios';
import { Tag } from '@mui/icons-material';

async function getTags(itemId) {
  try {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'/api/Tag/GetAllTagsByItemId?itemId=' + itemId);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get tags');
    }
  } catch (error) {
    console.error('Error getting tags:', error);
    return 0;
  }
}

export default function SearchSimilarItems(props) {
  const [selection, setSelection] = React.useState('');
  const [tags, setTags] = React.useState([]);

  const handleChange = (event) => {
    setSelection(event.target.value);
    console.log(event.target.value);
    props.onSelected(event.target.value);
  };

  React.useEffect(() => {
    async function initTags() {
      const initialValue = await getTags(props.itemId);
      setTags(initialValue);
    }
    initTags();
  }, []);

  return (
    <div sx={{ width: '100%' }}>
      <FormControl dir='ltr' sx={{ m: 1, minWidth: 120, margin: '0px', width: '100%' }}>
        <InputLabel id="demo-controlled-open-select-label" sx={{ color: 'rgb(128, 126, 123)' }}>חיפוש פריטים דומים</InputLabel>
        <Select
          dir='rtl'
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={selection}
          label="חיפוש פריטים דומים"
          onChange={handleChange}
          inputProps={{ 'aria-label': 'Select category or tag' }}
        >
          <ListSubheader sx={{ color: '#1e3e8b',fontWeight:'bold', fontSize:'18px', textAlign: 'left' }}>קטגוריה</ListSubheader>
          <MenuItem dir="rtl" value={props.category}>{props.category}</MenuItem>
          <ListSubheader sx={{ color: '#1e3e8b',fontWeight:'bold', fontSize:'18px', textAlign: 'left' }}>
            {Object.keys(tags).length > 0 ? 'תגיות' : 'אין תגיות קשורות'}
          </ListSubheader>
          {Object.keys(tags).length > 0 && (
            Object.keys(tags).map((tagId) => (
              <MenuItem dir="rtl" key={tagId} value={tags[tagId].id}>{tags[tagId].name}</MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
}
