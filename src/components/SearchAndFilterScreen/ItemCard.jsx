import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Collapse, Divider, CardActions } from '@mui/material';
import { styled } from '@mui/system';
import ItemDetailScreenComponent from '../ItemDetailScreen/ItemDetailScreen';
import BorrowRequestFile from '../BorrowRequestScreen/borrowRequestFile';
import SavedItemComponent from './SavedItem';
import { getUserIdFromTokenid } from '../decipheringToken';
import { updateSavedItemFunction } from '../../utils/SavedItemsService';


const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
  direction: 'rtl',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  direction: 'rtl',
}));

const ItemCard = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const userId = getUserIdFromTokenid();
  
  const updateSavedItem = async (isSave) => {
    updateSavedItemFunction(isSave, userId, item, changeSavedItems, refresh)
  };


  const handleToggleDetails = () => {
    if (showDetails) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
    setShowDetails(!showDetails);
    setFullScreen(!fullScreen);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setShowDetails(false);
    setFullScreen(false);
  };

  return (
    <StyledCard>
      <CardContent>
        <StyledTypography variant="h6" component="div">
          {item.title}
        </StyledTypography>
        <StyledTypography variant="body2" gutterBottom>
          <strong>מחבר:</strong> {item.author || 'לא זמין'}
        </StyledTypography>
        <StyledTypography variant="body2">
          <strong>קטגוריה:</strong> {item.category || 'לא זמין'}
        </StyledTypography>
        <Divider sx={{ my: 2 }} />
        <CardActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleToggleDetails}
            size="small"
          >
            {showDetails ? 'פחות מידע' : 'מידע נוסף'}
          </Button>
          <SavedItemComponent refresh={refresh} updateSavedItem={updateSavedItem} isSaved={isSaved}  ></SavedItemComponent>

          <Collapse in={!showDetails} sx={{width:'3%' , margin:'1%'}}>
            <BorrowRequestFile currentItem={item} isApproved={true} />
          </Collapse>
        </CardActions>
        <Collapse in={showDetails}>
          <CardContent>
            <ItemDetailScreenComponent currentItem={item} onSelected={() => setSelectedItem(null)} viewProps={fullScreen} onClose={handleCloseDetails} />
          </CardContent>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default ItemCard;
