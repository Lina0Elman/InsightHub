import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { config } from '../config';
import { io } from "socket.io-client";
import { LoginResponse } from '../models/LoginResponse';
import DividedList from '../components/DividedList';
import { Room } from '../models/Room';
import axios from 'axios';

const Chat: React.FC = () => {
  const [messageContent, setMessageContent] = useState('');
  const [room, setRoom] = useState<Room>({ _id: null, messages: [] });
  const [onlineUsers, setOnlineUsers] = useState([] as LoginResponse[]);
  const usersMetadataCacheRef = useRef(new Set<any>());
  const socketRef = useRef(null as any);
  const userAuthRef = useRef(JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const connectHandler = () => {
    socketRef.current = io(config.app.backend_url(), {
      extraHeaders: {
        authorization: `Bearer ${userAuthRef.current.accessToken}`
      }
    });
    
    socketRef.current.on(config.socketMethods.messageFromServer, ({ roomId, message } : any) => {
      setRoom(prevRoom => {
        if (prevRoom && prevRoom._id === roomId) {
          return { ...prevRoom, messages: [...prevRoom.messages, message] };
        }
        return prevRoom;
      });
    });

    socketRef.current.on(config.socketMethods.onlineUsers, (receivedOnlineUsers: LoginResponse[]) => {
      setOnlineUsers(receivedOnlineUsers);
      receivedOnlineUsers.forEach(user => {
        usersMetadataCacheRef.current.add(user);
      });
    });
  };

  useEffect(() => {
    connectHandler();
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessageHandler = () => {
    if (room._id) {
      socketRef.current.emit(config.socketMethods.messageFromClient, { roomId: room._id, messageContent: messageContent });
      setMessageContent('');
    }
  };

  const onUserClick = (user : any) => {
    axios.get<Room>(`${config.app.backend_url()}/room/user/${user._id}`, {
      headers: { Authorization: `Bearer ${userAuthRef.current.accessToken}` }
    })
    .then((response) => {
      setRoom(response.data);
      socketRef.current.emit(`${config.socketMethods.enterRoom}`, response.data._id);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  // Scroll to the bottom of the chat messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [room.messages]); // Scroll whenever messages change

  return (
    <div className="chat-container">
        <div className="message-input">
            <input
                type="text"
                onChange={(e) => setMessageContent(e.target.value)}
                value={messageContent}
                placeholder="Type your message..."
            />
            <button onClick={() => sendMessageHandler()}>Send</button>
        </div>

        <div className="chat-messages">
            {room.messages.length === 0 ? (
                <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            ) : (
                room.messages.map((m: any, index: any) => (
                    <div key={index} className="message">
                        <div className="message-header">
                            <span className="message-user">{Array.from(usersMetadataCacheRef.current).find(u => u._id == m?.userId)?.email}</span>
                            <span className="message-time">{new Date(m?.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="message-content">{m?.content}</div>
                    </div>
                ))
            )}
            {/* This div will be used to scroll to the bottom */}
            <div ref={messagesEndRef} />
        </div>

        <div className="online-users">
            <h3>Online Users:</h3>
            <DividedList onlineUsers={onlineUsers} onUserClick={onUserClick} />
        </div>
    </div>
  );
};

export default Chat;