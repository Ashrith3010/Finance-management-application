import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addTransaction, editTransaction, startFetchTransactions, startAddTransaction, startEditTransaction } from '../redux/actions/transactionActions';
import './styles/AddEditTransaction.css';

const AddEditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);

  useEffect(() => {
    dispatch(startFetchTransactions());
  }, [dispatch]);

  const existingTransaction = transactions.find((transaction) => transaction.id === id);
  const [formData, setFormData] = useState({
    description: existingTransaction ? existingTransaction.description : '',
    amount: existingTransaction ? existingTransaction.amount : '',
    category: existingTransaction ? existingTransaction.category : '',
    date: existingTransaction ? existingTransaction.date : '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      const confirmUpdate = window.confirm("Are you sure you want to update this transaction?");
      if (confirmUpdate) {
        dispatch(startEditTransaction(id, formData));
        alert('Transaction updated successfully');
        navigate('/dashboard');
      }
    } else {
      dispatch(startAddTransaction({ ...formData, id: Date.now().toString() }));
      alert('Transaction added successfully');
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="add-edit-transaction">
      <h2>{id ? 'Edit Transaction' : 'Add Transaction'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{id ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};

export default AddEditTransaction;
