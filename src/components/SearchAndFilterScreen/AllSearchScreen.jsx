import SearchAppBar from "./Search";
import PaginatedItemsPage from "./PaginationItems";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

function AllSearchScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedResult = localStorage.getItem('SearchResult');
    if (storedResult != null) {
      const parsedItems = JSON.parse(storedResult);
      setItems(parsedItems);
    } else {
      console.log('No value found in localStorage for key SearchResult');
    };
  }, [items]); 

  return (
    <>
      <Stack>
        <SearchAppBar />
      </Stack>
      <PaginatedItemsPage items={items} />
    </>
  );
}

export default AllSearchScreen;