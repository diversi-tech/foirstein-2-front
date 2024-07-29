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
import {  getUserIdFromTokenid } from '../decipheringToken';

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
    case 0:
      return displayType === 'icon' ? (
        <Tooltip title="נדחה">
          <CancelIcon style={{ color: 'red' }} />
        </Tooltip>
      ) : 'נדחה';
    case 2:
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
  //const currentUser = useSelector(state => state.userReducer.currentUser);
  const itemList = useSelector(state => state.itemReducer.itemList);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const apiUrl = process.env.REACT_APP_SERVER_URL;
  const currentUser = getUserIdFromTokenid();
  
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const fetchData = async () => {
     console.log(currentUser+"currentUser vvvv")
    try {
      console.log(currentUser+"currentUser")
      const response1 = await fetch(`${apiUrl}/api/BorrowRequest/getBorrowRequestsAndApprovals/${currentUser}`);
      const data1 = await response1.json();
      setPendingRequests(data1.borrowRequests);
      setProcessedRequests(data1.borrowApprovalRequests);
      setLoadData(true);

      const response2 = await fetch(`${apiUrl}/api/BorrowRequest/getAllItemToUser/${currentUser}`);
      const data2 = await response2.json();
      dispatch(FillData(data2));
    } catch (error) {
      setError(error);
      setLoadData(false);
    }
  };
  useEffect(() => {


    fetchData();
  }, []);

  const refreshRequests = () => {
    setLoading(true);

    setTimeout(() => {
      fetch(`${apiUrl}/api/BorrowRequest/getBorrowRequestsAndApprovals/${currentUser}`)
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

  const handleExpandClick = (row) => {
    setExpandedRequestId(expandedRequestId === row.requestId ? null : row.requestId);
  };



  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  
  const renderAlert = (row) => {
    const currentDate = new Date();
    const untilDate = new Date(row.untilDate);
    const daysOverdue = Math.floor((currentDate - untilDate) / (1000 * 60 * 60 * 24)); // חישוב מספר הימים שעברו
    const itemTitle = itemList.find(item => item.id === row.itemId)?.title || 'טוען...'; // מציאת שם המוצר

    if (untilDate < currentDate && !row.isReturned && !closedAlerts[row.requestId]) {
      return (
        <Collapse in={!closedAlerts[row.requestId]}>
          <Alert
            severity="error"
            variant="filled"
            style={{ marginBottom: '20px', backgroundColor: '#ffcccc', color: '#b20000', direction: 'rtl' }}
          >
            {` הפריט ${itemTitle} עדיין לא הוחזר. עברו ${daysOverdue} ימים ! . `}
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
              {processedRequests.map((row) => renderAlert(row))}
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

                    {pendingRequests.map((row, index) => (
                      <React.Fragment key={row.requestId} >
                        <TableRow hover sx={{ margin: 0, padding: 0 }}>
                        <TableCell align="center" >
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDialogOpen(row.requestId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleExpandClick(row)}
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
                              <TableCell align="center" >
                                {new Date(row.untilDate).toLocaleDateString('he-IL')}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(row.fromDate).toLocaleDateString('he-IL')}
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center" >
                            <Button onClick={() => setShowIcons(!showIcons)}>
                              {getStatusDisplay(2)}
                            </Button>
                          </TableCell>
                          <TableCell align="center" >
                            {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
                          </TableCell>
                          {isSmallScreen && (
                            <TableCell align="center" sx={{ display: { margin: 0, padding: 0, sm: 'table-cell', xs: 'none' } }}>{index + 1}</TableCell>
                          )}
                        </TableRow>
                        {itemList && (
                          <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow>
                      <TableCell colSpan={isMediumScreen ? 7 : 4} align="center">
                        <Divider sx={{ borderColor: 'blue', borderStyle: 'dashed' }} />
                      </TableCell>
                    </TableRow>
                    {processedRequests.map((row, index) => (
                      <React.Fragment key={row.requestId}>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleExpandClick(row)}
                              aria-label="expand row"
                            >
                              {expandedRequestId === row.requestId ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </IconButton>
                          </TableCell>
                          {/* {isMediumScreen && (
                            <>
                              <TableCell align="center">
                                {new Date(row.untilDate).toLocaleDateString('he-IL')||'-'}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(row.fromDate).toLocaleDateString('he-IL')||'-'}
                              </TableCell>
                            </>
                          )} */}
                          {isMediumScreen && (
                            <>
                              <TableCell align="center">
                                {new Date(row.approvalDate).toLocaleDateString('he-IL')}
                              </TableCell>
                              <TableCell align="center">
                                {new Date(row.requestDate).toLocaleDateString('he-IL')}
                              </TableCell>
                            </>
                          )}

                          <TableCell align="center">
                            <Button onClick={() => setShowIcons(!showIcons)}>
                              {getStatusDisplay(row.requestStatus)}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
                          </TableCell>
                          {isSmallScreen && (
                            <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>{pendingRequests.length + index + 1}</TableCell>
                          )}
                        </TableRow>
                        {itemList && (
                          <RequestDetails request={itemList.find(item => item.id === row.itemId)} expanded={expandedRequestId === row.requestId} />
                        )}
                      </React.Fragment>
                    ))}

                  </TableBody>
                </Table>
              </TableContainer>
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


