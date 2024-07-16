import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const NoteComponent = (props) => {
  const { noteText, setNoteText, updateRatingNote } = props;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const saveNote = async () => {
    try {
      await updateRatingNote("note", noteText);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div style={{
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center'
      }}>
        <TextField
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              saveNote();
            }
          }}
          placeholder="הקלד הערה"
          variant="outlined"
          fullWidth
          margin="normal"
          dir="rtl"
          inputProps={{ maxLength: 255 }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={saveNote}
          sx={{ 
            marginRight: '8px',
            marginTop: '10px',
            height: '56px',
            lineHeight: 1,
           }}
        >
          שמור הערה
        </Button>
      </div>
      {showSuccessMessage && (
        <div style={{
          direction: 'rtl',
          width: '97%',
        }}>
          <span style={{
            fontFamily: [
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
            ].join(','),
            color: '#0D47A1',
          }}>ההערה נשמרה בהצלחה!</span>
        </div>
      )
        || (<div style={{ height: '22px' }}></div>)}
    </div>
  );
};

export default NoteComponent;