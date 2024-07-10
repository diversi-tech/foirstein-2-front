import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import axios from 'axios';


const AdvancedSearch = () => {
  // State variables to manage form inputs
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState("0001-01-01");

  let item = {}

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
    console.log('Form submitted:', { title, author, description, category, createdAt });
    getAdvancedSearchResult()
  };


async function getAdvancedSearchResult() {
  try {
    const response = await axios.post('https://localhost:7118/api/Item/ReadByAttributes',item );
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

  return (
    <Box p={3} border={1} borderColor="grey.300" borderRadius={2} boxShadow={2}>
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
