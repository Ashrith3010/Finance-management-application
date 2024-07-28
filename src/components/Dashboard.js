// src/components/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditTransaction from './AddEditTransaction';
import IncomeList from './IncomeList';
import ExpenseList from './ExpenseList';
import Home from './Home';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username'); // Also clear the username on logout
    navigate('/login', { replace: true });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'transactions':
        return <AddEditTransaction />;
      case 'income':
        return <IncomeList />;
      case 'expenses':
        return <ExpenseList />;
      default:
        return <Home />;
    }
  };

  const username = localStorage.getItem('username'); // Retrieve username from local storage

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome, {username || 'User'}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="nav-buttons">
        <button onClick={() => setActivePage('home')}>Home</button>
        <button onClick={() => setActivePage('transactions')}>Transactions</button>
        <button onClick={() => setActivePage('income')}>Income</button>
        <button onClick={() => setActivePage('expenses')}>Expenses</button>
      </div>
      {renderPage()}
    </div>
  );
};

export default Dashboard;
