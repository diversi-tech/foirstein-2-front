import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/system';

const RatingComponent = (props) => {
  const { initialRating, updateRatingNote } = props;

  const handleRatingChange = async (event, newRatingValue) => {
    try {
      await updateRatingNote("rating", newRatingValue);
    }
    catch (error) {
      console.error('Error change rating:', error);
    }
  };

  const StyledSpan = styled('span')({
    color: '#bdbdbd',
    fontSize: '16px',
    fontWeight: 600,
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Rating
        name="simple-controlled"
        value={initialRating}
        onChange={handleRatingChange}
      />
      <StyledSpan>:כמה נהניתי</StyledSpan>
    </Box>
  );
};

export default RatingComponent;
