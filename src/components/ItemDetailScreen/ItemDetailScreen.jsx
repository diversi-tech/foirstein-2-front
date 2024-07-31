import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import NoteComponent from './Note';
import RatingComponent from './Rating';
import SearchSimilarItems from './searchSimilarItems';
import ItemDetailsDisplay from './itemDetailsDisplay';
import axios from 'axios';
import Rtl from './Rtl'
import { CircularProgress } from '@mui/material';
//import { getUserIdFromTokenid } from '../decipheringToken';

const ItemDetailScreenComponent = (props) => {
  const { currentItem } = props;
  const itemId = currentItem.id;
  //const userId = getUserIdFromTokenid();
  const userId = 1;
  const [initialRating, setInitialRating] = useState(null);
  const [noteText, setNoteText] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/RatingNote/GetRatingNote/${userId}/${itemId}`);
        setInitialRating(response.data.rating);
        setNoteText(response.data.note);
        setLoading(false);
      } catch (error) {
        setInitialRating(0);
        setNoteText('');
        setLoading(false);
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);


  const updateRatingNote = async (type, value) => {
    const thisRatingNote = {
      ratingNoteId: 0,
      userId,
      itemId,
      rating: initialRating ?? 0,
      note: noteText ?? '',
      savedItem: null,
    }
    if (type === 'rating') {
      setInitialRating(value ?? 0);
      thisRatingNote.rating = value;
    } else if (type === 'note') {
      setNoteText(value);
      thisRatingNote.note = value;
    }
    const response = await axios.put(`${apiUrl}/api/RatingNote/PutRatingNote/0`, thisRatingNote, {
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
        <div style={{ maxWidth: '318px', height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {loading ? (
            <div style={{ maxWidth: '318px' }}>
              <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
                <CircularProgress />
              </Box></div>
          ) : (
            <>
              <Box width="100%" marginBottom={2} >
                {initialRating !== null && <RatingComponent initialRating={initialRating} setInitialRating={setInitialRating} updateRatingNote={updateRatingNote} />}
              </Box>
              {noteText !== null && <Box width="100%" marginBottom={2}>
                <NoteComponent noteText={noteText} setNoteText={setNoteText} updateRatingNote={updateRatingNote} />
              </Box>}
              <Box width="100%" marginBottom={2}>
                <Rtl>
                  <SearchSimilarItems itemId={itemId} category={currentItem.category} onSelected={props.onSelected} />
                </Rtl>
              </Box>
            </>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default ItemDetailScreenComponent;