import * as React from 'react';
import { Divider, List, ListItemText, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ItemDetailsDisplay(props) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filePathContent, setFilePathContent] = React.useState('');

  // פונקציה לפתיחת הדיאלוג
  const handleOpenDialog = (content) => {
    setFilePathContent(content);
    setDialogOpen(true);
  };

  // פונקציה לסגירת הדיאלוג
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

   // פונקציה להמרת תאריך בפורמט ISO לתאריך קריא
   const formatDateFromISO = (dateString) => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return 'תאריך לא תקין'; // במקרה שהתאריך אינו תקין
    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // הכנת הפריטים הנוכחיים
  let currentItem = { ...props.currentItem }; // יצר עותק של currentItem כדי לא לשנות את המקור
  if (currentItem.createdAt) {
    currentItem.createdAt = formatDateFromISO(currentItem.createdAt);
  }
  if (currentItem.updatedAt) {
    currentItem.updatedAt = formatDateFromISO(currentItem.updatedAt);
  }

  // הגדרת תכנים להופעה ברשימה
  const itemProperties = {
    id: 'מספר פריט',
    title: 'כותרת',
    author: 'מחבר',
    description: 'תיאור',
    category: 'קטגוריה',
    filePath: 'מיקום',
    isApproved: 'זמין להשאלה',
    createdAt: 'תאריך יצירה',
    updatedAt: 'עדכון אחרון',
    publishingYear:'שנת הוצאה לאור',
    edition:'מהדורה',
    series:'סדרה',
    numOfSeries:'מספר בסדרה',
    language:'שפה',
    note:'הערה',
    accompanyingMaterial:'חומר נלווה',
    itemLevel:'מתאים לרמה',
    hebrewPublicationYear:'שנת הוצאה עברית',
    numberOfDaysOfQuestion:'מספר ימי השאלה',
    recommended:'מומלץ',
    userId:'מזהה משתמש',
    amount:'כמות',
    itemType:'סוג פריט',
    // price: 'מחיר'
  };

  // הגדרת סגנון לרשימה
  const style = {
    p: 0,
    width: '100%',
    maxWidth: '70%',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    float: 'right',
    marginTop: '3vh'
  };
  const alternateBackgroundColor = 0;
  // index % 2 === 0 ? 'rgb(189, 189, 189)' : 'transparent';
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <List id="itemPropertiesList" sx={style} aria-label="mailbox folders">
        {Object.entries(currentItem).map(([key, value], index) => {
          const labelId = `checkbox-list-label-${index}`;
          const propertyLabel = itemProperties[key];
         if (key === 'title' || key === 'recommended' || key === 'userId' || key === 'amount' || value === undefined) return null; // לא להציג את מה שלא רוצים להציג
        //  const backgroundColor = alternateBackgroundColor % 2 === 0 ? 'rgb(189, 189, 189)' : 'transparent';
        //  alternateBackgroundColor++;
          return (
            <React.Fragment key={key}>
              <ListItem className='ListItemDetails' disablePadding sx={{ marginTop: '12px', backgroundColor }}>
                <ListItemText
                  id={labelId}
                  sx={{ textAlign: 'right', height: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', direction: key === 'filePath' ? 'rtl' : 'ltr' }}
                >
                  <div style={{ cursor: key === 'filePath' ? 'pointer' : 'default' }} onClick={() => key === 'filePath' ? handleOpenDialog(value) : undefined}>
                    {key === 'filePath' ? (
                       <div
                       style={{ 
                         cursor: key === 'filePath' ? 'pointer' : 'default', 
                         display: 'flex',
                         alignItems: 'center'
                       }}
                       onClick={() => key === 'filePath' ? handleOpenDialog(value) : undefined}
                     >
                       <span style={{ margin: '10px' }}>{propertyLabel}: </span>
                       <span 
                         style={{ 
                           margin: '10px',
                           display: 'inline-block',
                           maxWidth: '200px',
                           whiteSpace: 'nowrap',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis'
                         }}
                       >
                         {value}
                       </span>
                     </div>
                    ) : (
                      <>
                        <span style={{ margin: '10px' }}>{propertyLabel}: </span>
                        <span style={{ margin: '10px' }}>{key === 'isApproved' ? (value ? 'כן' : 'לא') : value}</span>
                      </>
                    )}
                  </div>
                </ListItemText>
              </ListItem>
              {/* {key !== 'itemType' && <Divider component="li" />} */}
            </React.Fragment>
          );
        })}
      </List>

      {/* דיאלוג להצגת מיקום הקובץ המלא */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="filePath-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle dir='rtl' id="filePath-dialog-title">מיקום הקובץ</DialogTitle>
        <DialogContent>
          <pre>{filePathContent}</pre>
        </DialogContent>
        <DialogActions dir='rtl'>
          <Button onClick={handleCloseDialog}>סגור</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
