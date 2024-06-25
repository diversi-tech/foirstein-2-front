import * as React from 'react';
import {Divider, List, ListItemText, ListItem} from '@mui/material';

export default function ItemDetailsDisplay(props) {
    const { item, itemPproperties } = props;

    const style = {
        p: 0,
        width: '100%',
        maxWidth: 360,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        float: 'right',
        margin: '50px'
      };

    return (
        <>
          <h1>{item.title}</h1>
          <List id="itemPropertiesList" sx={style} aria-label="mailbox folders">
            {Object.entries(item).map(([key, value], index) => {
              const labelId = `checkbox-list-label-${index}`;
              const propertyLabel = itemPproperties[key];
              return (
                <>
                    <ListItem className='ListItemDetails' key={key} disablePadding>
                    {key !== 'title' && (
                        <ListItemText id={labelId} sx={{ textAlign: 'right' }}>
                            <span sx={{margin: '10px'}}>{value}</span>
                            <span sx={{margin: '10px'}}>:{propertyLabel}</span>
                        </ListItemText>
                    )}
                    </ListItem>
                    {key !== 'updatedAt' && (
                    <Divider component="li" />
                    )}
                </>
              );
            })}
          </List>
        </>
      );
}


