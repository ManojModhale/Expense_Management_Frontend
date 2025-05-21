import React, { useContext, useEffect, useState, useCallback } from "react";
import { useLocation, Link, Outlet } from "react-router-dom";
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";
import "./EmployeeDashboard.css";
import { getExpensesByEmployee } from "../../services/expenseService";
import UserNavbar from "../../components/UserNavbar";
import { AddCircleOutline, InfoOutlined, WarningAmberOutlined, CheckCircleOutline, AccessTimeOutlined, PaymentOutlined } from "@mui/icons-material";
import { Button, CircularProgress, Divider, List, ListItem, ListItemText, Paper, Typography } from "@mui/material"; // Import Material-UI components
import { PieChart, Pie, Cell, Tooltip } from "recharts"; 
//import { UserContext } from "../../services/userContext";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#83a6ed", "#8dd1e1"]; // Define some colors

const EmployeeDashboard = ({ role }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  // const { user } = useContext(UserContext);
  //const role = user?.role;
  //const username = user?.username;
  console.log("inside EmployeeDashboard ", role);

  // Memoize fetchExpenses using useCallback to prevent unnecessary re-creations
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const username = sessionStorage.getItem("username");
      if (!username) {
        setError("Employee not logged in.");
        Notification.error("Employee not logged in.");
        return;
      }
      const response = await getExpensesByEmployee(username);
      setExpenses(response || []);
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setError("Failed to load expenses.");
      Notification.error("Failed to load expenses.");
      setExpenses([]); // Initialize expenses as empty array on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies for useCallback, as it relies on state setters

  useEffect(() => {
    // Only fetch if the current path is the dashboard path
    if (location.pathname === "/employee/dashboard") {
      fetchExpenses();
    }
    // Dependency on location.pathname means this useEffect runs whenever the path changes
  }, [location.pathname, fetchExpenses]); // Added fetchExpenses as a dependency for useEffect

  // ... rest of your component remains the same

  if (loading && location.pathname === "/employee/dashboard") {
    return <Loader message="Loading dashboard data..." />; // Pass message to loader
  }

  // Only display the error if we are on the dashboard path
  if (error && location.pathname === "/employee/dashboard") {
    return (
      <div className="dashboard">
        {/* Make sure Notification can take a message prop, or just use Notification.error directly */}
        <Notification.error message={error} />
      </div>
    );
  }

  const isDashboard = location.pathname === "/employee/dashboard";

  const DashboardContent = () => {
    const pendingExpenses = expenses.filter((e) => e.status === "PENDING");
    const approvedExpenses = expenses.filter((e) => e.status === "APPROVED");
    const rejectedExpenses = expenses.filter((e) => e.status === "REJECTED");
    const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3); // Top 3

   // Prepare data for the expense category chart
    const categoryData = expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const pieChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    return (
      <div className="dashboard-main-content">
        <Typography variant="h4" component="h1" gutterBottom className="dashboard-title">
          Welcome to Your Employee Dashboard
        </Typography>

        {/* My Tasks Section */}
        <Paper elevation={2} className="dashboard-section my-tasks">
          <Typography variant="h5" component="h2" gutterBottom className="section-header">
            Expense Summary
          </Typography>
          <div className="task-cards-container">
            <div className="task-card pending-approval">
              <AccessTimeOutlined fontSize="large" />
              <Typography variant="h5">{pendingExpenses.length}</Typography>
              <Typography variant="subtitle1">Pending</Typography>
            </div>
            <div className="task-card review-required">
              <WarningAmberOutlined fontSize="large" />
              <Typography variant="h5">{rejectedExpenses.length}</Typography>
              <Typography variant="subtitle1">Rejected</Typography>
            </div>
            <div className="task-card approved-expenses">
              <CheckCircleOutline fontSize="large" />
              <Typography variant="h5">{approvedExpenses.length}</Typography>
              <Typography variant="subtitle1">Approved</Typography>
            </div>
          </div>
        </Paper>

       {/* Recent Expenses and Category Chart */}
        <div className="dashboard-row">
          {/* Recent Expense Activity */}
          {recentExpenses.length > 0 && (
            <Paper elevation={2} className="dashboard-section recent-activity-card">
              <Typography variant="h5" component="h2" className="section-header" gutterBottom style={{ textAlign: 'center' }}>
                Recent Expenses
              </Typography>
              <List dense style={{ width: '100%' }}>
                {recentExpenses.map((expense) => (
                  <ListItem key={expense.id} className="recent-list-item" style={{ justifyContent: 'center', padding: '8px 16px' }}>
                    <ListItemText
                      primary={`${expense.category}: ₹${
                        expense.amount ? expense.amount.toFixed(2) : "0.00"
                      }`}
                      secondary={`Date: ${expense.date} | Status: ${expense.status}`}
                      style={{ textAlign: 'center' }}
                    />
                  </ListItem>
                ))}
              </List>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button component={Link} to="/employee/my-expense" variant="outlined" color="primary">
                  View All Expenses
                </Button>
              </div>
            </Paper>
          )}

          {/* Expense Category Chart */}
          <Paper elevation={2} className="dashboard-section expense-category-chart">
            <Typography variant="h5" component="h2" className="section-header" gutterBottom style={{ textAlign: 'center' }}>
              Expense Categories
            </Typography>
            {pieChartData.length > 0 ? (
              <div className="pie-chart-container">
              <PieChart width={250} height={250}> 
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="pie-chart-legend">
                  {pieChartData.map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <Typography variant="body2">{entry.name}</Typography>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', marginTop: 16 }}>
                No expense data available for chart.
              </Typography>
            )}
          </Paper>
        </div>

        {/* Announcements and Guidelines */}
        <Paper elevation={2} className="dashboard-section announcements">
          <Typography variant="h5" component="h2" className="section-header" gutterBottom style={{ textAlign: 'center' }}>
            Announcements & Guidelines
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <div className="centered-content">
            <Typography variant="subtitle1" className="announcement-title">
              📢 Important System Maintenance 📢
            </Typography>
            <Typography variant="body2" className="announcement-content">
              Please be advised that the expense management system will undergo scheduled maintenance on May 22nd, 2025, from 10:00 PM to 12:00 AM IST. During this time, the system will be temporarily unavailable. We apologize for any inconvenience this may cause.
            </Typography>
            <Divider sx={{ color: "primary.main", my: 1 }} >Expense Announcements</Divider>
            <Typography variant="subtitle1" style={{textAlign: 'left'}} className="guideline-title">
              Expense Reporting Guidelines <span style={{ fontSize: '0.8em', color: '#888' }}>(Last Updated: {new Date().toLocaleDateString()})</span>
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="🏷️ Always categorize your expenses accurately using the provided dropdown menu." />
              </ListItem>
              <ListItem>
                <ListItemText primary="🧾 Ensure all submitted receipts are clear, legible, and include the date, vendor, and amount." />
              </ListItem>
              <ListItem>
                <ListItemText primary="✍️ Provide a brief but clear description for each expense item in the notes field." />
              </ListItem>
              <ListItem>
                <ListItemText primary="💰 For expenses exceeding ₹100, please attach any supporting documentation or approval emails." />
              </ListItem>
              <ListItem>
                <ListItemText primary="⏰ Submit your expense reports within 5 business days of incurring the expense to ensure timely processing." />
              </ListItem>
            </List>
            {/* <Button component={Link} to="/employee/expense-policy" size="small" color="primary" variant="outlined">
              View Full Expense Policy
            </Button> */}
          </div>
          {/* Resources & Policies Section */}
        <div className="dashboard-section policy-links">
          <Typography variant="h6" component="h2" gutterBottom className="guideline-title">
            Resources & Policies : 
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText>
                <Link to="/employee/expense-policy">Company Expense Policy</Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link to="/employee/faq">Expense Management FAQ</Link>
              </ListItemText>
            </ListItem>
            {/* Add more links as needed */}
          </List>
          </div>
        </Paper>
      </div>
    );
  };

  return (
    <div className="employee-dashboard">
      <UserNavbar role={role} />

      <section className="content">
        {isDashboard ? <DashboardContent /> : <Outlet />}
      </section>
    </div>
  );
};

export default EmployeeDashboard;
