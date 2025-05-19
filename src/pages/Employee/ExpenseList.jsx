import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";
import "./ExpenseList.css";
import { getExpensesByEmployee } from "../../services/expenseService";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
      const username = sessionStorage.getItem("username"); // Assuming user ID is stored in session
      if (!username) throw new Error("Employee not logged in");

        const response = await getExpensesByEmployee(username);
        setExpenses(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('Failed to fetch expenses.');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return <Loader message="Loading your expenses..." />;
  }

  if (error) {
    return <Notification type="error" message={error} />;
  }

  return (
    <div className="expense-list-page">
      <h1>My Expenses</h1>
      {expenses.length === 0 ? (
        <p>No expenses submitted yet.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Expense Date</th>
              <th>Status</th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>${expense.amount}</td>
                <td>{expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</td>
                <td>{expense.status}</td>
                {/* Add more data display here */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
