import React, { useEffect, useState } from 'react';
import { Button, Dialog, ButtonGroup } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useSelector } from 'react-redux';
import { AddBorrowRequest, GetBorrowRequestsAndApprovalsByItemId } from "../../utils/borrowRequestService"
import CustomDateRangePicker from "./calendar"
import DateRangePickerExample from './TestReact';
import "./dateRangePickker.css"

export default function BorrowRequestFile({ currentItem, isApproved }) {
    const currentUser = useSelector(state => state.userReducer.currentUser);
    const currentUserId = currentUser ? currentUser.userId : 0;
    console.log( "currentItem  ",currentItem)



//     accompanyingMaterial
// : 
// "חומר נלווה"
// amount
// : 
// 0
// author
// : 
// "ליבי קליין"
// category
// : 
// "קטגוריה"
// createdAt
// : 
// "0001-01-01T00:00:00"
// description
// : 
// "רגש"
// edition
// : 
// "מהדורה"
// filePath
// : 
// "shelf 3"
// hebrewPublicationYear
// : 
// "תשס\"ט"
// id
// : 
// 23
// isApproved
// : 
// true
// itemLevel
// : 
// 0
// itemType
// : 
// 0
// language
// : 
// "עברית"
// note
// : 
// "הערותתתת"
// numOfSeries
// : 
// 4
// numberOfDaysOfQuestion
// : 
// 3
// publishingYear
// : 
// 2004
// recommended
// : 
// true
// series
// : 
// "בדרה"
// title
// : 
// "גם כי אלך"
// updatedAt
// : 
// "0001-01-01T00:00:00"
// userId
// : 

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
        isWaiting: false,
        requestDate: currentDate.toISOString(),
        approvalDate: null,
        fromDate: fromDate.toISOString(),
        untilDate: untilDate.toISOString(),
        TotalPrice: 0,
        requestStatus: 0
    });
    const [i, setI] = useState([]);
    const [iApproval, setIApproval] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await GetBorrowRequestsAndApprovalsByItemId(2);
                if (fetchedData.borrowRequests.length > 0) {
                    setI(fetchedData.borrowRequests);
                }
                if (fetchedData.borrowApprovalRequests.length > 0) {
                    setIApproval(fetchedData.borrowApprovalRequests);
                }
            } catch (error) {
                console.error(error);
            } finally {
                // setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="contained" sx={{ width: '100%' }}
                color={isApproved == true ? "primary" : "secondary"}
            >להשאלה</Button>
            <div className='dialog' dir='rtl' style={{ marginRight: 450, color: '#B71C1C', direction: 'rtl', unicodeBidi: 'embed', textAlign: 'right', writingMode: 'horizontal-tb', font: 'Calibri Light' }}>
                <Dialog open={open} onClose={() => setOpen(false)} aria-describedby='alert-dialog-slide-description'>
                    <span onClick={() => setOpen(false)} style={{ marginLeft: '10px', marginTop: '4px', width: '30px' }}><ClearOutlinedIcon /></span>
                    <div className='popUp' style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', color: '#0D1E46', height: "80vh", width: '450px', direction: 'rtl', unicodeBidi: 'embed', writingMode: 'horizontal-tb' }} dir='rtl'>

                        <h1>בקשת השאלה</h1>
                        <br /><br />

                        {currentItem && (
                            <>
                                <div>הספר המבוקש:</div>
                                <div>{currentItem.title}</div>
                                <br /><br />
                                <div>מספר ימי השאלה מקסימלים:</div>
                                <div>{currentItem.numberOfDaysOfQuestion}</div>
                            </>
                        )}
                        <DateRangePickerExample borrowRequest={borrowRequest} setBorrowRequest={setBorrowRequest} righatDate={righatDate} setRighatDate={setRighatDate} i={i} setI={setI} iApproval={iApproval} setIApproval={setIApproval} currentItem={currentItem}></DateRangePickerExample>
                        {/* <CustomDateRangePicker borrowRequest={borrowRequest} setBorrowRequest={setBorrowRequest} righatDate={righatDate} setRighatDate={setRighatDate}></CustomDateRangePicker> */}
                        <br /><br />
                       
                        <div className='submit' style={{ marginLeft: 5, paddingTop: "45%" }}>

                            <ButtonGroup>
                                <Button className={!righatDate ? 'disabled-button' : ''} // Apply the 'disabled-button' class if the button is disabled

                                    disabled={!righatDate} style={{ color: 'white', backgroundColor: '#0D1E46', marginBottom: '4px' }} onClick={() => {
                                        setOpen(false);
                                        AddBorrowRequest(borrowRequest);
                                    }}>אישור</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}




