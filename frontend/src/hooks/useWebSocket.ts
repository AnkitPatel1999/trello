// frontend/src/hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useDispatch } from 'react-redux';
import { updateCard, addCard } from '../store/cardsSlice';

const API_END_POINT = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://trello-production-298c.up.railway.app';


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
  
  // ✅ Store user.id in ref to avoid dependency
  const userIdRef = useRef(user?.id);
  
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io(API_END_POINT, {
      transports: ['websocket'],
      autoConnect: true,
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // ✅ Stable event handlers
    const handleConnect = () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
      console.log('Joining user room:', user.id);
      newSocket.emit('join', { userId: user.id });
    };

    const handleDisconnect = (reason: string) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    };

    const handleNotification = (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications(prev => [notification, ...prev]);
    };

    const handleTaskUpdated = (data: any) => {
      console.log('Received task update:', data);
      if (data.updatedBy === userIdRef.current) return;
      dispatch(updateCard(data.task));
    };

    const handleTaskCreated = (data: any) => {
      console.log('Received task created:', data);
      if (data.createdBy === userIdRef.current) return;
      dispatch(addCard(data.task));
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
    };

    const handleConnectError = (error: any) => {
      console.error('WebSocket connection error:', error);
      console.log('Attempting to connect to:', API_END_POINT);
    };

    const handleNotificationRead = (data: { notificationId: string; readAt: string }) => {
      console.log('Notification marked as read:', data);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === data.notificationId 
            ? { ...notif, readAt: data.readAt }
            : notif
        )
      );
    };

    // Register event listeners
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('notification', handleNotification);
    newSocket.on('task_updated', handleTaskUpdated);
    newSocket.on('task_created', handleTaskCreated);
    newSocket.on('error', handleError);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('notification_read', handleNotificationRead);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('notification', handleNotification);
      newSocket.off('task_updated', handleTaskUpdated);
      newSocket.off('task_created', handleTaskCreated);
      newSocket.off('error', handleError);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('notification_read', handleNotificationRead);
      newSocket.close();
      socketRef.current = null;
    };
  }, [user, dispatch, API_END_POINT]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark_notification_read', { notificationId });
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    socket,
    notifications,
    isConnected,
    markNotificationAsRead,
    clearNotifications,
  };
};