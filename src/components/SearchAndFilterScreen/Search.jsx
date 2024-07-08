import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { useState, useEffect } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '1%',
  width: '40%',
  display: 'flex',
  alignItems: 'center',
}));

const WrapperedSearchIcon = styled(SearchIcon)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // Add padding to the left for the icon
    transition: theme.transitions.create('width'),
    fontSize: '1.2rem', // Adjust font size as needed
  },
}));

async function getSearchResult(keySearch) {
  try {
    const response = await axios.get('https://localhost:7118/api/Item/' + keySearch);
    if (response.status === 200) {
      localStorage.setItem('SearchResult', JSON.stringify(response.data));
      // console.log("the response of search" + JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error('error');
    }
  } catch (error) {
    console.error('problem', error);
    return 0;
  }
}

export default function SearchAppBar() {

  const [searchValue, setSearchValue] = useState('');

  const handleValue = (e) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    // getSearchResult();
  }, [searchValue]);

  return (
    <Box sx={{ flexGrow: 1, direction: 'rtl'}} >
        <AppBar position="static">
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
          </Typography>
          <Search sx={{ padding: '1%' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                getSearchResult(searchValue)
            }}>
            <StyledInputBase
              placeholder="חיפוש..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onChange={handleValue}
            />
            <WrapperedSearchIcon />
          </Search>
        </AppBar>
    </Box>
  );
}
