import { useEffect, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import './projectmodal.css';

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
    onProjectCreated?: () => void; // Add callback prop
}

const ProjectModal = ({ open, onClose, onProjectCreated }: ProjectModalProps) => {
    if (!open) return null;

    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { createProject, loading } = useProjects();

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setProjectName('');
            setProjectDescription('');
            setError('');
        }
    }, [open]);

    const handleCreateProject = async () => {
        if (projectName.trim()) {
            setError('');
            try {
                await createProject({
                    name: projectName.trim(),
                    description: projectDescription.trim() || undefined
                });
                onClose();
                // Call the callback to refresh the sidebar
                if (onProjectCreated) {
                    onProjectCreated();
                }
            } catch (err: any) {
                setError(err.message || 'Failed to create project');
            }
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
                    {error && (
                        <div className="project-modal-error">
                            {error}
                        </div>
                    )}

                    <div className="project-modal-section">
                        <label className="project-modal-label">Project Name</label>
                        <input 
                            className="project-modal-input" 
                            placeholder="Enter project name..." 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            autoFocus
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="project-modal-footer">
                    <button 
                        onClick={handleCreateProject} 
                        className={canCreateProject ? 'project-modal-create-btn' : 'project-modal-create-btn project-modal-create-btn-disabled'} 
                        disabled={!canCreateProject || loading}
                    >
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProjectModal;
