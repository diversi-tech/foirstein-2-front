import React from 'react';
import { List } from '@mui/material';
import Item from './Item';

const ItemsPage = ({ items }) => {
  return (
    <List>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </List>
  );
};

export default ItemsPage;