import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Box } from "@mui/material";
import { Wallet, Menu as MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(to right, #2c3e50, #4ca1af)" }} id="home" >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo and Title */}
        <div className="logo-container" style={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Wallet size={30} />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginLeft: "0.5rem" }}>
            ExpenseTrack
          </Typography>
        </div>

        {/* Desktop Menu */}
        <div className="nav-links hidden md:flex gap-4">
          <Button color="inherit" style={{ color: 'white',textDecorationLine: 'none', fontSize:'1.1rem' }} component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" >
            <a href="#features" style={{ color: 'white',textDecorationLine: 'none', fontSize:'1.1rem' }}>Features</a>
          </Button>
          <Button color="inherit" >
           <a href="#about" style={{ color: 'white',textDecorationLine: 'none', fontSize:'1.1rem' }}>About Us</a>
          </Button>
          <Button color="inherit">
           <a href="#contact" style={{ color: 'white',textDecorationLine: 'none', fontSize:'1.1rem' }}>Contact</a>
          </Button>
          <Link to="/register">
            <Button  style={{ color: 'white',textDecorationLine: 'none', fontSize:'1.1rem' }}>
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="contained"
              color="primary"
              sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
                fontSize:"1.1rem",
              }}
            >
              Log In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="mobile-menu md:hidden">
          <IconButton size="large" aria-label="menu" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </div>
      </Toolbar>

      {/* Mobile Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: "#2c3e50",
            color: "white",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/">
          Home
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <a href="#features" style={{ color: 'white',textDecorationLine: 'none' }}>Features</a>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <a href="#about" style={{ color: 'white',textDecorationLine: 'none' }}>About Us</a>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <a href="#contact" style={{ color: 'white',textDecorationLine: 'none' }}>Contact</a>
        </MenuItem>
        <Link to="/register"><MenuItem onClick={handleMenuClose} >
          Sign Up
        </MenuItem></Link>
        <Link to="/login"><MenuItem
          onClick={handleMenuClose}
          sx={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "white",
          }}
        > Log In
        </MenuItem></Link>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
