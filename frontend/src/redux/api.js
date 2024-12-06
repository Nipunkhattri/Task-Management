import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-type': 'application/json'
    }
});

Api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
        config.headers['x-access-token'] = token;  
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Authentication endpoints
export const login = (email, password) => Api.post('/auth/login', { email, password});
export const register = (username, email, password) => Api.post('/auth/register', { username, email, password });

// Admin Task Management endpoints
export const getAllUserTasks = () => Api.get('/api/admin/tasks');
export const createTask = (taskData) => Api.post('/api/admin/tasks', taskData);
export const updateTask = (taskId, taskData) => Api.put(`/api/admin/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => Api.delete(`/api/admin/tasks/${taskId}`);
export const deleteUser = (userId) => Api.delete(`/api/admin/users/${userId}`);

// User Task Management endpoints
export const getUserTasks = () => Api.get('/api/tasks');
export const updateTaskStatus = (taskId, status) => Api.put(`/api/tasks/${taskId}/status`, { TaskStatus: status });
