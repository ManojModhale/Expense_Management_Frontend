import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { addExpense } from "../../services/expenseService";
import Notification from "../../components/Notification";
import "./AddExpense.css";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'FOOD',
    amount: '',
    date: ''
  });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      navigate('/login');
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming user ID is stored in session
      const username = sessionStorage.getItem("username");
      if (!username) throw new Error("Employee not logged in");

      const response = await addExpense(username, formData);
      setNotification({ type: 'success', message: 'Expense added successfully!' });
      setFormData({ description: '', category: 'FOOD', amount: '', date: '' });
      setTimeout(() => {
        navigate('/employee/expenses');
      }, 1500);
    } catch (error) {
      console.error('Error adding expense:', error);
      setNotification({ type: 'error', message: 'Failed to add expense.' });
    }
  };

  return (
    <div className="add-expense-page">
      <h1>Submit New Expense</h1>
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
      <form onSubmit={handleSubmit} className="add-expense-form">
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="FOOD">Food</option>
            <option value="TRAVEL">Travel</option>
            <option value="LODGING">Lodging</option>
            <option value="UTILITIES">Utilities</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Expense Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
