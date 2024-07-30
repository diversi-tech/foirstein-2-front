import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import Item from './Item';
import axios from 'axios';
import { getUserIdFromTokenid } from '../decipheringToken';

const ItemsPage = ({ items, refresh }) => {
  const userId = getUserIdFromTokenid();
  const apiUrl = process.env.REACT_APP_SERVER_URL;
  const [savedItems, setSavedItems] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/Item/ReadSavedItems/${userId}`);
      console.log(response.data);
      setSavedItems(response.data);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      setSavedItems([]);
    }
  };

  useEffect(() => {
    if (!refresh) {
      fetchData();
    }
  }, []);

  const isSavedItem = (item) => {
    return savedItems.some(savedItem => savedItem.id === item.id);
  };

  const changeSavedItems = () => {
    fetchData();
  };

  return (
    <List>
      {items.map((item) => (
        <Item key={item.id} item={item} refresh={refresh} isSaved={refresh||(isSavedItem(item))}  changeSavedItems={changeSavedItems} />
      ))}
    </List>
  );
};

export default ItemsPage;