import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Collapse } from '@mui/material';
import ItemDetailScreenComponent from '../ItemDetailScreen/ItemDetailScreen'
import axios from 'axios';
import BorrowRequestFile from '../BorrowRequestScreen/borrowRequestFile';
import { dark } from '@mui/material/styles/createPalette';
import SavedItemComponent from './SavedItem';
import { getUserIdFromTokenid } from '../decipheringToken';

const Item = ({ item , refresh,isSaved,changeSavedItems}) => {
    const [expanded, setExpanded] = useState(false);
    const userId = getUserIdFromTokenid();
    const apiUrl = process.env.REACT_APP_SERVER_URL;

    const updateSavedItem = async (isSave) => {
        const thisRatingNote = {
          ratingNoteId: 0,
          userId,
          itemId:item.id,
          rating: null,
          note: null,
          savedItem: isSave,
        }
        console.log(thisRatingNote);
        const response = await axios.put(`${apiUrl}/api/RatingNote/PutRatingNote/0`, thisRatingNote, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 200) {
         changeSavedItems();
          console.log('save item updated successfully');
          if (refresh&&!isSave) {
            refresh(item.id);
          }
        } else {
          throw new Error('Failed to update rating & note');
        }
      };

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
            let response = null;
            if (isNaN(search)) {
                response = await axios.get('http://localhost:5135/api/Item/ReadByCategory/' + search);
            } else {
                console.log(search);
                response = await axios.get('http://localhost:5135/api/Item/ReadByTag/' + search);
            }
            if (response.status === 200) {
                localStorage.setItem('SearchResult', JSON.stringify(response.data));
                return response.data;
            } else {
                throw new Error('Error retrieving data');
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
                    <Typography variant="h5" width={"10%"}>
                        {item.title}
                    </Typography>
                    <Typography variant="body2" width={"10%"}>
                        יוצר: {item.author}
                    </Typography>
                    <Typography variant="body2" width={"10%"}>
                        קטגוריה: {item.category}
                    </Typography>
                    <Typography variant="body2" width={"15%"}>
                        תאריך עדכון: {formatDateFromISO(item.createdAt)}
                    </Typography>
                    <SavedItemComponent refresh={refresh} updateSavedItem={updateSavedItem} isSaved={isSaved}  ></SavedItemComponent>
                    <Button
                        width={"10%"}
                        size="small"
                        variant="outlined"
                        onClick={handleExpandClick}
                        sx={{ marginLeft: 1 }}
                    >
                        {expanded ? 'פחות מידע' : 'מידע נוסף'}
                    </Button>
                    {item.isApproved ? (
                        <Box width="10%" sx={{ cursor: 'pointer' }}>
                            <BorrowRequestFile currentItem={item} isApproved={item.isApproved} />
                        </Box>
                    ) : (
                        <Box width="10%" sx={{ cursor: 'not-allowed', pointerEvents: 'none' }}>
                            <BorrowRequestFile currentItem={item} isApproved={dark} />
                        </Box>
                    )}
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