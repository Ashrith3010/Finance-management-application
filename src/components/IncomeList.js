import React from 'react';
import { useSelector } from 'react-redux';

const IncomeList = () => {
  const transactions = useSelector(state => state.transactions.transactions);
  return (
    <div>
      <h1>Income</h1>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Income').map(transaction => (
          <li key={transaction.id}>
            {transaction.description}: ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;
