import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginPage.css';
import { loginUser } from '../services/authService';
//import { UserContext } from '../services/userContext';

const LoginPage = ({setRole}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const {updateUser} =useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required.');
      setLoading(false);
      Swal.fire('Validation Error', 'Username and password are required.', 'warning');
      return;
    }

    try {
      const data = await loginUser(username, password);
      Swal.fire('Login Successful', 'Welcome back!', 'success');
      //updateUser(data.user); // Update context with user data

      // Save user data in sessionStorage or localStorage (optional)
      //console.log(data.user.username+" -- "+data.user.role);
      sessionStorage.setItem('username', data.user.username);
      sessionStorage.setItem('role', data.user.role.toUpperCase());
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setRole(data.user.role.toUpperCase());

      if (data.user.role == "EMPLOYEE") {
        navigate('/employee/dashboard'); // Redirect to Employee Dashboard
      } else if (data.user.role == "MANAGER") {
        navigate('/manager/dashboard'); // Redirect to Manager Dashboard
      } else {
        throw new Error('Unrecognized user role.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed.";
      setError(errorMessage);
      console.log(error);
      Swal.fire('Login Failed', errorMessage || 'Invalid credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-image">
          <img src="assets/LoginPage.jpg" alt="Login Illustration" />
        </div>
        <div className="login-form">
          <h2>Sign In to your Workspace</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <div className="forgot-link">
              <a href="/change-password">Forgot Password?</a>
            </div>
            <button className="btn-lg" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <div className="register-link">
            <p>
              Don't have an account? <a href="/register">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
