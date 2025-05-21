import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import NotFoundPage from './pages/NotFoundPage';
import Loader from './components/Loader';
import MyExpenseEmp from './pages/Employee/MyExpenseEmp';
import UserProfile from './pages/UserProfile';
import MyExpenseMg from './pages/Manager/MyExpenseMg';
import AllEmployeeExpenses from './pages/Manager/AllEmployeeExpenses';


//import { useContext, useEffect, useState } from 'react';
//import { UserContext } from './services/userContext';

function App() {
  //const {user} =useContext(UserContext);
  //const role = sessionStorage.getItem("role"); // Fetch role from session storage
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);
  console.log("inside App.js ", role);

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage setRole={setRole} />} />
        <Route path='/change-password' element={<ForgotPasswordPage />} />
        <Route path='/*' element={<NotFoundPage />} />
        <Route path='/loader' element={<Loader />} /> {/* this just to test loader is looking like */}

        {/* Employee routes with nested routes */}
        <Route path="/employee/*" element={<EmployeeDashboard role={role} />}>
          <Route path="my-expense" element={<MyExpenseEmp />} />
          <Route path="profile" element={<UserProfile />} />
          {/*<Route path="my-expense1" element={<MyExpense />} /> */}
        </Route>

        {/* Manager dashboard */}
        <Route path="/manager/*" element={<ManagerDashboard role={role} />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="my-expense" element={<MyExpenseMg />} />
          <Route path="employee-expenses" element={<AllEmployeeExpenses />} />
        </Route>
      </Routes>

    </>
  );
}

export default App;
