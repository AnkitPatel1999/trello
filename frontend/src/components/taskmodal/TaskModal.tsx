import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTasks } from '../../hooks/useTasks';
import { Status } from '../../domain/status';
import type { RootState } from '../../store';
import './taskmodal.css';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    status: Status;
}

const TaskModal = ({ open, onClose, status }: TaskModalProps) => {
    console.log('TaskModal rendering');
    if (!open) return null;

    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [subTaskInput, setSubTaskInput] = useState<string>('');
    const [subTasks, setSubTasks] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    const { createTask, loading } = useTasks();
    const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setTaskTitle('');
            setTaskDescription('');
            setSubTaskInput('');
            setSubTasks([]);
            setError('');
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

    const handleCreateTask = async () => {
        if (taskTitle.trim()) {
            setError('');
            try {
                await createTask({
                    title: taskTitle.trim(),
                    description: taskDescription.trim() || '',
                    status,
                    projectId: activeProjectId || 'default-project-id',
                    subtitles: subTasks.length > 0 ? subTasks : []
                });
                onClose();
            } catch (err: any) {
                setError(err.message || 'Failed to create task');
            }
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
                    {error && (
                        <div className="task-modal-error">
                            {error}
                        </div>
                    )}

                    <div className="task-modal-section">
                        <label className="task-modal-label">Task Title</label>
                        <input 
                            className="task-modal-input" 
                            placeholder="Enter task title..." 
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    <div className="task-modal-section">
                        <label className="task-modal-label">Description (Optional)</label>
                        <textarea 
                            className="task-modal-textarea" 
                            placeholder="Enter task description..." 
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            rows={3}
                            disabled={loading}
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
                                disabled={loading}
                            />
                            <button 
                                className="task-modal-add-btn"
                                onClick={handleAddSubTask}
                                disabled={!subTaskInput.trim() || loading}
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
                                            disabled={loading}
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
                        disabled={!canCreateTask || loading}
                    >
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default TaskModal;
