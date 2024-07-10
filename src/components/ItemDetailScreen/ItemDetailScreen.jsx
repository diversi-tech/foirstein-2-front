import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import NoteComponent from './Note';
import RatingComponent from './Rating';
import SearchSimilarItems from './searchSimilarItems';
import ItemDetailsDisplay from './itemDetailsDisplay';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Rtl from './Rtl'
// import BorrowRequestFile from './BorrowRequestScreen/borrowRequestFile';

const ItemDetailScreenComponent = (props) => {

  const { currentItem } = props;

  const itemId = currentItem.id;

  const userId = useSelector(state => state.userReducer.currentUser).userId;
  const [initialRating, setInitialRating] = useState(null);
  const [noteText, setNoteText] = useState(null);

  useEffect(() => {
    const ratingNoteInitialization = async () => {
      try {
        const response = await axios.get(`https://localhost:7118/api/RatingNote/GetRatingNote/${userId}/${itemId}`);
        setInitialRating(response.data.rating);
        setNoteText(response.data.note);
      } catch (error) {
        setInitialRating(0);
        setNoteText('');
        console.error('Error fetching initial data:', error);
      }
    };

    ratingNoteInitialization();
  }, []);


  const updateRatingNote = async (type, value) => {
    const thisRatingNote = {
      ratingNoteId: 0,
      userId,
      itemId,
      rating: initialRating ?? 0,
      note: noteText ?? ''
    }
    if (type === 'rating') {
      setInitialRating(value ?? 0);
      thisRatingNote.rating = value;
    } else if (type === 'note') {
      setNoteText(value);
      thisRatingNote.note = value;
    }
    const response = await axios.put(`https://localhost:7118/api/RatingNote/PutRatingNote/0`, thisRatingNote, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      console.log('Rating & note updated successfully');
    } else {
      throw new Error('Failed to update rating & note');
    }
  };


  return (
    <div dir='ltr'>
      <Grid container justifyContent="center" sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center' }}>
        <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
          <ItemDetailsDisplay currentItem={currentItem} />
        </Grid>
        <div style={{ maxWidth: '500px', height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {initialRating !== null && <Box width="100%" marginBottom={2}>
            <RatingComponent initialRating={initialRating} setInitialRating={setInitialRating} updateRatingNote={updateRatingNote} />
          </Box>}
          {noteText !== null && <Box width="100%" marginBottom={2}>
            <NoteComponent noteText={noteText} setNoteText={setNoteText} updateRatingNote={updateRatingNote} />
          </Box>}
          <Box width="100%" marginBottom={2}>
            <Rtl>
              <SearchSimilarItems itemId={itemId} category={currentItem.category} onSelected={props.onSelected} />
            </Rtl>
          </Box>
          <Box width="100%">
            {/* <BorrowRequestFile currentItem={currentItem} /> */}
            <div></div>
          </Box>
        </div>
      </Grid>
    </div>
  );
};
export default ItemDetailScreenComponent