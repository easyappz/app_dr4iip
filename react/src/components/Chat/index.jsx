import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Chat = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="chat-container" data-easytag="id1-react/src/components/Chat/index.jsx">
      <div className="chat-header">
        <h1>Чат</h1>
        <div className="user-info">
          <span>Привет, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-button">Выйти</button>
        </div>
      </div>
      <div className="chat-content">
        <p>Добро пожаловать в чат!</p>
      </div>
    </div>
  );
};

export default Chat;