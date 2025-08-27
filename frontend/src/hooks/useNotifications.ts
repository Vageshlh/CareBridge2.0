import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from './useAuth';

interface Notification {
  id: string;
  type: 'APPOINTMENT_CREATED' | 'APPOINTMENT_UPDATED' | 'APPOINTMENT_CANCELLED' | 'MESSAGE_RECEIVED' | 'FILE_UPLOADED' | 'SYSTEM';
  title: string;
  message: string;
  resourceId?: string;
  resourceType?: 'appointment' | 'message' | 'file';
  createdAt: string;
  read: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  refreshNotifications: () => Promise<void>;
}

/**
 * Custom hook to handle notifications
 * @returns Notifications state and methods
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();
  const { user } = useAuth();
  
  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'APPOINTMENT_CREATED',
          title: 'New Appointment',
          message: 'Your appointment with Dr. Sarah Johnson has been scheduled for August 15, 2023 at 10:00 AM.',
          resourceId: '101',
          resourceType: 'appointment',
          createdAt: '2023-07-20T14:30:00Z',
          read: false,
        },
        {
          id: '2',
          type: 'MESSAGE_RECEIVED',
          title: 'New Message',
          message: 'Dr. Sarah Johnson sent you a message regarding your upcoming appointment.',
          resourceId: '101',
          resourceType: 'appointment',
          createdAt: '2023-07-21T09:15:00Z',
          read: false,
        },
        {
          id: '3',
          type: 'FILE_UPLOADED',
          title: 'New File',
          message: 'Dr. Sarah Johnson uploaded a new file: "Treatment Plan.docx"',
          resourceId: '101',
          resourceType: 'appointment',
          createdAt: '2023-07-22T14:20:00Z',
          read: true,
        },
        {
          id: '4',
          type: 'APPOINTMENT_UPDATED',
          title: 'Appointment Updated',
          message: 'Your appointment with Dr. Sarah Johnson has been rescheduled to August 16, 2023 at 11:00 AM.',
          resourceId: '101',
          resourceType: 'appointment',
          createdAt: '2023-07-23T10:45:00Z',
          read: true,
        },
        {
          id: '5',
          type: 'SYSTEM',
          title: 'Welcome to CareBridge',
          message: 'Thank you for joining CareBridge. We are here to help you manage your healthcare needs.',
          createdAt: '2023-07-19T08:00:00Z',
          read: true,
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);
  
  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);
  
  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // In a real app, this would be an API call
    // api.notifications.markAsRead(id);
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // In a real app, this would be an API call
    // api.notifications.markAllAsRead();
  }, []);
  
  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    
    // In a real app, this would be an API call
    // api.notifications.delete(id);
  }, []);
  
  // Initialize notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
  // Listen for new notifications
  useEffect(() => {
    if (!socket) return;
    
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };
    
    socket.on('notification:new', handleNewNotification);
    
    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  };
};