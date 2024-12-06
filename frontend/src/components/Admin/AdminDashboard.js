import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAllUserTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    deleteUser,
    updateStatusTask
} from '../../redux/features/DashboardSlice.js';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/features/AuthSlice.js';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    if(token == null) {
        navigate('/');
    }

    const { allUserTasks , loading, error } = useSelector(state => state.dashboard);
    const [editTaskId, setEditTaskId] = useState(null);
    const [taskForm, setTaskForm] = useState({
        TaskName: '',
        TaskDeadline: '',
        TaskDescription: '',
        TaskStatus: 'pending',
        AssignUserEmail: ''
    });

    console.log('Task form:', taskForm);

    const [formErrors, setFormErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    };

    // Update form submission validation
    const validateForm = () => {
        const errors = {};
        if (!taskForm.TaskName.trim()) errors.TaskName = 'Task name is required';
        if (!taskForm.TaskDeadline) {
            errors.TaskDeadline = 'Deadline is required';
        } else if (!isValidDate(taskForm.TaskDeadline)) {
            errors.TaskDeadline = 'Invalid date format';
        }
        if (!taskForm.AssignUserEmail.trim()) errors.AssignedEmail = 'Assigned email is required';
        if (!taskForm.TaskDescription.trim()) errors.Description = 'Description is required';
        return errors;
    };

    useEffect(() => {
        console.log('Fetching all user tasks...');
        dispatch(fetchAllUserTasks());
    }, []);

    // Update handleUpdateTask function
    const handleUpdateStatusTask = async (taskId, updatedData) => {
        console.log('Updating task:', taskId, updatedData);
        await dispatch(updateStatusTask(taskId, updatedData));
        await dispatch(fetchAllUserTasks());
    };

    // handleDeleteTask function
    const handleDeleteTask = async (taskId) => {
        await dispatch(deleteTask(taskId));
        await dispatch(fetchAllUserTasks());
    };

    // Delete the user and the related tasks
    const handleDeleteUser = async (userId) => {
        if(window.confirm('Are you sure? This will delete the user and all their tasks.')) {
            await dispatch(deleteUser(userId));
        }
        await dispatch(fetchAllUserTasks());
    };

    // Create or update the task
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
    
        try {
            if (isEditMode) {
                console.log('Updating task:', taskForm);
                console.log('Task ID:', editTaskId);
                await dispatch(updateTask({
                    taskId : editTaskId,
                    taskData: taskForm,
                }));
                setIsEditMode(false);
                setEditTaskId(null);
            } else {
                await dispatch(createTask(taskForm));
            }
            setTaskForm({
                TaskName: '',
                TaskDeadline: '',
                TaskDescription: '',
                AssignUserEmail: '',
                TaskStatus: 'Pending'
            });
            setFormErrors({});
            
        } catch (error) {
            console.error('Error:', error);
        }
        await dispatch(fetchAllUserTasks());
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (!isValidDate(d)) return '';
        
        return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };    

    // Update handleEditClick function
    const handleEditClick = (task) => {
        console.log('Editing task:', task);
        let formattedDeadline = '';
        if (task.TaskDeadline && isValidDate(task.TaskDeadline)) {
            formattedDeadline = formatDate(task.TaskDeadline);
        }
        console.log('Formatted deadline:', formattedDeadline);
        setEditTaskId(task._id);
        setTaskForm({
            TaskName: task.TaskName,
            TaskDescription: task.TaskDescription,
            AssignUserEmail: task.AssignedUser.email,
            TaskStatus: task.TaskStatus,
            TaskDeadline: formattedDeadline
        });
        setIsEditMode(true);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6">
        <button 
            onClick={handleLogout}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
            Logout
        </button>

        {/* Task Creation Form */}
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Update Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="taskName" className="font-semibold text-gray-700">
                        Task Name
                    </label>
                    <input
                        id="taskName"
                        type="text"
                        value={taskForm.TaskName}
                        onChange={(e) => setTaskForm({...taskForm, TaskName: e.target.value})}
                        placeholder="Enter task name"
                        className={`border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none
                            ${formErrors.TaskName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.TaskName && 
                        <span className="text-red-500 text-sm">{formErrors.TaskName}</span>
                    }
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="deadline" className="font-semibold text-gray-700">
                        Deadline
                    </label>
                    <input
                        id="deadline"
                        type="date"
                        value={taskForm.TaskDeadline}
                        onChange={(e) => setTaskForm({...taskForm, TaskDeadline: e.target.value})}
                        className={`border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none
                            ${formErrors.TaskDeadline ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.TaskDeadline && 
                        <span className="text-red-500 text-sm">{formErrors.TaskDeadline}</span>
                    }
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="font-semibold text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={taskForm.TaskDescription}
                        onChange={(e) => setTaskForm({...taskForm, TaskDescription: e.target.value})}
                        placeholder="Enter task description"
                        rows="4"
                        className={`border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none
                            ${formErrors.TaskDescription ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.TaskDescription && 
                        <span className="text-red-500 text-sm">{formErrors.TaskDescription}</span>
                    }
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="userEmail" className="font-semibold text-gray-700">
                        Assign to User (Email)
                    </label>
                    <input
                        id="userEmail"
                        type="email"
                        value={taskForm.AssignUserEmail}
                        onChange={(e) => setTaskForm({...taskForm, AssignUserEmail: e.target.value})}
                        placeholder="Enter user email"
                        className={`border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none
                            ${formErrors.AssignUserEmail ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.AssignUserEmail && 
                        <span className="text-red-500 text-sm">{formErrors.AssignUserEmail}</span>
                    }
                </div>

                <div className="flex gap-4">
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {isEditMode ? 'Update Task' : 'Create Task'}
                    </button>
                    {isEditMode && (
                        <button 
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            onClick={() => {
                                setIsEditMode(false);
                                setEditTaskId(null);
                                setTaskForm({
                                    TaskName: '',
                                    TaskDeadline: '',
                                    TaskDescription: '',
                                    AssignUserEmail: '',
                                    TaskStatus: 'Pending',
                                });
                                setFormErrors({});
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>

        {/* Users and Tasks List */}
        <div className="space-y-8">
            {Array.isArray(allUserTasks) && allUserTasks.length > 0 ? (
                allUserTasks.map(userTasks => (
                    <div key={userTasks.user?._id || Math.random()} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                {userTasks.user?.email || 'Unknown User'}
                            </h3>
                            <button 
                                onClick={() => handleDeleteUser(userTasks.user?._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete User
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            {Array.isArray(userTasks.tasks) && userTasks.tasks.map(task => (
                                <div key={task._id} className="border rounded-lg p-4">
                                    <h4 className="text-lg font-semibold mb-2">{task.TaskName}</h4>
                                    <p className="text-gray-600 mb-2">{task.TaskDescription}</p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Deadline: {new Date(task.TaskDeadline).toLocaleDateString()}
                                    </p>
                                    <p className="mb-4">
                                        <span className={`px-2 py-1 rounded-full text-sm
                                            ${task.TaskStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {task.TaskStatus}
                                        </span>
                                    </p>
                                    <div className="flex gap-2">
                                        <button 
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => handleUpdateStatusTask(task._id, {
                                                ...task,
                                                TaskStatus: task.TaskStatus === 'pending' ? 'completed' : 'pending'
                                            })}
                                        >
                                            Toggle Status
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => handleDeleteTask(task._id)}
                                        >
                                            Delete Task
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            onClick={() => handleEditClick(task)}
                                        >
                                            Edit Task
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!userTasks.tasks || userTasks.tasks.length === 0) && (
                                <p className="text-gray-500 text-center py-4">No tasks assigned</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center py-8">No users or tasks found.</p>
            )}
        </div>
    </div>
    );
};

export default AdminDashboard;