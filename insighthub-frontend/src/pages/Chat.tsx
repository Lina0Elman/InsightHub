import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './Chat.css';
import { config } from '../config';
import { io, Socket } from "socket.io-client";

interface ChatState {
  message: string;
  messages: string[];
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messagesHistory, setMessages] = useState([] as string[]);
  let socket = null;
  
  const connectHandler = () => {
    socket = io(config.app.backend_url());

    socket.on("msg-from-server", (msg: string) => {
      const messages = [...messagesHistory, msg];
      setMessages(messages);
    });
  };

  useEffect(() => {
    connectHandler();
  }, []);

  return (
    <div className="chat-container">
    </div>
  );
};

export default Chat;