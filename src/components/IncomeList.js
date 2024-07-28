// src/components/IncomeList.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startDeleteTransaction } from '../redux/actions/transactionActions';
import { Link } from 'react-router-dom';

const IncomeList = ({ onEdit }) => {
  const transactions = useSelector(state => state.transactions.transactions);
  const dispatch = useDispatch();

  const handleDeleteTransaction = (id) => {
    dispatch(startDeleteTransaction(id));
  };

  return (
    <div>
      <h1>Income List</h1>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Income').map(transaction => (
          <li key={transaction.id}>
            {transaction.description}: ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            <button onClick={() => onEdit(transaction.id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;
