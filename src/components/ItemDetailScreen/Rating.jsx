import * as React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/system';

async function getPrevRating() {
  try {
    const response = await axios.get('<URL>');
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get rating');
    }
  } catch (error) {
    console.error('Error getting rating:', error);
    return 0;
  }
}

async function updateRating(newValue) {
  try {
    const response = await axios.post('<URL>', newValue??0, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      console.log('Rating updated successfully');
    } else {
      throw new Error('Failed to update rating');
    }
  } catch (error) {
    console.error('Error updating rating:', error);
  }
}

export default function RatingComponent() {
  const [ratingValue, setRatingValue] = React.useState(0);

  React.useEffect(() => {
    async function initRating() {
      const initialValue = await getPrevRating();
      setRatingValue(initialValue);
    }
    initRating();
  }, []);

  const handleRatingChange = (event, newRatingValue) => {
    setRatingValue(newRatingValue);
    updateRating(newRatingValue);
  };


const StyledSpan = styled('span')({
  color: '#bdbdbd',
  fontSize: '16px',
  fontWeight: 600,
});

  return (
    <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Rating
        name="simple-controlled"
        value={ratingValue}
        onChange={handleRatingChange}
      />
      <StyledSpan>:הדירוג שלי</StyledSpan>
    </Box>
  );
}
