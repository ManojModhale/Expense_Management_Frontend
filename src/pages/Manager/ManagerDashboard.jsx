import React, { useContext, useEffect, useState, useCallback } from "react";
import { useLocation, Link, Outlet } from "react-router-dom";
import "./ManagerDashboard.css";
import Notification from "../../components/Notification";
import Loader from "../../components/Loader";
import UserNavbar from "../../components/UserNavbar";

const ManagerDashboard = ({ role }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    console.log("inside ManagerDashboard ", role);

    if (loading && location.pathname === "/manager/dashboard") {
        return <Loader message="Loading dashboard data..." />; // Pass message to loader
    }

    // Only display the error if we are on the dashboard path
    if (error && location.pathname === "/manager/dashboard") {
        return (
            <div className="dashboard">
                {/* Make sure Notification can take a message prop, or just use Notification.error directly */}
                <Notification.error message={error} />
            </div>
        );
    }

    const isDashboard = location.pathname === "/manager/dashboard";
    const DashboardContent = () => (
        <div>
            <h1>Manager Dashboard</h1>
            <div className="dashboard-summary">
                {/* <p>Total Expenses: {expenses.length}</p>
        <p>
          Pending: {expenses.filter((e) => e.status === "PENDING").length}
        </p>
        <p>
          Approved: {expenses.filter((e) => e.status === "APPROVED").length}
        </p>
        <p>
          Rejected: {expenses.filter((e) => e.status === "REJECTED").length}
        </p>  */}
            </div>
        </div>
    );

    return (
        <div className="manager-dashboard">
            <UserNavbar role={role} />

            {/* Content Section */}
            <section className="content">
                {isDashboard ? <DashboardContent /> : <Outlet />}
            </section>
        </div>
    );

}
export default ManagerDashboard;