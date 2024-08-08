import PaginatedItemsPage from "../SearchAndFilterScreen/PaginationItems";
import { useEffect, useState } from "react";
import axios from 'axios';
import Typography from '@mui/material/Typography';
import SortingComponent from './sort';
import Rtl from '../ItemDetailScreen/Rtl';
import { useTheme } from '@mui/material/styles';
import { getUserIdFromTokenid } from '../decipheringToken';
import { fetchData } from '../../utils/SavedItemsService';

function SavedItemsScreen() {
    const userId = getUserIdFromTokenid();
    const [items, setItems] = useState(null);
    const theme = useTheme();
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const fetch = async () => {
            await fetchData(userId, setItems);
        };
        fetch();
    }, []);


    const refresh = async (itemId) => {
        await fetchData(userId, setItems);
        await handleSortChange(sortBy, itemId);
    };

    const handleSortChange = async (sortType, itemId) => {
        if (sortType === '') {
            return [];
        }
        setSortBy(sortType);
        let sortedItems = [...items];
        if (itemId) {
            sortedItems = sortedItems.filter(item => item.id !== itemId);
        }
        if (sortType === "name") {
            sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === "category") {
            sortedItems.sort((a, b) => a.category.localeCompare(b.category));
        } else if (sortType === "date") {
            sortedItems.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        setItems(sortedItems);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: theme.palette.primary.main, color: 'white', padding: '20px' }}>
                <Rtl>
                    <SortingComponent handleSortChange={handleSortChange} />
                </Rtl>
                <Typography variant="h4" align="right">המאגר האישי שלי</Typography>
            </div>
            {items !== null && <PaginatedItemsPage key={items} items={items} refresh={refresh} />}
        </div>
    );
}

export default SavedItemsScreen;
