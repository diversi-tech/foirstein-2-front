
import React, { useState, useRef, useEffect } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function CustomDateRangePicker({ borrowRequest, setBorrowRequest,righatDate,setRighatDate }) {
  const lockedDates = [new Date("2023-04-15").toISOString().split('T')[0], new Date("2023-04-18").toISOString().split('T')[0]]
  const shouldDisableDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return lockedDates.includes(dateString);
  };

  const maxDateRange = 7;

  const [selectedRange, setSelectedRange] = useState([null, null]);
  const startInputRef = useRef(null);

  useEffect(() => {
    if (startInputRef.current) {
      startInputRef.current.focus();
    }
  }, []);

  const handleDateChange = (newRange) => {
    if (newRange[0] && newRange[1]) {
      const fromDate = new Date(newRange[0]);
      const untilDate = new Date(newRange[1]);

      setBorrowRequest({
        ...borrowRequest,
        fromDate: fromDate.toISOString().split('T')[0],
        untilDate: untilDate.toISOString().split('T')[0],
      });

      const startTime = fromDate instanceof Date ? fromDate.getTime() : null;
      const endTime = untilDate instanceof Date ? untilDate.getTime() : null;

      if (startTime && endTime) {
        const rangeDuration = Math.abs(endTime - startTime) / (1000 * 60 * 60 * 24) + 1;

        if (rangeDuration <= maxDateRange) {
          setSelectedRange(newRange);
           setRighatDate(true)
          

         
        } else {
          setSelectedRange([null, null]);
          
          alert(`Please select a date range within ${maxDateRange} days.`);
        }
      }
    }
  }

  return (
    <div dir='rtl'>
      <LocalizationProvider dateAdapter={AdapterDayjs} dir="rtl">
        <div dir='rtl'>
        <DemoContainer components={['DateRangePicker']} dir="rtl">
          <div dir='rtl'>
            <DateRangePicker
         
              value={selectedRange}
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
              maxDateRange={maxDateRange}
              renderInput={(startProps, endProps) => (
                <>
                  <input 
                    ref={startInputRef}
                    type="text"
                    placeholder="תאריך תחילת השאלה"
                    {...startProps}
                  />
                  <input
                    type="text"
                    placeholder="תאריך סיום השאלה"
                    {...endProps}
                  />
                </>
              )}
            />
          </div>
        </DemoContainer>
        </div>
      </LocalizationProvider>
    </div>
  );
}
