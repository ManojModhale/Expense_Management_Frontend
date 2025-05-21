import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllEmployeeExpenses.css'
import { FaUserCircle } from 'react-icons/fa';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Button, IconButton, Typography, Tooltip, CircularProgress } from '@mui/material';
import { CheckCircle, Cancel, Visibility, FilterList, Receipt } from '@mui/icons-material';

const AllEmployeeExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [expandedDescriptionId, setExpandedDescriptionId] = useState(null); // State to manage expanded descriptions
    const navigate = useNavigate();
    const API_BASE_URL = "http://localhost:8181/api";

    useEffect(() => {
        fetchAllEmployeeExpenses();
    }, [activeTab]); // Refetch when tab changes

    const fetchAllEmployeeExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/manager/expenses/allEmployee`, {
                headers: {
                    // Include your JWT token if you've implemented authentication
                    // Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            console.log('response ', response);
            console.log('reponse.data', response.data);
            // Filter expenses based on the active tab
            const filteredExpenses = response.data.filter(expense => {
                if (activeTab === 'pending') return expense.status === 'PENDING';
                if (activeTab === 'approved') return expense.status === 'APPROVED';
                if (activeTab === 'rejected') return expense.status === 'REJECTED';
                return true; // Should not happen with defined tabs
            });
            setExpenses(filteredExpenses);
        } catch (err) {
            console.error('Error fetching employee expenses:', err);
            // Improved error handling to display message from backend if available
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    setError('Failed to fetch expenses: ' + err.response.data);
                } else if (err.response.data.message) {
                    setError('Failed to fetch expenses: ' + err.response.data.message);
                } else {
                    setError('Failed to fetch expenses. An unknown error occurred.');
                }
            } else {
                setError('Failed to fetch expenses. Please check your network connection.');
            }

            // Handle unauthorized/forbidden errors, e.g., redirect to login
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                //navigate('/login'); // Or show a toast message
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (expenseId) => {
        try {
            await axios.put(`${API_BASE_URL}/manager/expense/${expenseId}/approve`, {}, {
                headers: {
                    // Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            alert('Expense approved successfully!');
            fetchAllEmployeeExpenses(); // Re-fetch to update the list
        } catch (err) {
            console.error('Error approving expense:', err);
            alert('Failed to approve expense: ' + (err.response?.data?.message || err.response?.data || err.message));
        }
    };

    const handleReject = async (expenseId) => {
        const reason = prompt('Please enter a reason for rejecting the expense:');
        if (reason) {
            try {
                await axios.put(`${API_BASE_URL}/manager/expense/${expenseId}/reject`, { reason }, {
                    headers: {
                        // Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });
                alert('Expense rejected successfully!');
                fetchAllEmployeeExpenses(); // Re-fetch to update the list
            } catch (err) {
                console.error('Error rejecting expense:', err);
                alert('Failed to reject expense: ' + (err.response?.data?.message || err.response?.data || err.message));
            }
        }
    };

    const renderDescription = (description) => {
        const MAX_DISPLAY_LENGTH = 80; // Character limit
        const tooltipText = description;

        if (!description) {
            return 'N/A';
        }

        if (description.length > MAX_DISPLAY_LENGTH) {
            // Only wrap in Tooltip if description is long
            return (
                <Tooltip title={tooltipText} enterDelay={500} leaveDelay={200} placement="bottom-start" arrow>
                    <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Limit to 2 lines
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal', // Allow text to wrap
                        maxWidth: '250px', // Ensure it respects the column width for truncation
                    }}>
                        {description}
                    </Typography>
                </Tooltip>
            );
        }
        return <Typography variant="body2">{description}</Typography>;
    };
    
    if (loading) return <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />; // Centered loading spinner
    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

    return (
        <div className="all-employee-expenses-container">
            <Typography variant="h4" component="h2" gutterBottom className="page-title">
                All Employee Expenses
            </Typography>
            <Paper className="tabs-container">
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    aria-label="Expense Status Tabs"
                    variant="fullWidth" // Makes tabs take full width
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label={`Pending (${expenses.filter(e => e.status === 'PENDING').length})`} value="pending" />
                    <Tab label={`Approved (${expenses.filter(e => e.status === 'APPROVED').length})`} value="approved" />
                    <Tab label={`Rejected (${expenses.filter(e => e.status === 'REJECTED').length})`} value="rejected" />
                </Tabs>
            </Paper>

            {expenses.length === 0 ? (
                <Typography variant="body1" align="center" className="no-expenses-message">
                    No {activeTab} expenses found.
                </Typography>
            ) : (
                <TableContainer component={Paper} className="table-container">
                    <Table className="expense-table" aria-label="employee expenses table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="th fixed-width-id">ID</TableCell>
                                <TableCell className="th flexible-width-name">Name</TableCell>
                                <TableCell className="th fixed-width-date">Date</TableCell>
                                <TableCell className="th fixed-width-category">Category</TableCell>
                                <TableCell className="th fixed-width-amount" align="left">Amount</TableCell>
                                <TableCell className="th flexible-width-description">Description</TableCell>
                                {/*<TableCell className="th" align="right">Reimbursement</TableCell>  Aligning header to match data */}
                                <TableCell className="th fixed-width-receipt" align="center">Receipt</TableCell>
                                <TableCell className="th flexible-width-requester">Requester</TableCell>
                                {activeTab === 'rejected' && <TableCell className="th flexible-width-rejection-reason">Rejection Reason</TableCell>}
                                <TableCell className="th fixed-width-actions actions-header">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id} className="table-row">
                                    {/* MUI TableCell for data (td) */}
                                     <TableCell className="td fixed-width-id">{expense.id}</TableCell>
                                    <TableCell className="td flexible-width-name">{expense.name}</TableCell>{/**/}
                                    <TableCell className="td fixed-width-date">{expense.date}</TableCell>
                                    <TableCell className="td fixed-width-category">{expense.category}</TableCell>
                                    <TableCell className="td fixed-width-amount">₹{expense.amount ? expense.amount.toFixed(2) : '0.00'}</TableCell>
                                    <TableCell className="td flexible-width-description">
                                        {renderDescription(expense.description)}
                                    </TableCell>
                                    {/*<TableCell className="td">${expense.amount ? expense.amount.toFixed(2) : '0.00'}</TableCell>  Reimbursement */}
                                     <TableCell className="td fixed-width-receipt" align="center">
                                        {expense.receiptUrl ? (
                                            <Tooltip title="View Receipt">
                                                <IconButton href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" color="primary">
                                                    <Receipt />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="No Receipt Available">
                                                <IconButton disabled>
                                                    <Receipt color="disabled" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell className="td flexible-width-requester">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaUserCircle size={24} color="#6c757d" />
                                            <Typography variant="body2" component="span">
                                                {expense.requesterFirstName} {expense.requesterLastName}
                                            </Typography>
                                        </div>
                                    </TableCell>
                                    {activeTab === 'rejected' && (
                                        <TableCell className="td flexible-width-rejection-reason">{expense.rejectionReason || 'N/A'}</TableCell>
                                    )}
                                    <TableCell className="td fixed-width-actions action-buttons-cell">
                                        {expense.status === 'PENDING' && (
                                            <div className="action-buttons-container">
                                                <Tooltip title="Approve">
                                                    <IconButton className="action-button approve" onClick={() => handleApprove(expense.id)}>
                                                        <CheckCircle fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton className="action-button reject" onClick={() => handleReject(expense.id)}>
                                                        <Cancel fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        )}
                                        {expense.status !== 'PENDING' && (
                                            <Typography variant="caption" className="status-text">
                                                {expense.status}
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default AllEmployeeExpenses;