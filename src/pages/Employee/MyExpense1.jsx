import React, { useState } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MyExpense = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Groceries', amount: 50, date: '2023-05-10', category: 'Food' },
    { id: 2, name: 'Shoes', amount: 100, date: '2023-05-11', category: 'Shopping' },
  ]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.name.toLowerCase().includes(search.toLowerCase()) ||
      expense.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm(`Do you want to delete item with ID: ${id}?`)) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Personal Expense Manager</h2>
      <div className="d-flex justify-content-between align-items-center my-3">
        <div>
          <button className="btn btn-primary me-2" onClick={() => setShowAddModal(true)}>
            Add Expense
          </button>
          <button className="btn btn-success" onClick={() => setShowReportModal(true)}>
            Expense Report
          </button>
        </div>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="info">Filter</Button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.id}</td>
              <td>{expense.name}</td>
              <td>{expense.amount}</td>
              <td>{expense.date}</td>
              <td>{expense.category}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Expense Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter expense name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select>
                <option>Food</option>
                <option>Shopping</option>
                <option>Travel</option>
                <option>Health</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" placeholder="Enter amount" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Expense Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Report content goes here...</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyExpense;
