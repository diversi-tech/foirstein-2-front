import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import Item from './Item';
import { getUserIdFromTokenid } from '../decipheringToken';
import { fetchData, isSavedItem } from '../../utils/SavedItemsService';

const ItemsPage = ({ items, refresh }) => {
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

  return (
    <List>
      {items.map((item) => (
        <Item key={item.id} item={item} refresh={refresh} isSaved={isSavedItem(refresh, item, savedItems)} changeSavedItems={changeSavedItems} />
      ))}
    </List>
  );
};

export default ItemsPage;