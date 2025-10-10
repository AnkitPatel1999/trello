import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import ProjectModal from '../projectmodal/ProjectModal';
import "./header.css";

import tabler_icon from '../../assets/icons/tabler_icon.svg';
import plus from '../../assets/icons/plus.svg';
import notification from '../../assets/icons/notification.png';

export default function Header() {
    console.log('Header rendering');
    const { user, logout } = useAuth();
    const { notifications, markNotificationAsRead, isConnected } = useWebSocket();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleCreateProject = () => {
        setIsProjectModalOpen(true);
    };

    const handleCloseProjectModal = () => {
        setIsProjectModalOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    const handleNotificationMouseEnter = () => {
        setIsNotificationOpen(true);
    };

    const handleNotificationMouseLeave = () => {
        setIsNotificationOpen(false);
    };

    const handleNotificationItemClick = (notificationId: string) => {
        markNotificationAsRead(notificationId);
    };

    const unreadCount = notifications.filter(n => !n.readAt).length;

    return (
        <>
            <div className="app-header-container">
                <div className='ae-d-flex'>
                    <div className='ae-d-flex ae-flex-1 ae-justify-space-between'>
                        <div className="ae-d-flex ae-align-center ae-gap-5">
                            <img src={tabler_icon} alt="tabler-icon" />
                            <span>Dashboard</span>
                        </div>
                        <div className="ae-d-flex ae-align-center ae-gap-10">
                            <button 
                                className="ae-btn ae-btn-outline-dark ae-gap-5"
                                onClick={handleCreateProject}
                            >
                                <img src={plus} alt="plus" />
                                <span className="ae-btn-text">New Project</span>
                            </button>

                            <div className='cu-notification-container'>
                                <button 
                                    className="notification-button"
                                    onMouseEnter={handleNotificationMouseEnter}
                                    onMouseLeave={handleNotificationMouseLeave}
                                >
                                    <img src={notification} alt="Notifications" />
                                    {unreadCount > 0 && (
                                        <span className="notification-badge">{unreadCount}</span>
                                    )}
                                    {!isConnected && (
                                        <span className="connection-indicator offline" title="Disconnected"></span>
                                    )}
                                </button>
                                
                                {isNotificationOpen && (
                                    <div className="notification-dropdown">
                                        <div className="notification-header">
                                            <h3>Notifications</h3>
                                            <span className="connection-status">
                                                {isConnected ? '🟢 Online' : '🔴 Offline'}
                                            </span>
                                        </div>
                                        <div className="notification-list">
                                            {notifications.length === 0 ? (
                                                <div className="notification-empty">
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div 
                                                        key={notif.id}
                                                        className={`notification-item ${!notif.readAt ? 'unread' : ''}`}
                                                        onClick={() => handleNotificationItemClick(notif.id)}
                                                    >
                                                        <div className="notification-content">
                                                            <div className="notification-title">{notif.title}</div>
                                                            <div className="notification-message">{notif.message}</div>
                                                            <div className="notification-time">
                                                                {new Date(notif.createdAt).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        {!notif.readAt && <div className="unread-indicator"></div>}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {user && (
                                <div className="ae-d-flex ae-align-center ae-gap-5">
                                    <span className="user-email">{user.email}</span>
                                    <button 
                                        className="ae-btn ae-btn-red ae-gap-5"
                                        onClick={handleLogout}
                                    >
                                        <span className="ae-btn-text">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isProjectModalOpen && (
                <ProjectModal 
                    open={isProjectModalOpen}
                    onClose={handleCloseProjectModal}
                />
            )}
        </>
    )
}
