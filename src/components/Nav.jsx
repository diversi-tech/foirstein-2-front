
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar, Typography, Button, Popper, Paper, ClickAwayListener, Grow, MenuList } from '@mui/material';
import { styled } from '@mui/system';
import { getRoleFromToken, getUserNameFromToken, getCookie } from './decipheringToken';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  direction: 'rtl',
}));

const StyledLink = styled(Link)(({ theme, active }) => ({
  color: active ? '#FFD700' : '#FFFFFF',
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 0,
  '&:hover': {
    color: '#FFD700',
  },
}));

const AdminButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#FFD700' : '#FFFFFF',
  marginLeft: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 0,
  '&:hover': {
    color: '#FFD700',
  },
}));

const NavBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0D1E46',
  borderRadius: 0,
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: theme.zIndex.appBar + 1,
}));

const ToolbarOffset = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const RightSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '36px',
  marginRight: '10px',
});

const LeftSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginRight: 'auto',
});

const GreetingText = styled(Typography)(({ theme }) => ({
  color: '#FFFFFF',
}));

const getGreetingMessage = () => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return 'בוקר טוב';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'צהרים טובים';
  } else {
    return 'ערב טוב';
  }
};

export const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('jwt'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [libarianAnchorEl, setlibarianAnchorEl] = useState(null);
  const [islibarianMenuOpen, setIslibarianMenuOpen] = useState(false);
  const greetingMessage = getGreetingMessage();
  const role = isLoggedIn ? getRoleFromToken() : null;
  const userName = isLoggedIn ? getUserNameFromToken() : null;

  useEffect(() => {
    if (!isLoggedIn && (location.pathname === '/UserManagementComponent' || location.pathname === '/ActivityLog' || location.pathname === '/changePermission' || location.pathname === '/Charts')) {
      navigate('/home');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {
    setIsLoggedIn(!!getCookie('jwt'));
  }, [location.pathname]);

  const handleLogout = () => {
    document.cookie = `jwt=; path=/; domain=.foirstein.diversitech.co.il; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    setIsLoggedIn(false);
    navigate('/home');
    console.log('Logging out...');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClickToRequestStatus = () => {
    navigate('/StatusListView');
        console.log("StatusListView")

    handleMenuClose();
  }; 
  
  const handleProfileClickSavedItemsScreen = () => {
    navigate('/SavedItemsScreen');
    handleMenuClose();
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleAdminMenuOpen = (event) => {
    setAdminAnchorEl(event.currentTarget);
    setIsAdminMenuOpen(true);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
    setIsAdminMenuOpen(false);
  };

  const handleLibarianMenuOpen = (event) => {
    setlibarianAnchorEl(event.currentTarget);
    setIslibarianMenuOpen(true);
  };
  const handleLibarianMenuClose = () => {
    setlibarianAnchorEl(null);
    setIslibarianMenuOpen(false);
  };

  const renderUserAvatar = (name) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return '';
  };

  return (
    <Root>
      <NavBar position="fixed">
        <Toolbar>
          <RightSection>
            <img src="/bookshelf.png" alt="Bookshelf Icon" style={{ height: '24px', marginRight: 'auto' }} />
            <Typography
              variant="body1"
              style={{ color: '#FFFFFF', marginLeft: '4px', fontWeight: 'bold' }}
            >
              מרחבית
            </Typography>
          </RightSection>
          <StyledLink to="/homePage" active={location.pathname === '/homePage' || location.pathname === '/login/homePage' || location.pathname === '/homePage'}>
            דף הבית
          </StyledLink>
          {!isLoggedIn && (
            <StyledLink to="/login" active={location.pathname === '/login' || location.pathname === '/login/security-question/reset-password/password-reset-success/login'}>
              התחברות
            </StyledLink>
          )}
          {isLoggedIn && (
            <StyledLink to="/search" active={location.pathname === '/SearchAppBar'}>
              חיפוש
            </StyledLink>)
            
          }
          {role === 'Admin' && (
            <>
              <AdminButton
                onMouseEnter={handleAdminMenuOpen}
                onMouseLeave={handleAdminMenuClose}
                active={isAdminMenuOpen || ['/ActivityLog', '/changePermission', '/Charts', '/ManagerDashboard'].includes(location.pathname)}
                ref={(node) => {
                  setAdminAnchorEl(node);
                }}
              >
                הרשאות מנהל
              </AdminButton>
              <Popper
                open={isAdminMenuOpen}
                anchorEl={adminAnchorEl}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper onMouseEnter={handleAdminMenuOpen} onMouseLeave={handleAdminMenuClose}>
                      <ClickAwayListener onClickAway={handleAdminMenuClose}>
                        <MenuList autoFocusItem={isAdminMenuOpen} id="menu-list-grow">
                          {/* <MenuItem onClick={() => navigate('/SearchAppBar')}> חיפוש</MenuItem> */}
                          <MenuItem onClick={() => navigate('/ActivityLog')}>יומן פעילות</MenuItem>
                          <MenuItem onClick={() => navigate('/changePermission')}>שינוי הרשאות</MenuItem>
                          <MenuItem onClick={() => navigate('/Charts')}>גרפים</MenuItem>
                          <MenuItem onClick={() => navigate('/ManagerDashboard')}>דוחות</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          )}
     {(role === 'Librarian'||role === 'Admin') && (
                      <>
                        <StyledLink to="/UserManagementComponent" active={location.pathname === '/UserManagementComponent'}>
                             ניהול משתמשים
                       </StyledLink>
                       <AdminButton
                onMouseEnter={handleLibarianMenuOpen}
                onMouseLeave={handleLibarianMenuClose}
                active={islibarianMenuOpen || ['/items', '/itemsPendingApproval', '/studentRequest', ,'/tag-list'].includes(location.pathname)}
                ref={(node) => {
                  setlibarianAnchorEl(node);
                }}
              >
                 אזור ספרנית
              </AdminButton>
              <Popper
                open={islibarianMenuOpen}
                anchorEl={libarianAnchorEl}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper onMouseEnter={handleLibarianMenuOpen} onMouseLeave={handleLibarianMenuClose}>
                      <ClickAwayListener onClickAway={handleLibarianMenuClose}>
                        <MenuList autoFocusItem={islibarianMenuOpen} id="menu-list-grow">
                          <MenuItem onClick={() => navigate('/items')}>כל הפריטים</MenuItem>
                          <MenuItem onClick={() => navigate('/itemsPendingApproval')}>ממתינים לאישור </MenuItem>
                          <MenuItem onClick={() => navigate('/studentRequest')}>בקשות של תלמידות</MenuItem>
                          <MenuItem onClick={() => navigate('/tag-list')}>ניהול תגיות</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
                    </>
          )}
          <LeftSection>
            {isLoggedIn ? (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <Avatar>{renderUserAvatar(userName)}</Avatar>
                </IconButton>
                <GreetingText variant="body1">
                  {greetingMessage} {userName}
                </GreetingText>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleProfileClick}>ניהול חשבון</MenuItem>
                  <MenuItem onClick={handleProfileClickToRequestStatus}>רשימת השאלות</MenuItem>
                  <MenuItem onClick={handleProfileClickSavedItemsScreen}>מאגר אישי </MenuItem>
                  <MenuItem onClick={handleLogout}>התנתקות</MenuItem>
                </Menu>
              </>
            ) : (
              <GreetingText variant="body1">לא מחובר</GreetingText>
            )}
          </LeftSection>
        </Toolbar>
      </NavBar>
      <ToolbarOffset />
    </Root>
  );
};
