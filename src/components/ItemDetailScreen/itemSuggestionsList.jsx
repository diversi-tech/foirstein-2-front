import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import ItemCard from '../SearchAndFilterScreen/ItemCard';
import axios from 'axios';
import { getUserIdFromTokenid } from '../decipheringToken';
import { fetchData, isSavedItem } from '../../utils/SavedItemsService';

const ItemSuggestionsList = ({ refresh , currentItem }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const userId = getUserIdFromTokenid();
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const fetch = async() => {
      await fetchData(userId, setSavedItems);
    };
    fetch();
  }, []);

  const changeSavedItems = () => {
    fetchData(userId, setSavedItems);
  };

  useEffect(() => {
      axios.post(process.env.REACT_APP_SERVER_URL + '/api/Item/itemSuggestions', currentItem)
        .then(response => {
          setVisibleItems(response.data.slice(0, 4));
        })
        .catch(error => {
          console.error('Error fetching suggestions items:', error);
        });
  }, []);

  return (
    <div style={{ width: '66.66%', margin: 'auto' }}>
      <h2 style={{textAlign:'right'}}>:פריטים דומים</h2>
      <Grid container spacing={2}>
        {visibleItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={item.id}>
            <ItemCard item={item} refresh={refresh} isSaved={isSavedItem(refresh, item, savedItems)} changeSavedItems={changeSavedItems} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ItemSuggestionsList;
