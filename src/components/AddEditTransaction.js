import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addTransaction, deleteTransaction, editTransaction, setTransactions } from '../redux/actions/transactionActions';
import { useNavigate } from 'react-router-dom';
import './styles/AddEditTransaction.css'; // Import AddEditTransaction-specific CSS

const AddEditTransaction = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions.transactions);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('No token found. Please log in.');
          navigate('/login', { replace: true });
          return;
        }
        const response = await axios.get('http://localhost:5001/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setTransactions(response.data));
      } catch (err) {
        setError('Failed to fetch transactions.');
      }
    };

    fetchTransactions();
  }, [navigate, dispatch]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login', { replace: true });
        return;
      }
      const response = await axios.post('http://localhost:5001/api/transactions', {
        description,
        category,
        amount,
        date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(addTransaction(response.data.transaction));
      resetForm();
    } catch (err) {
      setError('Failed to add transaction.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login', { replace: true });
        return;
      }
      await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(deleteTransaction(id));
    } catch (err) {
      setError('Failed to delete transaction.');
    }
  };

  const handleEditTransaction = (id) => {
    const transactionToEdit = transactions.find(transaction => transaction.id === id);
    if (!transactionToEdit) {
      setError('Transaction not found.');
      return;
    }

    setDescription(transactionToEdit.description);
    setCategory(transactionToEdit.category);
    setAmount(transactionToEdit.amount);
    setDate(transactionToEdit.date);

    setEditMode(true);
    setEditId(id);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login', { replace: true });
        return;
      }

      const updatedTransaction = {
        description,
        category,
        amount,
        date
      };

      const response = await axios.put(`http://localhost:5001/api/transactions/${editId}`, updatedTransaction, {
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch(editTransaction(editId, response.data.transaction));
      resetForm();
    } catch (err) {
      setError('Failed to edit transaction.');
    }
  };

  const resetForm = () => {
    setDescription('');
    setCategory('Income');
    setAmount('');
    setDate('');
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="add-edit-transaction">
      <h3>Add Transaction</h3>
      <form onSubmit={editMode ? handleSaveEdit : handleAddTransaction}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {editMode ? (
          <div>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        ) : (
          <button type="submit">Add Transaction</button>
        )}
      </form>
      <div>
        <h4>Current Transactions</h4>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.description} - {transaction.amount} - {transaction.date}
              <button onClick={() => handleEditTransaction(transaction.id)}>Edit</button>
              <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddEditTransaction;
