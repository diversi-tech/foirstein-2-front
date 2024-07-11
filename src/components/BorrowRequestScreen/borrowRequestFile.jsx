import React, { useState } from 'react';
import { Button, Dialog, ButtonGroup } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useSelector } from 'react-redux';
import { AddBorrowRequest } from "../../utils/borrowRequestService"
import CustomDateRangePicker from "./calendar"

export default function BorrowRequestFile({ currentItem }) {
const currentUser = useSelector(state => state.userReducer.currentUser);
const currentUserId = currentUser ? currentUser.userId : 0;
;
    const [open, setOpen] = useState(false);
    const currentDate = new Date();
    currentDate.toISOString();
    const [righatDate, setRighatDate] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [untilDate, setUntilDate] = useState(new Date());
    const [borrowRequest, setBorrowRequest] = useState({
        requestId: 0,
        itemId: 0,
        userId: currentUserId,
        requestDate: currentDate.toISOString(),
        approvalDate: null,
        fromDate: fromDate.toISOString(),
        untilDate: untilDate.toISOString(),
        TotalPrice: 0,
        requestStatus:0
    });

    console.log(currentItem);
   

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="contained" color="primary" sx={{ width: '100%' }}>להשאלה</Button>
            <div className='dialog' dir='rtl' style={{ marginRight: 450, color: '#B71C1C', direction: 'rtl', unicodeBidi: 'embed', textAlign: 'right', writingMode: 'horizontal-tb', font: 'Calibri Light' }}>
                <Dialog open={open} onClose={() => setOpen(false)} aria-describedby='alert-dialog-slide-description'>
                    <span onClick={() => setOpen(false)} style={{ marginLeft: '10px', marginTop: '4px', width: '30px' }}><ClearOutlinedIcon /></span>
                    <div className='popUp' style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', color: '#0D1E46', width: '450px', direction: 'rtl', unicodeBidi: 'embed', writingMode: 'horizontal-tb' }} dir='rtl'>
                        <h1>בקשת השאלה</h1>
                        <br /><br />

                        {currentItem && (
                            <>
                                <div>הספר המבוקש:</div>
                                <div>{currentItem.title}</div>
                                <br /><br />
                                <div>מחיר:</div>
                                <div>{currentItem.TotalPrice}</div>
                            </>
                        )}
                        <CustomDateRangePicker borrowRequest={borrowRequest} setBorrowRequest={setBorrowRequest} righatDate={righatDate} setRighatDate={setRighatDate}></CustomDateRangePicker>
                        <br /><br />
                        <div className='submit' style={{ marginLeft: 5 }}>
                            <ButtonGroup>
                            {righatDate&&<Button  style={{ color: 'white', backgroundColor: '#0D1E46', marginBottom: '4px' }} onClick={() => { setOpen(false); AddBorrowRequest(borrowRequest); }}>אישור</Button>}
                            </ButtonGroup>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}




