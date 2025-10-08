import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hydrateIfEmpty, setActiveProject } from '../../store/projectsSlice';
import type { RootState } from '../../store';
import './leftsidebar.css';

import chevron_down from '../../assets/icons/chevron_down.svg';
import search from "../../assets/icons/search.svg"
import settings from "../../assets/icons/settings.svg"
import folder from "../../assets/icons/folder.svg"

export default function LeftSidebar() {
    const dispatch = useDispatch();
    const projects = useSelector((state: RootState) => state.projects.projects);
    const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);

    useEffect(() => {
        dispatch(hydrateIfEmpty());
    }, [dispatch]);

    const handleProjectClick = (projectId: string) => {
        dispatch(setActiveProject(projectId));
    };

    return (
        <div className="left-sidebar">
            <div className="cu-logo-container">
                <div className="cu-logo"></div>
                <div className="cu-logo-text">Cognito</div>
                <img src={chevron_down} alt="chevron-down" />
            </div>

            <div className="sidebar-section">
                <ul className="sidebar-list">
                    <li className="sidebar-item">
                        <img src={search} alt="" />
                        <span>Search</span>
                    </li>
                    <li className="sidebar-item">
                        <img src={settings} alt="" />
                        <span>Settings</span>
                    </li>
                </ul>
            </div>

            <div className="sidebar-section">
                <div className="sidebar-title">Favourites</div>
                <ul className="sidebar-list">
                    <li className="sidebar-item">
                        <img src={folder} alt="" />
                        <span>Team</span>
                    </li>
                    <li className="sidebar-item folder-item">
                        <ul className="nested-list">
                            {projects.map(project => (
                                <li 
                                    key={project.id} 
                                    className={`nested-item ${activeProjectId === project.id ? 'active' : ''}`}
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    {project.name}
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
