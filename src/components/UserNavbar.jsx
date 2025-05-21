import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './UserNavbar.css';
import Swal from 'sweetalert2';

function UserNavbar({ role }) {
  const navigate = useNavigate();
  //const { user, updateUser } = useContext(UserContext);
  console.log("inside UserNavbar ", role);

  /*if (!role) {
    return null; // Prevent rendering if user is not logged in
  }*/

  const handleLogout = () => {

    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the application!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if(!result.isConfirmed) return;

      sessionStorage.removeItem('role');
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("user");
      sessionStorage.clear();
      Swal.fire("Logged Out!", "You have been logged out.", "success").then(
        () => {
          navigate("/"); // Redirect to login page
        }
      );
    });
    /*
    if (result.isConfirmed) {
      // Clear session or authentication token
      sessionStorage.removeItem('role');
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("user");
      sessionStorage.clear();
      //updateUser(null);
      Swal.fire("Logged Out!", "You have been logged out.", "success").then(
        () => {
          navigate("/login"); // Redirect to login page
        }
      );
    } else {
      // Navigate back to dashboard if the user cancels
      if (role === 'EMPLOYEE') {
        navigate("/employee/dashboard");
      } else if (role === 'MANAGER') {
        navigate("/manager/dashboard");
      } else {
        navigate("/");
      }
    }*/
  };

  const renderNavLinks = () => {
    if (role === 'EMPLOYEE') {
      return (
        <>
          <li className="nav-item">
            <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink to="/employee/add-expense" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Expense</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/employee/expenses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Expenses List</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/employee/my-expense1" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Expenses 1</NavLink>
          </li> */}
          <li className="nav-item">
            <NavLink to="/employee/my-expense" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Expenses</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/employee/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
          </li>
        </>
      );
    } else if (role === 'MANAGER') {
      return (
        <>
          <li className="nav-item">
            <NavLink to="/manager/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Manager Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/manager/my-expense" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Expenses</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/manager/employee-expenses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Employee Expenses</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/manager/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link>Expense Track</Link>
        {/* <Link to={role === 'EMPLOYEE' ? '/employee/dashboard' : role === 'MANAGER' ? '/manager/dashboard' : '/'}>
            Expense Track
        </Link> */}
      </div>
      <ul className="navbar-nav">
        {role ? (
          <>
            {renderNavLinks()}
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default UserNavbar;
