import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, alpha } from '@mui/material';
import theme from '../../theme';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AdvancedSearch = () => {
  // State variables to manage form inputs
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState("0001-01-01");

  const currentUser = useSelector(state => state.userReducer.userId);
  const userId = currentUser ? currentUser.userId : 1;

  let item = {}
  let searchLog = {}
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    item = {
      "id": 0,
      "title": title,
      "author": author,
      "description": description,
      "category": category,
      "filePath": "",
      "isApproved": false,
      "createdAt": createdAt,
      "updatedAt": "0001-01-01T00:00:00"
    }
    searchLog = {
      "logId": 0,
      "userId": userId,
      "searchQuery": `Title: ${title} Author: ${author} Description: ${description} Category: ${category} Created At: ${createdAt}`,
      "searchDate": new Date().toISOString()
    }
    console.log('Form submitted:', { title, author, description, category, createdAt });
    getAdvancedSearchResult()
  };

  async function getAdvancedSearchResult() {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/api/Item/ReadByAttributes', item);
      if (response.status === 200) {
        localStorage.setItem('SearchResult', JSON.stringify(response.data));
        await axios.post(process.env.REACT_APP_SERVER_URL + '/api/SearchLog/create',searchLog)
        return response.data;
      } else {
        throw new Error('error');
      }
    } catch (error) {
      console.error('error', error);
      return null; // Handle error case
    }
  }

  return (
    <Box p={3} border={1} borderColor="grey.300" borderRadius={2} boxShadow={2} sx={{ backgroundColor: 'white' }} >
      <Typography variant="h6" gutterBottom>
        חיפוש מתקדם
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="title"
              label="כותרת"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="author"
              label="מחבר"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              label="תיאור"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="category"
              label="קטגוריה"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="createdAt"
              label="נוצר בתאריך"
              variant="filled"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              חיפוש
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AdvancedSearch;
