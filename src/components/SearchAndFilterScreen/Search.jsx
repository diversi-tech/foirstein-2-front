import Box from '@mui/material/Box';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Stack, Grid, Button, TextField, Paper, Typography } from '@mui/material';
import AdvancedSearch from './AdvancedSearch';

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
    return null; // Handle error case
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
    // <Grid item xs={12}>
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       backgroundImage: 'url(../../assets/pic/books.png)',
    //       backgroundSize: 'cover',
    //       backgroundPosition: 'center',
    //       height: '300px',
    //       width: '500px',
    //     }}
    //   >
    //     <Paper elevation={3} sx={{ padding: 2, maxWidth: 600, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
    //       <Typography variant="h6" gutterBottom align="right">
    //         חיפוש
    //       </Typography>
    //       <TextField
    //         sx={{ display: 'flex' }}
    //         variant="outlined"
    //         fullWidth
    //         placeholder="הקלידו מילה..."
    //         margin="normal"
    //         value={searchValue}
    //         onChange={handleValue}
    //         onKeyDown={(e) => {
    //           if (e.key === 'Enter') {
    //             handleSearchClick();
    //           }
    //         }}
    //       >
    //         <Stack sx={{ marginLeft: '1%' }}>
    //           {searchValue && <ClearIcon onClick={handleClearClick} />}
    //         </Stack>
    //       </TextField>
    //       <Button onClick={handleSearchClick} fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
    //         חיפוש
    //       </Button>
    //       <Button onClick={handleAdvancedSearchClick} fullWidth variant="text" color="primary" sx={{ marginTop: 2 }}>
    //         חיפוש מתקדם
    //       </Button>
    //     </Paper>
    //   </Box>
    //   <Stack>
    //     {showAdvancedSearch && <AdvancedSearch />}
    //   </Stack>
    // </Grid>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url(../../../assets/pic/books.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
            width: '100%',
            padding: 4,
          }}
        >
          <Paper elevation={3} sx={{ padding: 2, maxWidth: 600, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Typography variant="h6" gutterBottom align="right">
              HUfind
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="הקלידו מילה..."
              margin="normal"
              value={searchValue}
              onChange={handleValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
            >
              <Stack sx={{ marginLeft: '1%' }}>
                {searchValue && <ClearIcon onClick={handleClearClick} />}
              </Stack>
            </TextField>
            <Button onClick={handleSearchClick} fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
              חיפוש
            </Button>
            <Button onClick={handleAdvancedSearchClick} fullWidth variant="text" color="primary" sx={{ marginTop: 2 }}>
              חיפוש מתקדם
            </Button>
          </Paper>
          <Stack>
            {showAdvancedSearch && <AdvancedSearch />}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  )
}