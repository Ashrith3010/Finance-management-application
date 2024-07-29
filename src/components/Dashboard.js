import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditTransaction from './AddEditTransaction';
import IncomeList from './IncomeList';
import ExpenseList from './ExpenseList';
import Home from './Home';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'home';
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('activePage', activePage);
  }, [activePage]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username'); 
    localStorage.removeItem('activePage');
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

  const username = localStorage.getItem('username');

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome, {username || 'User'}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="nav-buttons">
        <button onClick={() => setActivePage('home')}>Home</button>
        <button onClick={() => setActivePage('transactions')}>Add Transactions</button>
        <button onClick={() => setActivePage('income')}>Income</button>
        <button onClick={() => setActivePage('expenses')}>Expenses</button>
      </div>
      {renderPage()}
    </div>
  );
};

export default Dashboard;
