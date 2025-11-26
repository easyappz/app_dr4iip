import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/messages';
import './styles.css';

const Chat = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const data = await getMessages({ limit: 100, offset: 0 });
      setMessages(data.results || []);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    setSending(true);
    try {
      await sendMessage({ content: newMessage.trim() });
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadMessages();

    pollingIntervalRef.current = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="chat-container" data-easytag="id1-react/src/components/Chat/index.jsx">
      <div className="chat-header">
        <h1>Общий чат</h1>
        <Link to="/" className="profile-link">Профиль</Link>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading-container">
            <p>Загрузка сообщений...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>Пока нет сообщений. Начните общение!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message-item ${message.author.id === user?.id ? 'own-message' : ''}`}
              >
                <div className="message-header">
                  <span className="message-author">{message.author.username}</span>
                  <span className="message-time">{formatTime(message.created_at)}</span>
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="message-input"
            disabled={sending}
            maxLength={1000}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;