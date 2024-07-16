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
  Backdrop
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
  const [data, setData] = useState([]);
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('requestId');
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [error, setError] = useState(null);
  const [showIcons, setShowIcons] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const currentUser = useSelector(state => state.userReducer.currentUser);
  const itemList = useSelector(state => state.itemReducer.itemList);
  const [pendingRequests,setPendingRequests] = useState([]);
  const [processedRequests,setProcessedRequests] = useState([]);
  const apiUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(`${apiUrl}/api/BorrowRequest/getBorrowRequestsAndApprovals/${currentUser.UserId}`);
        const data1 = await response1.json();
        setPendingRequests(data1.borrowRequests);
        setProcessedRequests(data1.borrowApprovalRequests);
        setLoadData(true);

        const response2 = await fetch(`${apiUrl}/api/BorrowRequest/getAllItemToUser/${currentUser.UserId}`);
        const data2 = await response2.json();
        dispatch(FillData(data2));
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
          setData(data);
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

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

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
              <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">מחיקת בקשה</TableCell>
                      <TableCell align="center">פרטים נוספים</TableCell>
                      <TableCell align="center">עד תאריך</TableCell>
                      <TableCell align="center">מתאריך</TableCell>
                      <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>תאריך בקשה</TableCell>
                      <TableCell align="center">סטטוס</TableCell>
                      <TableCell align="center">שם המוצר</TableCell>
                      <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>בקשה מספר</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRequests.map((row, index) => (
                      <>
                        <TableRow key={row.requestId}>
                          <TableCell align="center">
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDialogOpen(row.requestId)}
                              style={{ color: '#0D1E46' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleExpandClick(row.requestId)}
                              aria-label="expand row"
                            >
                              {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">{new Date(row.untilDate).toLocaleString()}</TableCell>
                          <TableCell align="center">{new Date(row.fromDate).toLocaleString()}</TableCell>
                          <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{new Date(row.requestDate).toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Button onClick={() => setShowIcons(!showIcons)}>
                              {getStatusDisplay(0)}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
                          </TableCell>
                          <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{index + 1}</TableCell>
                        </TableRow>
                              {itemList && (
                                <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
                              )}      
                      </>
                    ))}
                  <TableRow>
                     <TableCell colSpan={9}>
                       <Divider sx={{ borderColor: 'blue', borderStyle: 'dashed' }} />
                     </TableCell>
                   </TableRow>
                    {processedRequests.map((row, index) => (
                      <>
                        <TableRow key={row.requestId} style={{ backgroundColor: '#0011' }}>
                          <TableCell align="center">
                            {/* No delete button for processed requests */}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleExpandClick(row.requestId)}
                              aria-label="expand row"
                            >
                              {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">{new Date(row.untilDate).toLocaleString()}</TableCell>
                          <TableCell align="center">{new Date(row.fromDate).toLocaleString()}</TableCell>
                          <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{new Date(row.requestDate).toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Button onClick={() => setShowIcons(!showIcons)}>
                              {getStatusDisplay(row.requestStatus)}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
                          </TableCell>
                          <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{pendingRequests.length + index + 1}</TableCell>
                        </TableRow>                       
                              {itemList && (
                                <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
                              )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">אישור מחיקה</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              האם אתה בטוח שברצונך למחוק את הבקשה?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              ביטול
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              מחיקה
            </Button>
          </DialogActions>
        </Dialog>
        <Backdrop open={openDialog} style={{ zIndex: theme.zIndex.drawer + 1 }} />
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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response1 = await fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
//         const data1 = await response1.json();
//         setData(data1);
//         setLoadData(true);

//         const response2 = await fetch(`${apiUrl}/api/BorrowRequest/getAllItemToUser/${currentUser.UserId}`);
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
//     setOpenDialog(false);
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

//   const handleDialogOpen = (id) => {
//     setDeleteRequestId(id);
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   const pendingRequests = data.filter(row => row.requestStatus === 0);
//   const processedRequests = data.filter(row => row.requestStatus !== 0);

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

//   const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
//               <Typography variant="h6">בקשות ממתינות</Typography>
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
//                     {loadData && pendingRequests.map((row, index) => (
//                       <TableRow key={row.requestId}>
//                         <TableCell align="center">
//                           <IconButton
//                             aria-label="delete"
//                             onClick={() => handleDialogOpen(row.requestId)}
//                             style={{ color: '#0D1E46' }}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                         <TableCell align="center">
//                           <IconButton
//                             onClick={() => handleExpandClick(row.requestId)}
//                             aria-label="expand row"
//                           >
//                             {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                           </IconButton>
//                         </TableCell>
//                         <TableCell align="center">{new Date(row.untilDate).toLocaleString()}</TableCell>
//                         <TableCell align="center">{new Date(row.fromDate).toLocaleString()}</TableCell>
//                         <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{new Date(row.requestDate).toLocaleString()}</TableCell>
//                         <TableCell align="center">
//                           <Button onClick={() => setShowIcons(!showIcons)}>
//                             {getStatusDisplay(row.requestStatus)}
//                           </Button>
//                         </TableCell>
//                         <TableCell align="center">
//                           {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                         </TableCell>
//                         <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{index + 1}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <Divider variant="middle" style={{ margin: '20px 0' }} />
//               <Typography variant="h6">בקשות מעובדות</Typography>
//               <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow>
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
//                     {loadData && processedRequests.map((row, index) => (
//                       <TableRow key={row.requestId} style={{ backgroundColor: '#f0f0f0' }}>
//                         <TableCell align="center">
//                           <IconButton
//                             onClick={() => handleExpandClick(row.requestId)}
//                             aria-label="expand row"
//                           >
//                             {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                           </IconButton>
//                         </TableCell>
//                         <TableCell align="center">{new Date(row.untilDate).toLocaleString()}</TableCell>
//                         <TableCell align="center">{new Date(row.fromDate).toLocaleString()}</TableCell>
//                         <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{new Date(row.requestDate).toLocaleString()}</TableCell>
//                         <TableCell align="center">
//                           <Button onClick={() => setShowIcons(!showIcons)}>
//                             {getStatusDisplay(row.requestStatus)}
//                           </Button>
//                         </TableCell>
//                         <TableCell align="center">
//                           {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                         </TableCell>
//                         <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{index + 1}</TableCell>
//                       </TableRow>
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
//           BackdropComponent={Backdrop}
//           BackdropProps={{
//             timeout: 500,
//             style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
//           }}
//         >
//           <DialogTitle id="alert-dialog-title">אישור מחיקה</DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               האם אתה בטוח שברצונך למחוק את הבקשה הזו?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDialogClose} color="primary">
//               ביטול
//             </Button>
//             <Button onClick={() => handleDelete(deleteRequestId)} color="primary" autoFocus>
//               מחק
//             </Button>
//           </DialogActions>
//         </Dialog>
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
//   TablePagination
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
//     const dispatch = useDispatch();
//   const [data, setData] = useState([]);
//   const [expandedRequestId, setExpandedRequestId] = useState(null);
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('requestId');
//   const [loading, setLoading] = useState(false);
//   const [loadData, setLoadData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showIcons, setShowIcons] = useState(true);
//   const currentUser = useSelector(state => state.userReducer.currentUser);
//   const itemList = useSelector(state => state.itemReducer.itemList);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response1 = await fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
//         const data1 = await response1.json();
//         setData(data1);
//         setLoadData(true);

//         const response2 = await fetch(`${apiUrl}/api/BorrowRequest/getAllItemToUser/${currentUser.UserId}`);
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

//   const pendingRequests = data.filter(row => row.requestStatus === 0);
//   const processedRequests = data.filter(row => row.requestStatus !== 0);

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

//   const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
//               <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow>
//                     <TableCell align="center">מחיקת בקשה</TableCell>
//                        <TableCell align="center">פרטים נוספים</TableCell> 
//                        <TableCell align="center">עד תאריך</TableCell>
//                        <TableCell align="center">מתאריך</TableCell>       
//                        {/* <TableCell
//                          align="center"
//                          sx={{ display: { md: 'table-cell', sm: 'none' } }}
//                          sortDirection={orderBy === 'approvalDate' ? order : false}
//                        >
//                          תאריך אישור
//                        </TableCell> */}
//                        <TableCell
//                          align="center"
//                          sx={{ display: { sm: 'table-cell', xs: 'none' } }}
//                        >
//                          תאריך בקשה
//                        </TableCell>
//                        <TableCell align="center" >
//                          סטוטס
//                        </TableCell>
//                        <TableCell align="center" >
//                          שם המוצר
//                        </TableCell>
//                        <TableCell
//                          align="center"
//                          sx={{ display: { sm: 'table-cell', xs: 'none' } }}
//                        >
//                          בקשה מספר
//                        </TableCell>
//                       {/* <TableCell align="center">פעולות</TableCell>
//                       <TableCell align="center">סטטוס</TableCell>
//                       <TableCell align="center">זמן פעולה</TableCell>
//                       <TableCell align="center">זמן בקשה</TableCell>
//                       <TableCell align="center">שם משתמש</TableCell>
//                       <TableCell align="center">תעודת זהות</TableCell>
//                       <TableCell align="center">מספר</TableCell> */}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {loadData && paginatedData.map((row, index) => (
//                       <TableRow key={row.requestId}>
//                                               <TableCell align="center">
//                                  {row.requestStatus === 0 && (
//                                    <IconButton
//                                      aria-label="delete"
//                                      onClick={() => handleDelete(row.requestId)}
//                                      style={{ color: '#0D1E46' }} 
//                                    >
//                                      <DeleteIcon />
//                                    </IconButton>
//                                  )}
//                                </TableCell>
//                                <TableCell align="center">
//                                  <IconButton
//                                    onClick={() => handleExpandClick(row.requestId)}
//                                    aria-label="expand row"
//                                  >
//                                    {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                                  </IconButton>
//                                </TableCell>
//                                <TableCell align="center">
//                                  {row.requestStatus === 1 ? new Date(row.untilDate).toLocaleString() : '-'}
//                                </TableCell>
//                                <TableCell align="center">
//                                  {row.requestStatus === 1 ? new Date(row.fromDate).toLocaleString() : '-'}
//                                </TableCell>                             
//                                <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                                  {new Date(row.requestDate).toLocaleString()}
//                                </TableCell>
//                                <TableCell align="center">
//                                  <Button onClick={() => setShowIcons(!showIcons)}>
//                                    {getStatusDisplay(row.requestStatus)}
//                                  </Button>
//                                </TableCell>
//                                <TableCell align="center">
//                                  {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                                </TableCell>
//                                <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                                  {index + 1}
//                                </TableCell>
                          
//                              </TableRow>
//                             //  {itemList && (
//                             //    <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
//                             //  )}
//                         // {/* <TableCell align="center">
//                         //   <Tooltip title="Delete">
//                         //     <IconButton onClick={() => handleDelete(row.requestId)} aria-label="delete">
//                         //       <DeleteIcon />
//                         //     </IconButton>
//                         //   </Tooltip>
//                         //   <Tooltip title="Expand">
//                         //     <IconButton onClick={() => handleExpandClick(row.requestId)} aria-label="expand row">
//                         //       {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                         //     </IconButton>
//                         //   </Tooltip>
//                         // </TableCell>
//                         // <TableCell align="center">
//                         //   {row.status}
//                         // </TableCell>
//                         // <TableCell align="center">{new Date(row.requestDate).toLocaleString()}</TableCell>
//                         // <TableCell align="center">{new Date(row.actionDate).toLocaleString()}</TableCell>
//                         // <TableCell align="center">{row.userName}</TableCell>
//                         // <TableCell align="center">{row.userId}</TableCell>
//                         // <TableCell align="center">{index + 1}</TableCell> */}
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
//   Divider
// } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import RequestDetails from './RequestDetails';
// import { useDispatch, useSelector } from 'react-redux';
// import { FillData } from '../../redux/actions/itemAction';
// import stylisRTLPlugin from 'stylis-plugin-rtl';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import DeleteIcon from '@mui/icons-material/Delete';

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
//   const dispatch = useDispatch();
//   const [data, setData] = useState([]);
//   const [expandedRequestId, setExpandedRequestId] = useState(null);
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('requestId');
//   const [loading, setLoading] = useState(false);
//   const [loadData, setLoadData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showIcons, setShowIcons] = useState(true);
//   const currentUser = useSelector(state => state.userReducer.currentUser);
//   const itemList = useSelector(state => state.itemReducer.itemList);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response1 = await fetch(`${apiUrl}/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
//         const data1 = await response1.json();
//         setData(data1);
//         setLoadData(true);

//         const response2 = await fetch(`${apiUrl}/api/BorrowRequest/getAllItemToUser/${currentUser.UserId}`);
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

//   const handleExpandClick = (requestId) => {
//     setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
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

//   const pendingRequests = data.filter(row => row.requestStatus === 0);
//   const processedRequests = data.filter(row => row.requestStatus !== 0);

//   if (error) return <Typography color="error">Error: {error.message}</Typography>;

//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <Grid container justifyContent="center">
//           <Grid item xs={12} sm={10} md={8}>
//             <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
//               <IconButton onClick={refreshRequests} aria-label="refresh">
//                 {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
//               </IconButton>
//               <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell align="center">מחיקת בקשה</TableCell>
//                       <TableCell align="center">פרטים נוספים</TableCell> 
//                       <TableCell align="center">עד תאריך</TableCell>
//                       <TableCell align="center">מתאריך</TableCell>       
//                       {/* <TableCell
//                         align="center"
//                         sx={{ display: { md: 'table-cell', sm: 'none' } }}
//                         sortDirection={orderBy === 'approvalDate' ? order : false}
//                       >
//                         תאריך אישור
//                       </TableCell> */}
//                       <TableCell
//                         align="center"
//                         sx={{ display: { sm: 'table-cell', xs: 'none' } }}
//                         sortDirection={orderBy === 'requestDate' ? order : false}
//                       >
//                         תאריך בקשה
//                       </TableCell>
//                       <TableCell align="center" sortDirection={orderBy === 'status' ? order : false}>
//                         סטוטס
//                       </TableCell>
//                       <TableCell align="center" sortDirection={orderBy === 'title' ? order : false}>
//                         שם המוצר
//                       </TableCell>
//                       <TableCell
//                         align="center"
//                         sx={{ display: { sm: 'table-cell', xs: 'none' } }}
//                         sortDirection={orderBy === 'requestId' ? order : false}
//                       >
//                         בקשה מספר
//                       </TableCell>
                     
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {loadData && pendingRequests.map((row, index) => (
//                       <React.Fragment key={row.requestId}>
//                         <TableRow>
//                           <TableCell align="center">
//                             {row.requestStatus === 0 && (
//                               <IconButton
//                                 aria-label="delete"
//                                 onClick={() => handleDelete(row.requestId)}
//                                 style={{ color: '#0D1E46' }} 
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             )}
//                           </TableCell>
//                           <TableCell align="center">
//                             <IconButton
//                               onClick={() => handleExpandClick(row.requestId)}
//                               aria-label="expand row"
//                             >
//                               {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                             </IconButton>
//                           </TableCell>         
//                           <TableCell align="center">
//                             {row.requestStatus === 1 ? new Date(row.untilDate).toLocaleString() : '-'}
//                           </TableCell>
//                           <TableCell align="center">
//                             {row.requestStatus === 1 ? new Date(row.fromDate).toLocaleString() : '-'}
//                           </TableCell>
//                           {/* <TableCell align="center" sx={{ display: { md: 'table-cell', sm: 'none' } }}>
//                             {row.approvalDate ? (
//                               new Date(row.approvalDate).toLocaleString()
//                             ) : (
//                               <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                 ממתין לאישור
//                               </span>
//                             )}
//                           </TableCell> */}
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                             {new Date(row.requestDate).toLocaleString()}
//                           </TableCell>
//                           <TableCell align="center">
//                             <Button onClick={() => setShowIcons(!showIcons)}>
//                               {getStatusDisplay(row.requestStatus)}
//                             </Button>
//                           </TableCell>
//                           <TableCell align="center">
//                             {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                           </TableCell>
//                           <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                             {index + 1}
//                           </TableCell>
                         
//                         </TableRow>
//                         {itemList && (
//                           <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
//                         )}
//                       </React.Fragment>
//                     ))}
//                     {processedRequests.length > 0 && (
//                       <>
//                         <TableRow>
//                           <TableCell colSpan={9}>
//                             <Divider sx={{ borderColor: 'blue', borderStyle: 'dashed' }} />
//                           </TableCell>
//                         </TableRow>
//                         {processedRequests.map((row, index) => (
//                           <React.Fragment key={row.requestId}>
//                             <TableRow style={{ backgroundColor: '#0011' }}>
//                               <TableCell align="center">
//                                 {row.requestStatus === 0 && (
//                                   <IconButton
//                                     aria-label="delete"
//                                     onClick={() => handleDelete(row.requestId)}
//                                     style={{ color: '#0D1E46' }} 
//                                   >
//                                     <DeleteIcon />
//                                   </IconButton>
//                                 )}
//                               </TableCell>
//                               <TableCell align="center">
//                                 <IconButton
//                                   onClick={() => handleExpandClick(row.requestId)}
//                                   aria-label="expand row"
//                                 >
//                                   {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                                 </IconButton>
//                               </TableCell>
//                               <TableCell align="center">
//                                 {row.requestStatus === 1 ? new Date(row.untilDate).toLocaleString() : '-'}
//                               </TableCell>
//                               <TableCell align="center">
//                                 {row.requestStatus === 1 ? new Date(row.fromDate).toLocaleString() : '-'}
//                               </TableCell>                             
//                               {/* <TableCell align="center" sx={{ display: { md: 'table-cell', sm: 'none' } }}>
//                                 {row.approvalDate ? (
//                                   new Date(row.approvalDate).toLocaleString()
//                                 ) : (
//                                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                     ממתין לאישור
//                                   </span>
//                                 )}
//                               </TableCell> */}
//                               <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                                 {new Date(row.requestDate).toLocaleString()}
//                               </TableCell>
//                               <TableCell align="center">
//                                 <Button onClick={() => setShowIcons(!showIcons)}>
//                                   {getStatusDisplay(row.requestStatus)}
//                                 </Button>
//                               </TableCell>
//                               <TableCell align="center">
//                                 {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                               </TableCell>
//                               <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                                 {index + 1}
//                               </TableCell>
                            
//                             </TableRow>
//                             {itemList && (
//                               <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
//                             )}
//                           </React.Fragment>
//                         ))}
//                       </>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         </Grid>
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
// } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import RequestDetails from './RequestDetails';
// import { useDispatch, useSelector } from 'react-redux';
// import { FillData } from '../../redux/actions/itemAction';
// import stylisRTLPlugin from 'stylis-plugin-rtl';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';


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
//   const dispatch = useDispatch();
//   const [data, setData] = useState([]);
//   const [expandedRequestId, setExpandedRequestId] = useState(null);
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('requestId');
//   const [loading, setLoading] = useState(false);
//   const [loadData, setLoadData] = useState(false);
//   const [error, setError] = useState(null);
//   const [showIcons, setShowIcons] = useState(true);
//   const currentUser = useSelector(state => state.userReducer.currentUser);
//   const itemList = useSelector(state => state.itemReducer.itemList);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response1 = await axios.get(`http://localhost:7118/api/BorrowRequest/borrow-requests/${currentUser.UserId}`);
//         const data1 = response1.data;
//         setData(data1);
//         setLoadData(true);

//         const response2 = await axios.get(`${apiUrl}/api/BorrowRequest/getAllItemToUser/${currentUser.UserId}`);
//         const data2 = response2.data;

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

//   const handleExpandClick = (requestId) => {
//     setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
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

//   if (error) return <Typography color="error">Error: {error.message}</Typography>;

//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <Grid container justifyContent="center">
//           <Grid item xs={12} sm={10} md={8}>
//             <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
//               <IconButton onClick={refreshRequests} aria-label="refresh">
//                 {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
//               </IconButton>
//               <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Table sx={{ minWidth: 650 }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell align="center">מחיקת בקשה</TableCell>
//                       <TableCell align="center">פרטים נוספים</TableCell>
//                       <TableCell
//                         align="center"
//                         sx={{ display: { md: 'table-cell', sm: 'none' } }}
//                         sortDirection={orderBy === 'approvalDate' ? order : false}
//                       >
//                         תאריך אישור
//                       </TableCell>
//                       <TableCell
//                         align="center"
//                         sx={{ display: { sm: 'table-cell', xs: 'none' } }}
//                         sortDirection={orderBy === 'requestDate' ? order : false}
//                       >
//                         תאריך בקשה
//                       </TableCell>
//                       <TableCell align="center" sortDirection={orderBy === 'status' ? order : false}>
//                         סטוטס
//                       </TableCell>
//                       <TableCell align="center" sortDirection={orderBy === 'title' ? order : false}>
//                         שם המוצר
//                       </TableCell>
//                       <TableCell
//                         align="center"
//                         sx={{ display: { sm: 'table-cell', xs: 'none' } }}
//                         sortDirection={orderBy === 'requestId' ? order : false}
//                       >
//                         בקשה מספר
//                       </TableCell>

//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {loadData &&
//                       data.map((row, index) => (
//                         <React.Fragment key={row.requestId}>
//                           <TableRow>
//                             <TableCell align="center">
//                               <IconButton
//                                 aria-label="delete"
//                                 onClick={() => handleDelete(row.requestId)}
//                                 style={{ color: '#0D1E46' }}
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </TableCell>
//                             <TableCell align="center">
//                               <IconButton
//                                 onClick={() => handleExpandClick(row.requestId)}
//                                 aria-label="expand row"
//                               >
//                                 {expandedRequestId === row.requestId ? <ExpandLess /> : <ExpandMore />}
//                               </IconButton>
//                             </TableCell>
//                             <TableCell align="center" sx={{ display: { md: 'table-cell', sm: 'none' } }}>
//                               {row.approvalDate ? (
//                                 new Date(row.approvalDate).toLocaleString()
//                               ) : (
//                                 <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                   ממתין לאישור
//                                 </span>
//                               )}
//                             </TableCell>
//                             <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                               {new Date(row.requestDate).toLocaleString()}
//                             </TableCell>
//                             <TableCell align="center">
//                               <Button onClick={() => setShowIcons(!showIcons)}>
//                                 {getStatusDisplay(row.requestStatus)}
//                               </Button>
//                             </TableCell>
//                             <TableCell align="center">
//                               {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
//                             </TableCell>
//                             <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
//                               {index + 1}
//                             </TableCell>
//                           </TableRow>
//                           {itemList && (
//                             <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
//                           )}
//                         </React.Fragment>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         </Grid>
//       </ThemeProvider>
//     </CacheProvider>
//   );
// };

// export default StatusListView;
