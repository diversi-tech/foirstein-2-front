import SearchAppBar from "./Search";
import PaginatedItemsPage from "./PaginationItems";
import ItemsList from "./ItemsList";
import TheRecommended from "./theRecommended";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

function AllSearchScreen() {
  const [items, setItems] = useState([]);
  localStorage.setItem('SearchResult',JSON.stringify(items));
  
  useEffect(() => {
    const fetchData = async () => {
      const storedResult = localStorage.getItem('SearchResult');
      if (storedResult !== null) {
        const parsedItems = JSON.parse(storedResult);
        setItems(parsedItems);
      } else {
        console.log('No value found in localStorage for key SearchResult');
      }
    };

    fetchData();
  }, [items]);

  return (
    <>
      <Stack>
        <SearchAppBar />
      </Stack>
      {items.length <= 0 ? (
      <>
        <TheRecommended />
        <PaginatedItemsPage items={items} />
        </>
      ) : (
      <PaginatedItemsPage items={items} />
      )}
      
      <ItemsList type="recent" />
      <ItemsList type="popular" />
      <ItemsList type="recommended" />
    </>
  );
}

export default AllSearchScreen;
