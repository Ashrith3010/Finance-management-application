import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addTransaction, deleteTransaction } from '../redux/actions/transactionActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions.transactions);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
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
        console.log(response.data); // Check the response structure
        response.data.forEach(transaction => {
          dispatch(addTransaction(transaction));
        });
      } catch (err) {
        setError('Failed to fetch transactions.');
      }
    };

    fetchTransactions();
  }, [navigate, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login', { replace: true });
  };

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
      setDescription('');
      setCategory('Income');
      setAmount('');
      setDate('');
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

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {error && <p>{error}</p>}
      <h3>Add Transaction</h3>
      <form onSubmit={handleAddTransaction}>
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
        <button type="submit">Add Transaction</button>
      </form>

      <h3>Income</h3>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Income').length > 0 ? (
          transactions.filter(transaction => transaction.category === 'Income').map(transaction => (
            <li key={transaction.id}>
              {transaction.description}: ${transaction.amount} on {transaction.date}
              <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No income transactions available.</p>
        )}
      </ul>

      <h3>Expenses</h3>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Expense').length > 0 ? (
          transactions.filter(transaction => transaction.category === 'Expense').map(transaction => (
            <li key={transaction.id}>
              {transaction.description}: ${transaction.amount} on {transaction.date}
              <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No expense transactions available.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
