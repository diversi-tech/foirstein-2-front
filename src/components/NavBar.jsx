import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#3f51b5',
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

const StyledLinkButton = styled(Button)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(2),
}));

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledMenuButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </StyledMenuButton>
        <StyledTitle variant="h6">
        📚
        </StyledTitle>
        <StyledLinkButton component={Link} to="/BorrowRequestFile">Borrow Request File</StyledLinkButton>
        <StyledLinkButton component={Link} to="/ItemDetailsDisplay">Item Details Display</StyledLinkButton>
        <StyledLinkButton component={Link} to="/getStatusIcon">StatusListView</StyledLinkButton>
        <StyledLinkButton component={Link} to="/Item">Item</StyledLinkButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
