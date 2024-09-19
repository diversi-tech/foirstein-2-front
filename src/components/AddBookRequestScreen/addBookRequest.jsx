import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Button } from '@mui/base';
import { Autocomplete, ButtonGroup } from '@mui/material';
//import { AddBookRequest } from '../../utils/addBookRequestServer';
const theme = (outerTheme) =>
    createTheme({
        direction: 'rtl'
        ,
        palette: {
            mode: outerTheme.palette.mode,
        },
    });
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});
const categories = ["אנציקלופדיות ומילונים", "חינוך והוראה", "קודש", "חול", "אמנות, העשרה ופנאי", "מעגל השנה"];
const itemTypes = ["מוצר פיזי", "ספר", "קובץ דיגיטלי"];
export default function AddBookRequestFile() {
    const currentUser = useSelector(state => state.userReducer.currentUser);
    const currentUserId = currentUser ? currentUser.userId : 0;
    const [isEmpty, setIsEmpty] = useState();
    const [bookName, setBookName] = useState();
    const [author, setAuthor] = useState();
    const [description, setDescription] = useState();
    const [category, setCategory] = useState();
    const [publicationYear, setPublicationYear] = useState();
    const [jewishPublicationYear, setJewishPublicationYear] = useState();
    const [series, setSeries] = useState();
    const [numOfBooksInSeries, setNumOfBooksInSeries] = useState();
    const [language, setLanguage] = useState();
    const [itemType, setItemType] = useState();
    const [note, setNote] = useState();
    const [bookRequest, setBookRequest] = useState({
        bookName: bookName,
        author: author,
        description: description,
        category: category,
        publicationYear: publicationYear,
        jewishPublicationYear: jewishPublicationYear,
        series: series,
        numOfBooksInSeries: numOfBooksInSeries,
        language: language,
        itemType: itemType,
        note: note
    });
    return (
        <>
            <div style={{ alignItems: "center", justifyContent: "center", textAlign: 'center', marginTop: 15, paddingBottom: 15 }}>
                <h1 style={{ color: '#0D1E46' }}>מלאי את הפרטים הידועים לך</h1>
                <CacheProvider value={cacheRtl}>
                    <ThemeProvider theme={theme}>
                        <div dir="rtl">
                            <TextField required sx={{ borderColor: '#0D1E46', '&:hover': {borderBlockColor: '#0D1E46'}}}
                            onChange={(e) => setBookName(e.target.value)}
                                label="שם הספר"
                                placeholder="שם הספר*"
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <TextField  sx={{borderBlockColor: "red", borderBlockStartColor: "red", border: "red"}}
                                onChange={(e) => setAuthor(e.target.value)}
                                label="שם המחבר"
                                placeholder="שם המחבר"
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <TextField style={{ width: 225 }}
                                onChange={(e) => setDescription(e.target.value)}
                                label="תיאור"
                                placeholder="תיאור"
                                name='description'
                                multiline
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <Autocomplete style=
                            {{ width: 225, alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: '0 auto', borderColor:  '#0D1E46'}}
                                disablePortal
                                id="combo-box-demo"
                                options={categories}
                                onChange={((e) => setCategory(e.target.value))}
                                renderInput={(params) => <TextField {...params} label="קטגוריה" />} />
                            <br></br>
                            <TextField style={{borderBlockColor: '#0D1E46', borderColor: '#0D1E46'}}
                                onChange={(e) => setPublicationYear(e.target.value)}
                                label="שנת הוצאה לאור לועזי"
                                placeholder="שנת הוצאה לאור לועזי"
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <TextField
                                onChange={(e) => setJewishPublicationYear(e.target.value)}
                                label="שנת הוצאה לאור עברי"
                                placeholder="שנת הוצאה לאור עברי"
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <TextField
                                label="סידרה"
                                placeholder="סידרה"
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <TextField
                                onChange={(e) => setNumOfBooksInSeries(e.target.value)}
                                label="מספר ספרים בסידרה"
                                placeholder="מספר ספרים בסידרה"
                                type='number'
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <TextField
                                onChange={(e) => setLanguage(e.target.value)}
                                label="שפה"
                                placeholder="שפה"
                                variant="outlined"
                            />
                            <br></br><br></br>
                            <Autocomplete required style={{ width: 225, alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: '0 auto' }}
                                disablePortal
                                id="combo-box-demo"
                                options={itemTypes}
                                onChange={((e) => setItemType(e.target.value))}
                                renderInput={(params) => <TextField {...params} label="סוג המוצר*" />} />
                            <br></br>
                            <TextField
                                onChange={(e) => setNote(e.target.value)}
                                label="הערה"
                                placeholder="הערה"
                                variant="outlined"
                            />
                        </div>
                    </ThemeProvider>
                </CacheProvider>
                {/* <ButtonGroup><Button>אישור</Button></ButtonGroup>AddBookwequest(bookRequest); */}
            </div>
            <div className='submit' style={{ marginLeft: 5, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <ButtonGroup>
                <Button style={{ color: 'white', backgroundColor: '#0D1E46', marginBottom: '4px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} onClick={() => { setBookRequest(bookRequest);  }}>אישור</Button>
               {/* <Button style={{ color: 'white', backgroundColor: '#0D1E46', marginBottom: '4px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} onClick={() => { setBookRequest(bookRequest); AddBookRequest(bookRequest); }}>אישור</Button> */}
                </ButtonGroup>
            </div>
        </>
    )
}






