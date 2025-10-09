import { useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProjectModalWithSuspense } from '../lazy/LazyModals';
import "./header.css";

import tabler_icon from '../../assets/icons/tabler_icon.svg';
import plus from '../../assets/icons/plus.svg';

interface HeaderProps {
    onProjectCreated?: () => void;
}

export default function Header({ onProjectCreated }: HeaderProps) {
    const { user, logout } = useAuth();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    const handleCreateProject = useCallback(() => {
        setIsProjectModalOpen(true);
    }, []);

    const handleCloseProjectModal = useCallback(() => {
        setIsProjectModalOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

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

            <ProjectModalWithSuspense 
                open={isProjectModalOpen}
                onClose={handleCloseProjectModal}
                onProjectCreated={onProjectCreated}
            />
        </>
    )
}
