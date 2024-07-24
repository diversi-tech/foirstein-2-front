import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  Grid,
  createTheme,
  ThemeProvider,
  Divider,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  Alert,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { FillData } from '../../redux/actions/itemAction';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RequestDetails from './RequestDetails'; // ייבוא הקומפוננטה
import CloseIcon from '@mui/icons-material/Close';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [stylisRTLPlugin],
});

const theme = createTheme({
  direction: 'rtl',
});

const getStatusIcon = (status, displayType) => {
  switch (status) {
    case 1:
      return displayType === 'icon' ? (
        <Tooltip title="אושר">
          <CheckCircleIcon style={{ color: 'green' }} />
        </Tooltip>
      ) : 'אושר';
    case 2:
      return displayType === 'icon' ? (
        <Tooltip title="נדחה">
          <CancelIcon style={{ color: 'red' }} />
        </Tooltip>
      ) : 'נדחה';
    case 0:
      return displayType === 'icon' ? (
        <Tooltip title="ממתין">
          <HourglassEmptyIcon style={{ color: 'orange' }} />
        </Tooltip>
      ) : 'ממתין';
    default:
      return null;
  }
};

const StatusListView = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('requestId');
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [error, setError] = useState(null);
  const [showIcons, setShowIcons] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [closedAlerts, setClosedAlerts] = useState({});
  const currentUser = useSelector(state => state.userReducer.currentUser);
  const itemList = useSelector(state => state.itemReducer.itemList);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const apiUrl = process.env.REACT_APP_SERVER_URL;

  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(`${apiUrl}/api/BorrowRequest/getBorrowRequestsAndApprovals/${currentUser.UserId}`);
        const data1 = await response1.json();
        setPendingRequests(data1.borrowRequests);
        setProcessedRequests(data1.borrowApprovalRequests);
        setLoadData(true);  

        // const response2 = await fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
        // const data2 = await response2.json();
        // dispatch(FillData(data2));
      } catch (error) {
        setError(error);
        setLoadData(false);
      }
    };

    fetchData();
  }, []);

  const refreshRequests = () => {
    setLoading(true);

    setTimeout(() => {
      fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setPendingRequests(data.borrowRequests);
          setProcessedRequests(data.borrowApprovalRequests);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, 2000);
  };

  const getStatusDisplay = (status) => {
    return showIcons ? getStatusIcon(status, 'icon') : getStatusIcon(status, 'text');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/BorrowRequest/Delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      refreshRequests();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleDialogOpen = (requestId) => {
    setDeleteRequestId(requestId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDeleteRequestId(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteRequestId);
    handleDialogClose();
  };

  const handleExpandClick = (requestId) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAlertClose = (requestId) => {
    setClosedAlerts((prev) => ({ ...prev, [requestId]: true }));
  };

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const renderAlert = (row) => {
    const currentDate = new Date();
    const untilDate = new Date(row.untilDate);

    if (untilDate < currentDate && !row.isReturned && !closedAlerts[row.requestId]) {
      return (
        <Collapse in={!closedAlerts[row.requestId]}>
          <Alert
            severity="error"
            variant="filled"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => handleAlertClose(row.requestId)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            style={{ marginBottom: '20px', backgroundColor: '#ffcccc', color: '#b20000', direction: 'rtl' }}
          >
            {/* {`התאריך של ההחזרה עבור ${row.productName} עבר! אנא החזר את המוצר בהקדם האפשרי.`} */}
            {`הי, הלו תתעורר! מה קוה פה עוד לא החזרת את${row.productName} כולם מחכים לזה `}
            </Alert>
        </Collapse>
      );
    }
    return null;
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8}>
            <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <IconButton onClick={refreshRequests} aria-label="refresh">
                    {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="h6">רשימת בקשות השאלה</Typography>
                </Grid>
              </Grid>
              <Divider variant="middle" style={{ margin: '20px 0' }} />
              {pendingRequests.map((row) => renderAlert(row))}
              <TableContainer component={Paper} sx={{ overflowX: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">מחיקת בקשה</TableCell>
                      <TableCell align="center">פרטים נוספים</TableCell>
                      {isMediumScreen && (
                        <>
                          <TableCell align="center">עד תאריך</TableCell>
                          <TableCell align="center">מתאריך</TableCell>
                        </>
                      )}
                      <TableCell align="center">סטטוס</TableCell>
                      <TableCell align="center">מוצר</TableCell>
                      {isSmallScreen && (
                        <TableCell align="center">מספר בקשה</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRequests.map((row) => (
                      <React.Fragment key={row.requestId}>
                        <TableRow>
                          <TableCell align="center">
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDialogOpen(row.requestId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleExpandClick(row.requestId)}
                              aria-label="expand row"
                            >
                              {expandedRequestId === row.requestId ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </IconButton>
                          </TableCell>
                          {isMediumScreen && (
                            <>
                              <TableCell align="center">
                                {new Date(row.untilDate).toLocaleDateString('he-IL')}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(row.fromDate).toLocaleDateString('he-IL')}
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center">
                            {getStatusDisplay(row.status)}
                          </TableCell>
                          <TableCell align="center">{row.productName}</TableCell>
                          {isSmallScreen && (
                            <TableCell align="center">{row.requestId}</TableCell>
                          )}
                        </TableRow>
                        {expandedRequestId === row.requestId && (
                          <TableRow>
                            <TableCell colSpan={isMediumScreen ? 7 : 4}>
                              <RequestDetails row={row} />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow>
                      <TableCell colSpan={isMediumScreen ? 7 : 4} align="center">
                        <Divider />
                      </TableCell>
                    </TableRow>
                    {processedRequests.map((row) => (
                      <React.Fragment key={row.requestId}>
                        <TableRow>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleExpandClick(row.requestId)}
                              aria-label="expand row"
                            >
                              {expandedRequestId === row.requestId ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </IconButton>
                          </TableCell>
                          {isMediumScreen && (
                            <>
                              <TableCell align="center">
                                {new Date(row.untilDate).toLocaleDateString('he-IL')}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(row.fromDate).toLocaleDateString('he-IL')}
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center">
                            {getStatusDisplay(row.status)}
                          </TableCell>
                          <TableCell align="center">{row.productName}</TableCell>
                          {isSmallScreen && (
                            <TableCell align="center">{row.requestId}</TableCell>
                          )}
                        </TableRow>
                        {expandedRequestId === row.requestId && (
                          <TableRow>
                            <TableCell colSpan={isMediumScreen ? 7 : 4}>
                              <RequestDetails row={row} />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pendingRequests.length + processedRequests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>אישור מחיקה</DialogTitle>
          <DialogContent>
            <DialogContentText>
              האם אתה בטוח שברצונך למחוק בקשה זו?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              ביטול
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              מחק
            </Button>
          </DialogActions>
        </Dialog>
        <Backdrop open={loading} style={{ zIndex: 1 }}>
          <CircularProgress />
        </Backdrop>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default StatusListView;


// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   CircularProgress,
//   Tooltip,
//   Button,
//   Grid,
//   createTheme,
//   ThemeProvider,
//   Divider,
//   TablePagination,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Backdrop,
//   Alert
// } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useDispatch, useSelector } from 'react-redux';
// import { FillData } from '../../redux/actions/itemAction';
// import stylisRTLPlugin from 'stylis-plugin-rtl';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import RequestDetails from './RequestDetails'; // ייבוא הקומפוננטה

// const cacheRtl = createCache({
//   key: 'muirtl',
//   stylisPlugins: [stylisRTLPlugin],
// });

// const theme = createTheme({
//   direction: 'rtl',
// });

// const getStatusIcon = (status, displayType) => {
//   switch (status) {
//     case 1:
//       return displayType === 'icon' ? (
//         <Tooltip title="אושר">
//           <CheckCircleIcon style={{ color: 'green' }} />
//         </Tooltip>
//       ) : 'אושר';
//     case 2:
//       return displayType === 'icon' ? (
//         <Tooltip title="נדחה">
//           <CancelIcon style={{ color: 'red' }} />
//         </Tooltip>
//       ) : 'נדחה';
//     case 0:
//       return displayType === 'icon' ? (
//         <Tooltip title="ממתין">
//           <HourglassEmptyIcon style={{ color: 'orange' }} />
//         </Tooltip>
//       ) : 'ממתין';
//     default:
//       return null;
//   }
// };

// const StatusListView = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const dispatch = useDispatch();
//   const [data, setData] = useState([]);
//   const [expandedRequestId, setExpandedRequestId] = useState(null);
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('requestId');
//   const [loading, setLoading] = useState(false);
//   const [loadData, setLoadData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showIcons, setShowIcons] = useState(true);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [deleteRequestId, setDeleteRequestId] = useState(null);
//   const currentUser = useSelector(state => state.userReducer.currentUser);
//   const itemList = useSelector(state => state.itemReducer.itemList);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [processedRequests, setProcessedRequests] = useState([]);
//   const apiUrl = process.env.REACT_APP_SERVER_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response1 = await fetch(`${apiUrl}/api/BorrowRequest/getBorrowRequestsAndApprovals/${currentUser.UserId}`);
//         const data1 = await response1.json();
//         setPendingRequests(data1.borrowRequests);
//         setProcessedRequests(data1.borrowApprovalRequests);
//         setLoadData(true);  

//         // const response2 = await fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
//         // const data2 = await response2.json();
//         // dispatch(FillData(data2));
//       } catch (error) {
//         setError(error);
//         setLoadData(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const refreshRequests = () => {
//     setLoading(true);

//     setTimeout(() => {
//       fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           setData(data);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching data:', error);
//           setLoading(false);
//         });
//     }, 2000);
//   };

//   const getStatusDisplay = (status) => {
//     return showIcons ? getStatusIcon(status, 'icon') : getStatusIcon(status, 'text');
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`${apiUrl}/api/BorrowRequest/Delete/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       refreshRequests();
//     } catch (error) {
//       console.error('Error deleting data:', error);
//     }
//   };

//   const handleDialogOpen = (requestId) => {
//     setDeleteRequestId(requestId);
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     setDeleteRequestId(null);
//   };

//   const handleConfirmDelete = () => {
//     handleDelete(deleteRequestId);
//     handleDialogClose();
//   };

//   const handleExpandClick = (requestId) => {
//     setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   if (error) return <Typography color="error">Error: {error.message}</Typography>;

//   const renderAlert = (row) => {
//     const currentDate = new Date();
//     const untilDate = new Date(row.untilDate);

//     if (untilDate < currentDate && !row.isReturned) {
//       return (
//         <Alert severity="error" variant="outlined" style={{ marginBottom: '20px' }}>
//           התאריך של ההחזרה עבר! אנא החזר את המוצר בהקדם האפשרי.
//         </Alert>
//       );
//     }
//     return null;
//   };

//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <Grid container justifyContent="center">
//           <Grid item xs={12} sm={10} md={8}>
//             <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
//               <Grid container justifyContent="space-between" alignItems="center">
//                 <Grid item>
//                   <IconButton onClick={refreshRequests} aria-label="refresh">
//                     {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
//                   </IconButton>
//                 </Grid>
//                 <Grid item>
//                   <Typography variant="h6">רשימת בקשות השאלה</Typography>
//                 </Grid>
//               </Grid>
//               <Divider variant="middle" style={{ margin: '20px 0' }} />
//               {pendingRequests.map((row) => renderAlert(row))}
//               <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell align="center">מחיקת בקשה</TableCell>
//                       <TableCell align="center">פרטים נוספים</TableCell>
//                       <TableCell align="center">עד תאריך</TableCell>
//                       <TableCell align="center">מתאריך</TableCell>
//                       <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>תאריך בקשה</TableCell>
//                       <TableCell align="center">סטטוס</TableCell>
//                       <TableCell align="center">שם המוצר</TableCell>
//                       <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>בקשה מספר</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {pendingRequests.map((row, index) => (
//                       <>
//                         <TableRow key={row.requestId}>
//                           <TableCell align="center">
//                             <IconButton
//                               aria-label="delete"
//                               onClick={() => handleDialogOpen(row.requestId)}
//                               style={{ color: '#0D1E46' }}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                           <TableCell align="center">
//                             <IconButton
//                               onClick={() => handleExpandClick(row.requestId)}
//                               aria-label="expand row"
//                             >
//                               {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                             </IconButton>
//                           </TableCell>
//                           <TableCell align="center">{new Date(row.untilDate).toLocaleDateString('he-IL')}</TableCell>
//                           <TableCell align="center">{new Date(row.fromDate).toLocaleDateString('he-IL')}</TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                             {new Date(row.requestDate).toLocaleDateString('he-IL')}
//                           </TableCell>
//                           <TableCell align="center">{getStatusDisplay(row.status)}</TableCell>
//                           <TableCell align="center">{row.productName}</TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                             {row.requestId}
//                           </TableCell>
//                         </TableRow>
//                         {expandedRequestId === row.requestId && (
//                           <TableRow>
//                             <TableCell colSpan={8}>
//                               <RequestDetails row={row} />
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </>
//                     ))}
//                     <TableRow>
//                       <TableCell colSpan={8} align="center">
//                         <Divider />
//                       </TableCell>
//                     </TableRow>
//                     {processedRequests.map((row, index) => (
//                       <>
//                         <TableRow key={row.requestId}>
//                           <TableCell align="center">-</TableCell>
//                           <TableCell align="center">
//                             <IconButton
//                               onClick={() => handleExpandClick(row.requestId)}
//                               aria-label="expand row"
//                             >
//                               {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                             </IconButton>
//                           </TableCell>
//                           <TableCell align="center">{new Date(row.untilDate).toLocaleDateString('he-IL')}</TableCell>
//                           <TableCell align="center">{new Date(row.fromDate).toLocaleDateString('he-IL')}</TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                             {new Date(row.requestDate).toLocaleDateString('he-IL')}
//                           </TableCell>
//                           <TableCell align="center">{getStatusDisplay(row.status)}</TableCell>
//                           <TableCell align="center">{row.productName}</TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                             {row.requestId}
//                           </TableCell>
//                         </TableRow>
//                         {expandedRequestId === row.requestId && (
//                           <TableRow>
//                             <TableCell colSpan={8}>
//                               <RequestDetails row={row} />
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={pendingRequests.length + processedRequests.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </Paper>
//           </Grid>
//         </Grid>
//         <Dialog open={openDialog} onClose={handleDialogClose}>
//           <DialogTitle>אישור מחיקה</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               האם אתה בטוח שברצונך למחוק בקשה זו?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDialogClose} color="primary">
//               ביטול
//             </Button>
//             <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//               מחק
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Backdrop open={loading} style={{ zIndex: 1 }}>
//           <CircularProgress />
//         </Backdrop>
//       </ThemeProvider>
//     </CacheProvider>
//   );
// };

// export default StatusListView;


// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   CircularProgress,
//   Tooltip,
//   Button,
//   Grid,
//   createTheme,
//   ThemeProvider,
//   Divider,
//   TablePagination,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Backdrop
// } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useDispatch, useSelector } from 'react-redux';
// import { FillData } from '../../redux/actions/itemAction';
// import stylisRTLPlugin from 'stylis-plugin-rtl';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import RequestDetails from './RequestDetails'; // ייבוא הקומפוננטה

// const cacheRtl = createCache({
//   key: 'muirtl',
//   stylisPlugins: [stylisRTLPlugin],
// });

// const theme = createTheme({
//   direction: 'rtl',
// });


// const getStatusIcon = (status, displayType) => {
//   switch (status) {
//     case 1:
//       return displayType === 'icon' ? (
//         <Tooltip title="אושר">
//           <CheckCircleIcon style={{ color: 'green' }} />
//         </Tooltip>
//       ) : 'אושר';
//     case 2:
//       return displayType === 'icon' ? (
//         <Tooltip title="נדחה">
//           <CancelIcon style={{ color: 'red' }} />
//         </Tooltip>
//       ) : 'נדחה';
//     case 0:
//       return displayType === 'icon' ? (
//         <Tooltip title="ממתין">
//           <HourglassEmptyIcon style={{ color: 'orange' }} />
//         </Tooltip>
//       ) : 'ממתין';
//     default:
//       return null;
//   }
// };

// const StatusListView = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const dispatch = useDispatch();
//   const [data, setData] = useState([]);
//   const [expandedRequestId, setExpandedRequestId] = useState(null);
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('requestId');
//   const [loading, setLoading] = useState(false);
//   const [loadData, setLoadData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showIcons, setShowIcons] = useState(true);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [deleteRequestId, setDeleteRequestId] = useState(null);
//   const currentUser = useSelector(state => state.userReducer.currentUser);
//   const itemList = useSelector(state => state.itemReducer.itemList);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [processedRequests, setProcessedRequests] = useState([]);
//   const apiUrl = process.env.REACT_APP_SERVER_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response1 = await fetch(`${apiUrl}/api/BorrowRequest/getBorrowRequestsAndApprovals/${currentUser.UserId}`);
//         const data1 = await response1.json();
//         setPendingRequests(data1.borrowRequests);
//         setProcessedRequests(data1.borrowApprovalRequests);
//         setLoadData(true);  

//         const response2 = await fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
//         const data2 = await response2.json();
//         dispatch(FillData(data2));
//       } catch (error) {
//         setError(error);
//         setLoadData(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const refreshRequests = () => {
//     setLoading(true);

//     setTimeout(() => {
//       fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           setData(data);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching data:', error);
//           setLoading(false);
//         });
//     }, 2000);
//   };

//   const getStatusDisplay = (status) => {
//     return showIcons ? getStatusIcon(status, 'icon') : getStatusIcon(status, 'text');
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`${apiUrl}/api/BorrowRequest/Delete/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       refreshRequests();
//     } catch (error) {
//       console.error('Error deleting data:', error);
//     }
//   };

//   const handleDialogOpen = (requestId) => {
//     setDeleteRequestId(requestId);
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     setDeleteRequestId(null);
//   };

//   const handleConfirmDelete = () => {
//     handleDelete(deleteRequestId);
//     handleDialogClose();
//   };


//   const handleExpandClick = (requestId) => {
//     setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   if (error) return <Typography color="error">Error: {error.message}</Typography>;

//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <Grid container justifyContent="center">
//           <Grid item xs={12} sm={10} md={8}>
//             <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
//               <Grid container justifyContent="space-between" alignItems="center">
//                 <Grid item>
//                   <IconButton onClick={refreshRequests} aria-label="refresh">
//                     {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
//                   </IconButton>
//                 </Grid>
//                 <Grid item>
//                   <Typography variant="h6">רשימת בקשות השאלה</Typography>
//                 </Grid>
//               </Grid>
//               <Divider variant="middle" style={{ margin: '20px 0' }} />
//               <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell align="center">מחיקת בקשה</TableCell>
//                       <TableCell align="center">פרטים נוספים</TableCell>
//                       <TableCell align="center">עד תאריך</TableCell>
//                       <TableCell align="center">מתאריך</TableCell>
//                       <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>תאריך בקשה</TableCell>
//                       <TableCell align="center">סטטוס</TableCell>
//                       <TableCell align="center">שם המוצר</TableCell>
//                       <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>בקשה מספר</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {pendingRequests.map((row, index) => (
//                       <>
//                         <TableRow key={row.requestId}>
//                           <TableCell align="center">
//                             <IconButton
//                               aria-label="delete"
//                               onClick={() => handleDialogOpen(row.requestId)}
//                               style={{ color: '#0D1E46' }}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                           <TableCell align="center">
//                             <IconButton
//                               onClick={() => handleExpandClick(row.requestId)}
//                               aria-label="expand row"
//                             >
//                               {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                             </IconButton>
//                           </TableCell>
//                           <TableCell align="center">{new Date(row.untilDate).toLocaleString()}</TableCell>
//                           <TableCell align="center">{new Date(row.fromDate).toLocaleString()}</TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{new Date(row.requestDate).toLocaleString()}</TableCell>
//                           <TableCell align="center">
//                             <Button onClick={() => setShowIcons(!showIcons)}>
//                               {getStatusDisplay(0)}
//                             </Button>
//                           </TableCell>
//                           <TableCell align="center">
//                             {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                           </TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{index + 1}</TableCell>
//                         </TableRow>
//                         {itemList && (
//                           <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
//                         )}
//                       </>
//                     ))}
//                     <TableRow>
//                       <TableCell colSpan={9}>
//                         <Divider sx={{ borderColor: 'blue', borderStyle: 'dashed' }} />
//                       </TableCell>
//                     </TableRow>
//                     {processedRequests.map((row, index) => (
//                       <>
//                         <TableRow key={row.requestId} style={{ backgroundColor: '#0011' }}>
//                           <TableCell align="center">
//                           </TableCell>
//                           <TableCell align="center">
//                             <IconButton
//                               onClick={() => handleExpandClick(row.requestId)}
//                               aria-label="expand row"
//                             >
//                               {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                             </IconButton>
//                           </TableCell>
//                           <TableCell align="center">{new Date(row.untilDate).toLocaleString()}</TableCell>
//                           <TableCell align="center">{new Date(row.fromDate).toLocaleString()}</TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{new Date(row.requestDate).toLocaleString()}</TableCell>
//                           <TableCell align="center">
//                             <Button onClick={() => setShowIcons(!showIcons)}>
//                               {getStatusDisplay(row.requestStatus)}
//                             </Button>
//                           </TableCell>
//                           <TableCell align="center">
//                             {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                           </TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{pendingRequests.length + index + 1}</TableCell>
//                         </TableRow>
//                         {itemList && (
//                           <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
//                         )}
//                       </>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={data.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </Paper>
//           </Grid>
//         </Grid>
//         <Dialog
//           open={openDialog}
//           onClose={handleDialogClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">אישור מחיקה</DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               האם אתה בטוח שברצונך למחוק את הבקשה?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDialogClose} color="primary">
//               ביטול
//             </Button>
//             <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//               מחיקה
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Backdrop open={openDialog} style={{ zIndex: theme.zIndex.drawer + 1 }} />
//       </ThemeProvider>
//     </CacheProvider>
//   );
// };

// export default StatusListView;

