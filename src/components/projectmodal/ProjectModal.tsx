import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../store/projectsSlice';
import './projectmodal.css';

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
}

const ProjectModal = ({ open, onClose }: ProjectModalProps) => {
    if (!open) return null;

    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setProjectName('');
            setProjectDescription('');
        }
    }, [open]);

    const handleCreateProject = () => {
        if (projectName.trim()) {
            setIsLoading(true);
            
            // Simulate API call delay
            setTimeout(() => {
                dispatch(createProject({ 
                    name: projectName.trim(), 
                    description: projectDescription.trim() || undefined 
                }));
                setIsLoading(false);
                onClose();
            }, 500);
        }
    };

    const canCreateProject = projectName.trim().length > 0;

    return (
        <>
            <div className="project-modal-backdrop" onClick={onClose} />
            <div className="project-modal">
                <div className="project-modal-header">
                    <h2 className="project-modal-title">Create New Project</h2>
                    <button className="project-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="project-modal-content">
                    <div className="project-modal-section">
                        <label className="project-modal-label">Project Name</label>
                        <input 
                            className="project-modal-input" 
                            placeholder="Enter project name..." 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="project-modal-section">
                        <label className="project-modal-label">Description (Optional)</label>
                        <textarea 
                            className="project-modal-textarea" 
                            placeholder="Enter project description..." 
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="project-modal-footer">
                    <button 
                        onClick={handleCreateProject} 
                        className={canCreateProject ? 'project-modal-create-btn' : 'project-modal-create-btn project-modal-create-btn-disabled'} 
                        disabled={!canCreateProject || isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProjectModal;
