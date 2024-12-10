import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserTasks, updateTaskStatus } from '../../redux/features/DashboardSlice.js';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/features/AuthSlice.js';
import CreateTask from '../CreateTask.js';

function UserDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    
    if(token == null) {
        navigate('/login');
    }

    const { userTasks, loading, error, user } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(fetchUserTasks());
    }, [dispatch]);

    // update the status of the task
    const handleStatusChange = async (taskId, newStatus) => {
        await dispatch(updateTaskStatus({ taskId, status: newStatus }));
        await dispatch(fetchUserTasks());
    };
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = userTasks?.filter(task => 
        task.TaskName.toLowerCase().includes(searchTerm.toLowerCase())
    );  

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-5 md:p-8">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome {user?.name}
                    </h1>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search Tasks"
                        className="px-4 py-2 border border-gray-200 rounded-lg w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* <CreateTask /> */}

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : error ? (
                <div className="text-red-600 py-4">{error}</div>
            ) : (
                <div className="space-y-4">
                    {filteredTasks?.map(task => (
                        <div key={task._id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                            <h3 className="font-semibold text-lg text-gray-800">{task.TaskName}</h3>
                            <p className="text-gray-600 mt-2">{task.TaskDescription}</p>
                            <p className="text-gray-600 mt-2">Status: {task.TaskStatus}</p>
                            {
                                task.TaskStatus === 'Pending' && (
                                    <button
                                        onClick={() => handleStatusChange(task._id, 'Completed')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 mt-2"
                                    >
                                        Mark as Completed
                                    </button>
                                )
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserDashboard;