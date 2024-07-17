import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import { Stack } from '@mui/material';
import AdvancedSearch from './AdvancedSearch';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.7),
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
  padding: theme.spacing(0, 1),
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, 
    transition: theme.transitions.create('width'),
    fontSize: '1.2rem', 
  },
}));

async function getSearchResult(keySearch) {
  try {
    const response = await axios.get('https://localhost:7118/api/Item/ReadByString/' + keySearch);
    if (response.status === 200) {
      localStorage.setItem('SearchResult', JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error('error');
    }
  } catch (error) {
    console.error('error', error);
    return null; 
  }
}

export default function SearchAppBar() {
  const [searchValue, setSearchValue] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = async () => {
    await getSearchResult(searchValue);
  };

  const handleClearClick = () => {
    setSearchValue('');
  };

  const handleAdvancedSearchClick = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  return (
    <Box sx={{
      flexGrow: 1, direction: 'rtl',
      padding:'5%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url(https://foirstein-1-front-aojx.onrender.com/assets/pic/books.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      // height: '300px',
      // width: '100%'
    }} >
        <Search sx={{ padding: '1%' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchClick(); // Call handleSearchClick on Enter
            }
          }}>
          <WrapperedSearchIcon onClick={handleSearchClick} />
          <StyledInputBase
            placeholder="חיפוש..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchValue}
            onChange={handleValue}
          />
          <Stack sx={{ marginLeft: '1%' }}>
            {searchValue && <ClearIcon onClick={handleClearClick} />}
          </Stack>
          <FormatAlignCenterIcon onClick={handleAdvancedSearchClick} />
        </Search>
      <Stack sx={{position:'absolute', zIndex:'1', width:'60%',marginRight:'17%'}}>
        {showAdvancedSearch && <AdvancedSearch />}
      </Stack>
    </Box>
  )
}