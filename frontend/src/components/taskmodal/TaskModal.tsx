import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCard } from '../../store/cardsSlice';
import { Status } from '../../domain/status';
import type { RootState } from '../../store';
import './taskmodal.css';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    status: Status;
}

const TaskModal = ({ open, onClose, status }: TaskModalProps) => {
    if (!open) return null;

    const [taskTitle, setTaskTitle] = useState<string>('');
    const [subTaskInput, setSubTaskInput] = useState<string>('');
    const [subTasks, setSubTasks] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setTaskTitle('');
            setSubTaskInput('');
            setSubTasks([]);
        }
    }, [open]);

    const handleAddSubTask = () => {
        if (subTaskInput.trim()) {
            setSubTasks(prev => [...prev, subTaskInput.trim()]);
            setSubTaskInput('');
        }
    };

    const handleRemoveSubTask = (index: number) => {
        setSubTasks(prev => prev.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSubTask();
        }
    };

    const handleCreateTask = () => {
        if (taskTitle.trim()) {
            setIsLoading(true);
            
            // Simulate API call delay
            setTimeout(() => {
                dispatch(addCard({ 
                    title: taskTitle.trim(), 
                    status, 
                    subtitles: subTasks.length > 0 ? subTasks : undefined,
                    projectId: activeProjectId || 'default-project-id'
                }));
                setIsLoading(false);
                onClose();
            }, 500);
        }
    };

    const canCreateTask = taskTitle.trim().length > 0;

    return (
        <>
            <div className="task-modal-backdrop" onClick={onClose} />
            <div className="task-modal">
                <div className="task-modal-header">
                    <h2 className="task-modal-title">Create New Task</h2>
                    <button className="task-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="task-modal-content">
                    <div className="task-modal-section">
                        <label className="task-modal-label">Task Title</label>
                        <input 
                            className="task-modal-input" 
                            placeholder="Enter task title..." 
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="task-modal-section">
                        <label className="task-modal-label">Sub Tasks</label>
                        <div className="task-modal-subtask-input">
                            <input 
                                className="task-modal-input" 
                                placeholder="Add sub task (press Enter to add)..." 
                                value={subTaskInput}
                                onChange={(e) => setSubTaskInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button 
                                className="task-modal-add-btn"
                                onClick={handleAddSubTask}
                                disabled={!subTaskInput.trim()}
                            >
                                Add
                            </button>
                        </div>
                        
                        {subTasks.length > 0 && (
                            <div className="task-modal-subtasks-list">
                                {subTasks.map((subTask, index) => (
                                    <div key={index} className="task-modal-subtask-item">
                                        <span className="task-modal-subtask-text">• {subTask}</span>
                                        <button 
                                            className="task-modal-remove-btn"
                                            onClick={() => handleRemoveSubTask(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="task-modal-footer">
                    <button 
                        onClick={handleCreateTask} 
                        className={canCreateTask ? 'task-modal-create-btn' : 'task-modal-create-btn task-modal-create-btn-disabled'} 
                        disabled={!canCreateTask || isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default TaskModal;
