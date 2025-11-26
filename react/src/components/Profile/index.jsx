import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './styles.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToChat = () => {
    navigate('/chat');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return <div className="profile-loading">Загрузка...</div>;
  }

  return (
    <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
      <div className="profile-card">
        <h1 className="profile-title">Профиль</h1>
        
        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-label">Имя пользователя:</span>
            <span className="profile-value">{user.username}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label">Дата регистрации:</span>
            <span className="profile-value">{formatDate(user.created_at)}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="profile-btn profile-btn-back" 
            onClick={handleBackToChat}
          >
            Вернуться в чат
          </button>
          
          <button 
            className="profile-btn profile-btn-logout" 
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;