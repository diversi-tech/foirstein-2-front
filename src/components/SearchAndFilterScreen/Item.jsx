import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Collapse } from '@mui/material';
import ItemDetailScreenComponent from '../ItemDetailScreen/ItemDetailScreen'
import axios from 'axios';
import BorrowRequestFile from '../BorrowRequestScreen/borrowRequestFile';

const Item = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const formatDateFromISO = (dateString) => {
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return 'תאריך לא תקין'; // במקרה שהתאריך אינו תקין
        const year = dateObj.getFullYear();
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    async function onSelected(search) {
        try {
            const response = await axios.get('https://localhost:7118/api/Item/ReadByCategory/' + search);
            if (response.status === 200) {
                localStorage.setItem('SearchResult', JSON.stringify(response.data));
                return response.data;
            } else {
                throw new Error('error');
            }
        } catch (error) {
            console.error('error', error);
            return null; // Handle error case
        }
    }

    return (
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', marginTop: 1, direction: 'rtl' }}>
            <Box
                sx={{
                    width: '70%',
                    margin: '0 auto',
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h5">
                        {item.title}
                    </Typography>
                    <Typography variant="body2">
                        יוצר: {item.author}
                    </Typography>
                    <Typography variant="body2">
                        קטגוריה: {item.category}
                    </Typography>
                    <Typography variant="body2">
                        תאריך עדכון: {formatDateFromISO(item.createdAt)}
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={handleExpandClick}
                        sx={{ marginLeft: 1 }}
                    >
                        {expanded ? 'פחות מידע' : 'מידע נוסף'}
                    </Button>
                    <Box width="120PX">
                        <BorrowRequestFile currentItem={item} />
                    </Box>
                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ marginTop: 2 }}>
                        {expanded && <ItemDetailScreenComponent currentItem={item} onSelected={onSelected} />}
                    </Box>
                </Collapse>
            </Box>
        </Grid>
    );
};

export default Item;