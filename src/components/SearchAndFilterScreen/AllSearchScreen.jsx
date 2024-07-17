import SearchAppBar from "./Search";
import PaginatedItemsPage from "./PaginationItems";
import { useEffect, useState } from "react";
// import TheRecommended from "./TheRecommended";
import TheRecommended from "./theRecommended";
import { Stack } from "@mui/material";

function AllSearchScreen() {
  const [items, setItems] = useState([]);

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
    </>
  );
}

export default AllSearchScreen;