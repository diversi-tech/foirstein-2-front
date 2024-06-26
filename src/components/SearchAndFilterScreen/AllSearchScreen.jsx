import Filter from "./Filter";
import SearchAppBar from "./Search";
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import PaginatedItemsPage from "./PaginationItems";

const FiltersContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center', // Center the filters horizontally
  borderRadius: theme.shape.borderRadius,
  marginTop: '1%',
}));

function AllSearchScreen() {
    return (
        <>
            <Container dir="rtl">
                <SearchAppBar />
                <FiltersContainer >
                    <Filter filterBy="תג" />
                    <Filter filterBy="קטגוריה" />
                </FiltersContainer>
            </Container>
            <PaginatedItemsPage items={items} />
        </>
    );
}

export default AllSearchScreen;