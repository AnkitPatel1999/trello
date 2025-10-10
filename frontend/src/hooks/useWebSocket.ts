import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  createdAt: string;
  readAt?: string;
  metadata: any;
}

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Join user room
      newSocket.emit('join', { userId: user.id });
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    // Notification event handlers
    newSocket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications(prev => [notification, ...prev]);
    });

    newSocket.on('notification_read', (data: { notificationId: string; readAt: string }) => {
      console.log('Notification marked as read:', data);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === data.notificationId 
            ? { ...notif, readAt: data.readAt }
            : notif
        )
      );
    });

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [user]);

  const markNotificationAsRead = (notificationId: string) => {
    if (socket && socket.connected) {
      socket.emit('mark_notification_read', { notificationId });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    socket,
    notifications,
    isConnected,
    markNotificationAsRead,
    clearNotifications,
  };
};
