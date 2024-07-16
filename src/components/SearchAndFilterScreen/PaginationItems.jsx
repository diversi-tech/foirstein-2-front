import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ItemsPage from './ItemsPage';

const PaginatedItemsPage = ({ items, itemsPerPage = 8 }) => {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);
  const selectedItems = items.slice(startIndex, endIndex);

  return (
    <Stack spacing={2} sx={{ width: '100%'}}>
      <Stack sx={{ alignItems: 'center'}}>
        {pageCount < 2 ? null : (
          <Pagination sx={{marginTop:'2%'}}
            count={pageCount}
            page={page}
            onChange={handleChange}
            renderItem={(item) => (
              <PaginationItem
                component="button"
                {...item}
                sx={{ marginX: 1 }}
              />
            )}
          />
        )}
      </Stack>
      <ItemsPage items={selectedItems} />
    </Stack>
  );
};

export default PaginatedItemsPage;
