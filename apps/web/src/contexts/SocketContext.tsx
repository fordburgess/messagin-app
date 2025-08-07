import { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import { useChatContext } from './ChatContext';
import { useContactContext } from "./ContactContext";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { type User } from '../types'

type SocketContextType = {
  socket: Socket | null,
  isConnected: boolean,
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const contactContext = useContactContext();
  const authContext = useAuthContext();
  const { dispatch } = useChatContext();

  useEffect(() => {
    const newSocket = io('http://192.168.1.110:3000');

    setSocket(newSocket);

    function onConnect() {
      setIsConnected(true);
    }

    function receiveMessage(data) {
      if (data.senderId !== authContext.userId?.toString()) {
        const sender = contactContext.users.find((user: User) => user.id == data.senderId);

        toast(
          <div>
            <p style={{ fontSize: '1rem' }}><strong>{sender?.name || ''}</strong></p>
            <p>{data.message}</p>
          </div>
        );

        dispatch({ type: 'ADD_MESSAGE', payload: { chat_id: data.chatId, message: data.message, sender_id: data.senderId, time_sent: data.time_sent  }})
      }

    }

    function newChat(data) {
      if (data.senderId !== authContext.userId) {
        dispatch({ type: 'CREATE_NEW_CHAT', payload: data })
      }
    }

    newSocket.on('connect', onConnect);
    newSocket.on('receive_message', receiveMessage);
    newSocket.on('new_chat', newChat)

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('receive_message', receiveMessage);
      newSocket.off('new_chat', newChat)
    }
  }, [authContext, contactContext])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
}

export default SocketContextProvider;
