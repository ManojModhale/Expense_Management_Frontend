import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Table, FormControl as Input, FormLabel as Label } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import {
    Modal,
    ModalBody,
    ModalHeader,
    ModalTitle,
    ModalFooter,
} from 'react-bootstrap';
//import { addExpense, getExpensesByEmployee } from '../../services/expenseService';
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";

// Mock Data for initial display
// const initialExpenses = [
//     { itemId: 1, itemName: 'Grocery Shopping', amount: 50.00, expenseDate: '2024-07-20', category: 'FOOD' },
//     { itemId: 2, itemName: 'Fuel', amount: 30.00, expenseDate: '2024-07-19', category: 'TRAVEL' },
//     { itemId: 3, itemName: 'Dinner', amount: 75.00, expenseDate: '2024-07-18', category: 'FOOD' },
// ];
const API_BASE_URL = "http://localhost:8181/api";

const categories = [
    { label: "FOOD", value: "FOOD" },
    { label: "TRAVEL", value: "TRAVEL" },
    { label: "LODGING", value: "LODGING" },
    { label: "UTILITIES", value: "UTILITIES" },
    { label: "OTHER", value: "OTHER" },
];

const ExpenseForm = ({
    isOpen,
    onClose,
    onSave,
    initialExpense,
    //setNotification
}) => {
    const [formData, setFormData] = useState({
        description: initialExpense?.description || '',
        amount: initialExpense?.amount || 0,
        //date: initialExpense?.date || '',
        date: initialExpense?.date ? initialExpense.date.split('T')[0] : '', // Adjust for backend date format
        category: initialExpense?.category || 'FOOD',
    });

    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        if (initialExpense) {
            setFormData({
                description: initialExpense.description,
                amount: initialExpense.amount,
                //date: initialExpense.date,
                date: initialExpense.date ? initialExpense.date.split('T')[0] : '', // Ensure format for date input
                category: initialExpense.category,
            });
            //setDate(new Date(initialExpense.date));
        } else {
            setFormData({
                description: '',
                amount: 0,
                date: '',
                category: 'FOOD'
            });
            //setDate(undefined);
        }
    }, [initialExpense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.description || !formData.date || !formData.amount || formData.amount <= 0) {
            Swal.fire({
                title: "Error",
                text: "Please fill in all fields correctly, especially amount.",
                icon: "error",
                timer: 3000,
                confirmButtonText: "Try Again",
            });
            return;
        }
        setLoading(true); // Start loading
        try {
            const username = sessionStorage.getItem("username");
            if (!username) {
                throw new Error("Manager not logged in. Please log in.");
            }

            const expenseToSave = {
                ...formData,
                amount: Number(formData.amount),
                //id: initialExpense?.id, // Include the ID for updates
                //date: formData.date
                // Backend expects 'id' for update, not for add. If initialExpense.id is undefined, it won't be sent.
                ...(initialExpense?.id && { id: initialExpense.id }), // Conditionally add ID for update
            };

            const endpoint = `${API_BASE_URL}/manager/${initialExpense?.id ? 'update-expense' : 'addexpense'}/${username}`;
            const method = initialExpense?.id ? 'PUT' : 'POST'; // Use PUT for updates, POST for new

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseToSave),
            });

            if (!response.ok) {
                const errorData = await response.json(); //added
                throw new Error(errorData.message || "Failed to add/update expense");
            }
            const savedExpense = await response.json(); // Get the saved expense data (with ID)


            //setFormData({ description: '', category: 'FOOD', amount: '', date: '' }); //clear form
            Swal.fire({
                title: "Success",
                text: `Expense ${initialExpense?.id ? 'updated' : 'added'} successfully!`,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Continue",
            }).then(() => {
                setFormData({ description: '', category: 'FOOD', amount: '', date: '' });
                onSave(savedExpense); // Pass the *saved* expense (with ID)
                onClose();
            });

        } catch (error) {
            console.error('Error adding/updating expense:', error);
            const errorMessage = error.message || "An unexpected error occurred.";
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Try Again",
            });
        } finally {
            setLoading(false); // Stop loading
        }

    };
    /*
    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setFormData({
                ...formData,
                date: formattedDate,
            });
        }
    };*/

    return (
        <Modal show={isOpen} onHide={onClose}>
            <ModalHeader closeButton> {/* Added closeButton for better UX */}
                <ModalTitle>{initialExpense ? 'Edit Expense' : 'Add Expense'}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form>
                    <Form.Group className="mb-3">
                        <Label>Description:</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Label>Category</Label>
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Label>Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0.01" // Ensure positive amount
                            step="0.01" // Allow decimals
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Label>Expense Date</Label>
                        <div>
                            <Input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </Form.Group>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
                <Button type="button" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};


