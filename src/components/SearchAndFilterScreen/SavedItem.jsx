import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import { styled } from '@mui/material/styles';

const WrapperedSaveIcon = styled(SaveIcon)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const SavedItemComponent = (props) => {
  const { isSaved, updateSavedItem } = props;

  const handleSaveItem = async () => {
    try {
      await updateSavedItem(!isSaved);
    } catch (error) {
      console.error('Error save item:', error);
    }
  };

  return (
    <div>
      <Tooltip title={isSaved ? 'להסרה מהמאגר האישי' : 'להוספה למאגר האישי'}>
        <WrapperedSaveIcon color={isSaved ? 'primary' : 'action'} onClick={handleSaveItem} />
      </Tooltip>
    </div>
  );
};

export default SavedItemComponent;
