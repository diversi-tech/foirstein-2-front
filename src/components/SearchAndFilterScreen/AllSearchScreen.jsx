import SearchAppBar from "./Search";
import Container from '@mui/material/Container';
import PaginatedItemsPage from "./PaginationItems";
import { useEffect, useState } from "react";

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
      <Container>
        <SearchAppBar />
      </Container>
      <PaginatedItemsPage items={items} />
    </>
  );
}

export default AllSearchScreen;