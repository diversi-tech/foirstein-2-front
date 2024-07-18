import { ListSubheader, Container } from '@mui/material';
import theme from '../../theme';
import ItemsPage from './ItemsPage';
import { useState } from 'react';
import axios from 'axios';

const TheRecommended = () => {
    const [items,setItems] = useState([]);
    
    // async function theRecommended() {
    //     try {
    //         const response = await axios.get(process.env.REACT_APP_SERVER_UR+'/api/Item/ReadTheRecommended');
    //         if (response.status === 200) {
    //             localStorage.setItem('SearchResult', JSON.stringify(response.data));
    //             setItems(response.data);
    //             return response.data;
    //         } else {
    //             throw new Error('error');
    //         }
    //     } catch (error) {
    //         console.error('error', error);
    //         return null; 
    //     }
    // }
    return (
        <>
            <Container sx={{ direction: 'rtl' }}>
                <ListSubheader sx={{ color: theme.palette.primary.main }}>המומלצים שלנו</ListSubheader>
            </Container>
        </>
    )
}

export default TheRecommended;