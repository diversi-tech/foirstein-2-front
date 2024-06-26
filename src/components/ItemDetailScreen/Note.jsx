import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const NoteComponent = () => {
  const [noteText, setNoteText] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const fetchInitialNote = async () => {
    try {
      const response = await axios.get('<URL>');
      return response.data;
    } catch (error) {
      console.error('Error fetching prev note:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchInitialNote().then(data => {
      setNoteText(data || '');
    });
  }, []);

  useEffect(() => {
    let timer;
    if (successOpen) {
      timer = setTimeout(() => {
        setSuccessOpen(false);
      }, 30000);
    }
    return () => clearTimeout(timer);
  }, [successOpen]);

  const saveNote = () => {
    axios.post('<URL>', noteText, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Note saved:', response.data);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      })
      .catch(error => {
        console.error('Error saving note:', error);
      });
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
          variant="contained"
          color="primary"
          onClick={saveNote}
          sx={{
            marginRight: '8px',
            marginTop: '7px',
            height: '55px',
            lineHeight: 1,
            color: '#0D47A1',
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: 'inherit',
            }
          }}
        >
          שמור הערה
        </Button>
      </div>
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          marginTop: '-7px',
          direction: 'ltr',
          marginLeft: '30vw',
          zIndex: 9999,
        }}>
          <span style={{
            fontFamily: [
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
            ].join(','),
            color: '#0D47A1',
          }}>!ההערה נשמרה בהצלחה</span>
        </div>
      )}
    </div>
  );
};

export default NoteComponent;