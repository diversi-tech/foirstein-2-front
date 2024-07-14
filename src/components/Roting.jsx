import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BorrowRequestFile from './BorrowRequestScreen/borrowRequestFile';
import ItemDetailsDisplay from './ItemDetailScreen/itemDetailsDisplay';
import Item from './SearchAndFilterScreen/Item';
import StatusListView from './Request Status/StatusListView';

const Routing = () => {
  return (
    <Routes>
      <Route path="/BorrowRequestFile" element={<BorrowRequestFile />} />
      <Route path="/ItemDetailsDisplay" element={<ItemDetailsDisplay />} />
      <Route path="/getStatusIcon" element={<StatusListView />} />
      <Route path="/Item" element={<Item />} />
    </Routes>
  );
};

export default Routing;
