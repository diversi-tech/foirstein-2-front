
import * as React from 'react';
import { Divider, List, ListItemText, ListItem } from '@mui/material';

export default function ItemDetailsDisplay(props) {

  const itemPproperties = {
    itemId: 'מספר פריט',
    title: 'כותרת',
    author: 'מחבר',
    description: 'תיאור',
    category: 'קטגוריה',
    filePath: 'מיקום',
    isApproved: 'זמין להשאלה',
    createdAt: 'תאריך יצירה',
    updatedAt: 'עדכון אחרון',
    price: 'מחיר'
  };

  const style = {
    p: 0,
    width: '100%',
    maxWidth: '80%',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    float: 'right',
    marginTop: '3vh'
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <List id="itemPropertiesList" sx={style} aria-label="mailbox folders">
        {Object.entries(props.currentItem).map(([key, value], index) => {
          const labelId = `checkbox-list-label-${index}`;
          const propertyLabel = itemPproperties[key];
          if (key === 'title') return null;
          return (
            <>
              <ListItem className='ListItemDetails' key={key} sx={{ marginTop: '12px' }} disablePadding>
                <ListItemText id={labelId} sx={{ textAlign: 'right', height: '40px' }}>
                  {key === 'isApproved' ? (
                    <>
                      <span style={{ margin: '10px' }}>{propertyLabel}:</span>
                      <span style={{ margin: '10px' }}>{value ? 'כן' : 'לא'}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ margin: '10px' }}>{value}</span>
                      <span style={{ margin: '10px' }}>:{propertyLabel}</span>
                    </>
                  )}
                </ListItemText>
              </ListItem>
              {key !== 'price' && (
                <Divider component="li" />
              )}

            </>
          );
        })}
      </List>
    </div>
  );
}
