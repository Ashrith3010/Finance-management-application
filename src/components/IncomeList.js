import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { startFetchTransactions, startDeleteTransaction } from '../redux/actions/transactionActions';
import './styles/TransactionHistory.css'; 

const IncomeList = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);

  useEffect(() => {
    dispatch(startFetchTransactions());
  }, [dispatch]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.category === 'Income' &&
      transactionDate.getFullYear() === parseInt(selectedYear) &&
      transactionDate.getMonth() + 1 === parseInt(selectedMonth)
    );
  });

  const totalIncome = filteredTransactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(startDeleteTransaction(id));
    }
  };

  return (
    <div className="transaction-history">
      <h2>Income List</h2>
      <div className="filter-controls">
        <label>Select Year: </label>
        <select value={selectedYear} onChange={handleYearChange}>
          {[...new Array(10)].map((_, index) => (
            <option key={index} value={new Date().getFullYear() - index}>
              {new Date().getFullYear() - index}
            </option>
          ))}
        </select>
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {[...new Array(12)].map((_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <div className="total-amount">
        <h3>Total Income: ${totalIncome.toFixed(2)}</h3>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
              <td>{transaction.date}</td>
              <td>
                <Link to={`/edit/${transaction.id}`}>Edit</Link>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList;
