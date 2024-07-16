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
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RefreshIcon from '@mui/icons-material/Refresh';
import RequestDetails from './RequestDetails';
import { useDispatch, useSelector } from 'react-redux';
import { FillData } from '../../redux/actions/itemAction';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('requestId');
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [error, setError] = useState(null);
  const [showIcons, setShowIcons] = useState(true);
  const currentUser = useSelector(state => state.userReducer.currentUser);
  const itemList = useSelector(state => state.itemReducer.itemList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(`https://localhost:7118/api/BorrowRequest/borrow-requests/${currentUser[0].UserId}`);
        const data1 = await response1.json();
        setData(data1);
        setLoadData(true);

        const response2 = await fetch(`https://localhost:7118/api/BorrowRequest/getAllItemToUser/${currentUser[0].UserId}`);
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
      fetch(`https://localhost:7118/api/BorrowRequest/borrow-requests/${currentUser[0].UserId}`)
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

  const handleExpandClick = (requestId) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const getStatusDisplay = (status) => {
    return showIcons ? getStatusIcon(status, 'icon') : getStatusIcon(status, 'text');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7118/api/BorrowRequest/Delete/${id}`, {
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

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8}>
            <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
              <IconButton onClick={refreshRequests} aria-label="refresh">
                {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
              <TableContainer component={Paper} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">מחיקת בקשה</TableCell>
                      <TableCell align="center">פרטים נוספים</TableCell>
                      <TableCell
                        align="center"
                        sx={{ display: { md: 'table-cell', sm: 'none' } }}
                        sortDirection={orderBy === 'approvalDate' ? order : false}
                      >
                        תאריך אישור
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ display: { sm: 'table-cell', xs: 'none' } }}
                        sortDirection={orderBy === 'requestDate' ? order : false}
                      >
                        תאריך בקשה
                      </TableCell>
                      <TableCell align="center" sortDirection={orderBy === 'status' ? order : false}>
                        סטוטס
                      </TableCell>
                      <TableCell align="center" sortDirection={orderBy === 'title' ? order : false}>
                        שם המוצר
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ display: { sm: 'table-cell', xs: 'none' } }}
                        sortDirection={orderBy === 'requestId' ? order : false}
                      >
                        בקשה מספר
                      </TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadData &&
                      data.map((row, index) => (
                        <React.Fragment key={row.requestId}>
                          <TableRow>
                            <TableCell align="center">
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(row.requestId)}
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
                            <TableCell align="center" sx={{ display: { md: 'table-cell', sm: 'none' } }}>
                              {row.approvalDate ? (
                                new Date(row.approvalDate).toLocaleString()
                              ) : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  ממתין לאישור
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
                              {new Date(row.requestDate).toLocaleString()}
                            </TableCell>
                            <TableCell align="center">
                              <Button onClick={() => setShowIcons(!showIcons)}>
                                {getStatusDisplay(row.requestStatus)}
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              {itemList.find(item => item.id === row.itemId)?.title || 'טוען...'}
                            </TableCell>
                            <TableCell align="center" sx={{ display: { sm: 'table-cell', xs: 'none' } }}>
                              {index + 1}
                            </TableCell>
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
      </ThemeProvider>
    </CacheProvider>
  );
};

export default StatusListView;
