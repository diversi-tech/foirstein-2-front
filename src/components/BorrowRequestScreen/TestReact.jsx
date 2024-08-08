
import { Style } from "@mui/icons-material";
import { JewishMonth, dontSelectShabatAndHolidays } from "jewish-dates-core";
import React, { useEffect, useState } from "react";
import { ReactJewishDatePicker, BasicJewishDay } from "react-jewish-datepicker";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import "react-jewish-datepicker/dist/index.css";
import "./dateRangePickker.css"
import moment from 'moment';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
export default function DateRangePickerExample({ borrowRequest, setBorrowRequest, righatDate, setRighatDate, i, setI, iApproval, setIApproval,currentItem }) {
  const excludeShabatAndHolidays = dontSelectShabatAndHolidays();

  const maxSelectableDays = currentItem.numberOfDaysOfQuestion;
  const i1 = [];
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [wait, setWait] = useState(false)

  const [pop, setPop] = useState(false)
  const [tecxtPop, setTecxtPop] = useState("")
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const today = new Date();
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + 7);

  // Format the date to 'YYYY-MM-DD'
  const formattedDate = today.toISOString().split('T')[0];
  const formattedNextDate = nextDate.toISOString().split('T')[0];

  // Construct the new object to be added to the 'i' array
  const newObject = {
    fromDate: formattedDate,
    untilDate: formattedNextDate
  };
  const newObject1 = {
    fromDate: formattedNextDate,
    untilDate: formattedNextDate
  };
  // Add the new object to the 'i' array
  i.push(newObject1);
  iApproval.push(newObject)
  i1.push(newObject)


  const isDateDisabled = (day) => {
    if (!day || !day.date) {
      return {}; // Default value or other implementation that suits your needs
    }



    const selectedDate = day.date.toISOString().split('T')[0];

    const isDisabled = i.some(request => {
      const fromDate = new Date(request.fromDate).toISOString().split('T')[0];
      const untilDate = new Date(request.untilDate).toISOString().split('T')[0];

      return selectedDate >= fromDate && selectedDate <= untilDate;
    });

    const isApproved = i.some(request => {
      const fromDate = new Date(request.fromDate).toISOString().split('T')[0];
      const untilDate = new Date(request.untilDate).toISOString().split('T')[0];

      return selectedDate >= fromDate && selectedDate <= untilDate;
    });


    if (isDisabled) {
      return { style: { backgroundColor: 'red' } }; // Example style for disabled dates
    } else if (isApproved) {
      return { style: { backgroundColor: 'lightgreen' } }; // Example style for approved dates
    }

  };

  const borrowRequestWithWait = () => {
    setBorrowRequest({
      ...borrowRequest,
      isWaiting: true

    });
    setRighatDate(true)
    handleClose()
    console.log("borrowRequestWithWait  ", borrowRequest)
  }
  const handleDateClick = (day1, day2) => {
    setWait(false)
    setRighatDate(false)
    const startDate = moment(day1.date);
    const endDate = moment(day2.date);
    const selectedDate1 = day1.date.toISOString().split('T')[0];
    const selectedDate2 = day2.date.toISOString().split('T')[0];
      const diffInDays = endDate.diff(startDate, 'days');
      if (diffInDays > maxSelectableDays) {
        setTecxtPop(`אתה יכול לבחור מקסימום ${maxSelectableDays} ימים`);
        setAnchorEl(document.body);} 
        // Set the anchor element to body to open the Popover
        if(diffInDays <= maxSelectableDays){
        iApproval.some(request => {
          const fromDate = new Date(request.fromDate).toISOString().split('T')[0];
          const untilDate = new Date(request.untilDate).toISOString().split('T')[0];
          if ((selectedDate1 >= fromDate && selectedDate1 <= untilDate) ||
            (selectedDate2 >= fromDate && selectedDate2 <= untilDate)) {
              setRequestSubmitted(true);
            setTecxtPop(`הוגשה כבר בקשה לימים אלו 
              לכניסה להמתנה ,`);
            setWait(true)
            setAnchorEl(document.body);
          }
        })}
      
        if(diffInDays <= maxSelectableDays&&!wait){
      setStartDay(startDate.format('YYYY-MM-DD'));
      setEndDay(endDate.format('YYYY-MM-DD'));

      setBorrowRequest({
        ...borrowRequest,
        fromDate: startDate.format('YYYY-MM-DD'),
        untilDate: endDate.format('YYYY-MM-DD'),
      });
      
      setRighatDate(true)}
    
  };
  useEffect(() => {
    debugger
    if (requestSubmitted) {
        document.documentElement.style.setProperty('--day-color', '#FFD700'); // עדכון של המשתנה ב־CSS
    } else {
        document.documentElement.style.setProperty('--day-color', '#173272'); // איפוס של המשתנה ב־CSS
    }
}, [requestSubmitted]);

  return (
    <>


<div style={{width: "70%", justifyContent: "center", alignItems: "center", margin: "0 auto"}}>

      <ReactJewishDatePicker

        isHebrew
        isRange
        maxDate={maxSelectableDays}
        minDate={new Date().toISOString().split('T')[0]}
        // className={!righatDate ? 'disabled-date' : ''}
        dayClassName={(day) => {
          debugger
          if (requestSubmitted) {
              return "disabled-date"; // Apply custom style when a request has been submitted
          }
          return ""; // Default class for other dates
      }}
      
        canSelect={(day) => {
          if (excludeShabatAndHolidays(day) && !isDateDisabled(day)) {
            return true;
          }
          return false;
        }}

        onClick={handleDateClick}

      />

      <div >

        <Popover

          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
      
     
        >
          <Typography sx={{ p: 2 }}> {tecxtPop}
            <span onClick={handleClose} style={{ marginLeft: '10px', marginTop: '4px', width: '20px' }}><ClearOutlinedIcon /></span>

            <br></br>
            <br></br>

            {wait && <Button sx={{
              backgroundColor: "white", color: "#371f80 ", '&:hover': {
                backgroundColor: '#b8c548', // Set background color to red on hover
              }
            }} variant="contained" onClick={borrowRequestWithWait} >לאישור</Button>}
          </Typography>
        </Popover>
      </div>
</div>
    </>

  );
}


