// src/components/TransactionHistoryPage.js
import React from 'react';
import { useSelector } from 'react-redux';

const TransactionHistoryPage = () => {
  const transactions = useSelector(state => state.transactions.transactions);

  return (
    <div>
      <h2>Transaction History</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map(transaction => (
            <li key={transaction.id}>
              {transaction.description} - ${transaction.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
};

export default TransactionHistoryPage;
