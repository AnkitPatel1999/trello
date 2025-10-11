import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useDispatch } from 'react-redux';
import { updateCard, addCard } from '../store/cardsSlice';

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
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io(import.meta.env.API_END_POINT || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
      timeout: 10000, // 10 seconds timeout
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join user room
      console.log('Joining user room:', user.id);
      newSocket.emit('join', { userId: user.id });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    // Notification event handlers
    newSocket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications(prev => [notification, ...prev]);
    });

    // Task update event handlers
    newSocket.on('task_updated', (data: any) => {
      console.log('Received task update:', data);
      // Skip if this user made the update
      if (data.updatedBy === user.id) {
        return;
      }
      // Update the task in Redux store
      dispatch(updateCard(data.task));
    });

    newSocket.on('task_created', (data: any) => {
      console.log('Received task created:', data);
      // Skip if this user created the task
      if (data.createdBy === user.id) {
        return;
      }
      // Add the new task to Redux store
      dispatch(addCard(data.task));
    });

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      console.log('Attempting to connect to:', import.meta.env.API_END_POINT || 'http://localhost:3001');
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

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [user, dispatch]);

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
