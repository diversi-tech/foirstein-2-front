import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Collapse, Divider, CardActions } from '@mui/material';
import { styled } from '@mui/system';
import ItemDetailScreenComponent from '../ItemDetailScreen/ItemDetailScreen';
import SavedItemComponent from './SavedItem';
import { getUserIdFromTokenid } from '../decipheringToken';
import { updateSavedItemFunction } from '../../utils/SavedItemsService';

// עיצוב כרטיס הפריט
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
  direction: 'rtl', // הוספת כיוון ימין לשמאל
}));

// עיצוב כותרת התוכן
const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  direction: 'rtl', // הוספת כיוון ימין לשמאל
}));

const ItemCard = ({ item, refresh, isSaved, changeSavedItems }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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
        </CardActions>
        <Collapse in={showDetails}>
          <CardContent>
            <ItemDetailScreenComponent currentItem={item} onSelected={() => setSelectedItem(null)} />
          </CardContent>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default ItemCard;
