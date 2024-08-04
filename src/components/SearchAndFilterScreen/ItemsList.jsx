import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import ItemCard from './ItemCard';
import axios from 'axios';

const initialItems = [
  { id: 1, title: 'Item 1', author: 'Author 1', category: 'Category 1', description: 'Description 1', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 2, title: 'Item 2', author: 'Author 2', category: 'Category 2', description: 'Description 2', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: false },
  { id: 3, title: 'Item 3', author: 'Author 3', category: 'Category 3', description: 'Description 3', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: false, recommended: true },
  { id: 4, title: 'Item 4', author: 'Author 4', category: 'Category 4', description: 'Description 4', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 5, title: 'Item 5', author: 'Author 5', category: 'Category 5', description: 'Description 5', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: false, recommended: false },
  { id: 6, title: 'Item 6', author: 'Author 6', category: 'Category 6', description: 'Description 6', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 7, title: 'Item 7', author: 'Author 7', category: 'Category 7', description: 'Description 7', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 8, title: 'Item 8', author: 'Author 8', category: 'Category 8', description: 'Description 8', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: false },
  { id: 9, title: 'Item 9', author: 'Author 9', category: 'Category 9', description: 'Description 9', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 10, title: 'Item 10', author: 'Author 10', category: 'Category 10', description: 'Description 10', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: false, recommended: true },
  { id: 11, title: 'Item 11', author: 'Author 11', category: 'Category 11', description: 'Description 11', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 12, title: 'Item 12', author: 'Author 12', category: 'Category 12', description: 'Description 12', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: false },
  { id: 13, title: 'Item 13', author: 'Author 13', category: 'Category 13', description: 'Description 13', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: false, recommended: true },
  { id: 14, title: 'Item 14', author: 'Author 14', category: 'Category 14', description: 'Description 14', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 15, title: 'Item 15', author: 'Author 15', category: 'Category 15', description: 'Description 15', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: false, recommended: true },
  { id: 16, title: 'Item 16', author: 'Author 16', category: 'Category 16', description: 'Description 16', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 17, title: 'Item 17', author: 'Author 17', category: 'Category 17', description: 'Description 17', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: false },
  { id: 18, title: 'Item 18', author: 'Author 18', category: 'Category 18', description: 'Description 18', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 19, title: 'Item 19', author: 'Author 19', category: 'Category 19', description: 'Description 19', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: true },
  { id: 20, title: 'Item 20', author: 'Author 20', category: 'Category 20', description: 'Description 20', createdAt: '2023-01-01', updatedAt: '2023-01-02', isApproved: true, recommended: false },
];

const ItemsList = ({ type }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let filteredItems = initialItems;
    if (type === 'recent') {
      filteredItems = initialItems.filter(item => item.isApproved);
      setVisibleItems(filteredItems.slice(0, 4));
    } else if (type === 'popular') {
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/Item/MostRequested')
        .then(response => {
          setVisibleItems(response.data.slice(0, 4));
        })
        .catch(error => {
          console.error('Error fetching recommended items:', error);
        });
    } else if (type === 'recommended') {
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/Item/ReadTheRecommended')
        .then(response => {
          setVisibleItems(response.data.slice(0, 4));
        })
        .catch(error => {
          console.error('Error fetching recommended items:', error);
        });
    }
  }, [type]);

  const handleShowMore = () => {
    setShowAll(!showAll);
    if (type === 'recent') {
      setVisibleItems(showAll ? initialItems.filter(item => item.isApproved).slice(0, 4) : initialItems.filter(item => item.isApproved));
    } else if (type === 'popular'){
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/Item/MostRequested')
      .then(response => {
        setVisibleItems(showAll ? response.data.slice(0, 4) : response.data);
      })
      .catch(error => {
        console.error('Error fetching recommended items:', error);
      });
    }
    else if (type === 'recommended') {
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/Item/ReadTheRecommended')
        .then(response => {
          setVisibleItems(showAll ? response.data.slice(0, 4) : response.data);
        })
        .catch(error => {
          console.error('Error fetching recommended items:', error);
        });
    }
  };

  return (
    <div style={{ width: '66.66%', margin: 'auto' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          marginBottom: '16px' 
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Button 
            variant="contained" 
            onClick={handleShowMore}
            style={{ marginLeft: '16px' }}
          >
            {showAll ? 'הסתר פריטים נוספים' : 'הצג פריטים נוספים'}
          </Button>
          <Typography variant="h4" component="h2" align="right">
            {type === 'recent' ? 'פריטים אקטואליים' : type === 'popular' ? 'פריטים נצפים ביותר' : 'פריטים מומלצים'}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '4px',
            backgroundColor: '#F9A825', // צבע חרדל
            marginTop: '8px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        />
      </Box>
      <Grid container spacing={2}>
        {visibleItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={item.id}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ItemsList;