const MyExpenseMg = () => {
    const [expenses, setExpenses] = useState([]);
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null); // Changed to null for clarity when no expense is being edited
    //const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [notification, setNotification] = useState(null);

    // Filter states for advanced filtering
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Use useCallback to memoize functions that don't change
    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const username = sessionStorage.getItem("username");
            if (!username) {
                throw new Error("Manager not logged in. Please log in to view expenses.");
            }

            const response = await fetch(`${API_BASE_URL}/manager/expensesByUsername/${username}`); // Corrected endpoint
            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || "Failed to fetch expenses.");
                } catch (jsonError) {
                    throw new Error(errorText || "Failed to fetch expenses. Server responded with an error.");
                }
            }
            const data = await response.json();
            console.log("inside fetch expenses: ", data);
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setError(error.message || 'Failed to fetch expenses.');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]); // Dependency on fetchExpenses


    const handleSaveExpense = useCallback((savedExpense) => {
        if (editingExpense) { // Check if we were in edit mode
            setExpenses(prevExpenses =>
                prevExpenses.map(e =>
                    e.id === savedExpense.id ? savedExpense : e // Use the *saved* expense
                )
            );
        } else { // It's a new expense
            setExpenses(prevExpenses => [...prevExpenses, savedExpense]);   // Use the *saved* expense
        }
        setEditingExpense(null); // Reset editing expense after save
        setIsAddEditOpen(false); // Close modal
    }, [editingExpense]); // Depend on editingExpense to correctly differentiate add/edit

    
    const handleDeleteExpense = useCallback(async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this expense?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true); // Start loading state for deletion
                try {
                    const username = sessionStorage.getItem("username");
                    if (!username) {
                        throw new Error("Manager not logged in. Please log in.");
                    }

                    const response = await fetch(`${API_BASE_URL}/manager/delete-expense/${username}/${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to delete expense.");
                    }

                    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));
                    Swal.fire(      // This Swal is for visual confirmation in the modal
                        'Deleted!',
                        'Your expense has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting expense:', error);
                    Swal.fire(      // This Swal is for visual confirmation in the modal
                        'Error!',
                        error.message || 'Failed to delete expense.',
                        'error'
                    );
                } finally {
                    setLoading(false);
                }
            }
        });
    }, []);

    // ** Filtering Logic **
    const applyFilters = () => {
        return expenses.filter(expense => {
            // Text search filter (description or category)
            const matchesSearch = searchString === '' ||
                expense.description.toLowerCase().includes(searchString.toLowerCase()) ||
                expense.category.toLowerCase().includes(searchString.toLowerCase());

            // Category filter
            const matchesCategory = filterCategory === '' || expense.category === filterCategory;

            // Date range filter
            const expenseDate = new Date(expense.date);
            const start = filterStartDate ? new Date(filterStartDate + 'T00:00:00') : null; // Ensure comparison is date-only
            const end = filterEndDate ? new Date(filterEndDate + 'T23:59:59') : null; // Ensure comparison is date-only

            const matchesDateRange = (!start || expenseDate >= start) && (!end || expenseDate <= end);

            return matchesSearch && matchesCategory && matchesDateRange;
        });
    };

    const displayedExpenses = applyFilters(); // Apply filters before rendering

    const handleClearFilters = () => {
        setSearchString('');
        setFilterCategory('');
        setFilterStartDate('');
        setFilterEndDate('');
    };


    if (loading) {
        return <Loader message="Loading your expenses..." />;
    }


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Personal Expenses</h2>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center my-3 gap-3">
                <div className="d-flex gap-2">
                    <Button className="btn btn-primary me-2" onClick={() => {
                        setIsAddEditOpen(true);
                        setEditingExpense(null);
                    }}>Add Expense</Button>
                    <Button className="btn btn-success" >Expense Report</Button> {/*onClick={() => setIsReportModalOpen(true)} */}
                </div>
                {/* Search and Filter Controls */}
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 flex-grow-1 justify-content-md-end">
                    <Form.Control
                        type="text"
                        className="me-md-2"
                        placeholder="Search by description or category"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        style={{ width: 'auto', minWidth: '180px' }} // Limit width
                    />
                    <Form.Select
                        className="me-md-2"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ width: 'auto', minWidth: '150px' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        type="date"
                        className="me-md-2"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        placeholder="From Date"
                        style={{ width: 'auto', minWidth: '160px' }}
                    />
                    <Form.Control
                        type="date"
                        className="me-md-2"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        placeholder="To Date"
                        style={{ width: 'auto', minWidth: '160px' }}
                    />
                    <Button variant="info" onClick={handleClearFilters} >Clear Filters</Button>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedExpenses.length > 0 ? (
                        displayedExpenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.id}</td>
                                <td>{expense.description}</td>
                                <td>₹{expense.amount ? expense.amount.toFixed(2) : '0.00'}</td>
                                <td>{expense.date}</td>
                                <td>{expense.category}</td>
                                <td>
                                    <span className={
                                        expense.status === 'APPROVED' ? 'text-success' :
                                            expense.status === 'REJECTED' ? 'text-danger' :
                                                expense.status === 'PENDING' ? 'text-warning' :
                                                    '' // Default or no special color if status is unknown
                                    }>
                                        {expense.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                setIsAddEditOpen(true);
                                                setEditingExpense(expense);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            disabled={loading} // Disable if any other action is loading
                                        >
                                            {loading ? 'Processing...' : 'Delete'} {/* More generic loading message */}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted py-3">No expenses found matching your criteria.</td> {/* Updated colspan */}
                        </tr>
                    )}
                </tbody>
            </Table>


            <ExpenseForm
                isOpen={isAddEditOpen}
                onClose={() => {
                    setIsAddEditOpen(false);
                    setEditingExpense(null);
                }}
                onSave={handleSaveExpense}
                initialExpense={editingExpense}
            //setNotification={setNotification}
            />

        </div>
    );
};
export default MyExpenseMg;
