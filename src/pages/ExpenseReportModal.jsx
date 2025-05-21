import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalTitle, ModalFooter, Button, Form, FormLabel as Label, FormControl as Input } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';
import { Typography } from "@mui/material";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0055'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
                <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>{data.name || data.category}</Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>Amount: ₹{data.value.toFixed(2)}</Typography>
            </div>
        );
    }
    return null;
};

const ExpenseReportModal = ({ isOpen, onClose, expenses }) => {
    const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'weekly'
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const calculateReportData = (data, type, start, end) => {
        let filtered = data;

        // Apply date range filter first
        if (start && end) {
            const sDate = new Date(start + 'T00:00:00');
            const eDate = new Date(end + 'T23:59:59');
            filtered = data.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= sDate && expenseDate <= eDate;
            });
        } else if (start) {
            const sDate = new Date(start + 'T00:00:00');
            filtered = data.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= sDate;
            });
        } else if (end) {
            const eDate = new Date(end + 'T23:59:59');
            filtered = data.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate <= eDate;
            });
        }

        setFilteredExpenses(filtered);

        const totals = {};
        if (type === 'category') {
            filtered.forEach(expense => {
                totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
            });
            return Object.entries(totals).map(([category, value]) => ({ name: category, value }));
        } else if (type === 'monthly') {
            filtered.forEach(expense => {
                const date = new Date(expense.date);
                const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                totals[monthYear] = (totals[monthYear] || 0) + expense.amount;
            });
            return Object.entries(totals)
                .map(([monthYear, value]) => ({ name: monthYear, value }))
                .sort((a, b) => a.name.localeCompare(b.name));
        } else if (type === 'weekly') {
            filtered.forEach(expense => {
                const date = new Date(expense.date);
                const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
                const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday of the current week
                const mondayOfWeek = new Date(date.setDate(diff));
                const weekString = `${mondayOfWeek.getFullYear()}-W${Math.ceil((mondayOfWeek.getMonth() * 30 + mondayOfWeek.getDate()) / 7)}`; // Simplified week number
                totals[weekString] = (totals[weekString] || 0) + expense.amount;
            });
            return Object.entries(totals)
                .map(([week, value]) => ({ name: week, value }))
                .sort((a, b) => a.name.localeCompare(b.name));
        }
        return [];
    };

    useEffect(() => {
        setChartData(calculateReportData(expenses, 'category', startDate, endDate)); // Default to category on load
    }, [expenses, startDate, endDate]);

    const handleReportTypeChange = (type) => {
        setReportType(type);
        if (type === 'monthly' || type === 'weekly') {
            setChartData(calculateReportData(expenses, type, startDate, endDate));
        } else { // Assuming 'category' is the default for pie chart
            setChartData(calculateReportData(expenses, 'category', startDate, endDate));
        }
    };

    const handleDateChange = () => {
        setChartData(calculateReportData(expenses, reportType, startDate, endDate));
    };

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <Modal show={isOpen} onHide={onClose} size="xl">
            <ModalHeader closeButton>
                <ModalTitle>Expense Report</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <Label htmlFor="reportStartDate" className="date-label">From:</Label>
                        <Input
                            id="reportStartDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            onBlur={handleDateChange}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Label htmlFor="reportEndDate" className="date-label">To:</Label>
                        <Input
                            id="reportEndDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            onBlur={handleDateChange}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={reportType === 'category' ? 'primary' : 'outline-primary'}
                            onClick={() => handleReportTypeChange('category')}
                        >
                            By Category
                        </Button>
                        <Button
                            variant={reportType === 'monthly' ? 'primary' : 'outline-primary'}
                            onClick={() => handleReportTypeChange('monthly')}
                        >
                            Monthly Report
                        </Button>
                        <Button
                            variant={reportType === 'weekly' ? 'primary' : 'outline-primary'}
                            onClick={() => handleReportTypeChange('weekly')}
                        >
                            Weekly Report
                        </Button>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <Typography variant="h5" component="h2" gutterBottom>
                        Total Expenses: ₹{totalExpenses.toFixed(2)}
                    </Typography>
                </div>

                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        {reportType === 'category' ? (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        ) : (
                            <BarChart
                                width={800}
                                height={400}
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center">
                        <Typography variant="h6" color="textSecondary">
                            No expense data available for the selected period and type.
                        </Typography>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button variant="outline-secondary" onClick={onClose}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ExpenseReportModal;