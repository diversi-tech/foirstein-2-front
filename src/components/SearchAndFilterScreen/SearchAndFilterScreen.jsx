import Filter from "./Filter";
import SearchAppBar from "./Search";
import { styled } from '@mui/material/styles';

const FiltersContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
}));


function AllSearchScreen() {
    return (
        <>

            <SearchAppBar />
            <FiltersContainer >
                <Filter filterBy="Tag" />
                <Filter filterBy="Category" />
            </FiltersContainer>
        </>
    );
}

export default AllSearchScreen;