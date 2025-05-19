import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router

const NotFoundPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      backgroundColor: '#f0f0f0' // A light background
    }}>
      <h1 style={{ fontSize: '4em', color: '#e74c3c', marginBottom: '0.2em' }}>404</h1>
      <p style={{ fontSize: '1.5em', color: '#333', marginBottom: '1em' }}>
        Oops! The page you're looking for can't be found.
      </p>
      <Link to="/" style={{ 
        padding: '0.5em 1em', 
        backgroundColor: '#3498db', // A friendly blue
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        ':hover': {  // Inline pseudo-selector styling (won't work directly, see note below)
          backgroundColor: '#2980b9' 
        }
      }}>
        Go back to Home
      </Link>
        <p style={{ marginTop: '1em', color: '#777' }}>
          If you think this is a mistake, please contact support.
        </p>
    </div>
  );
};

export default NotFoundPage;