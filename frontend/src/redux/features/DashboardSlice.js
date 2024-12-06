// DashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

const initialState = {
    allUserTasks: [], // For admin dashboard
    userTasks: [],    // For user dashboard
    loading: false,
    error: null,
};

const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        fetchTasksStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllTasksSuccess: (state, action) => {
            state.loading = false;
            state.allUserTasks = action.payload.data;
        },
        fetchUserTasksSuccess: (state, action) => {
            state.loading = false;
            state.userTasks = action.payload.data;
        },
        fetchTasksFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createTaskSuccess: (state, action) => {
            state.allUserTasks.push(action.payload);
            state.loading = false;
        },
        updateTaskSuccess: (state, action) => {
            state.allUserTasks = state.allUserTasks.map(userTasks => ({
                ...userTasks,
                tasks: userTasks.tasks.map(task => 
                    task._id === action.payload._id ? action.payload : task
                )
            }));
            state.userTasks = state.userTasks.map(task => 
                task._id === action.payload._id ? action.payload : task
            );
            state.loading = false;
        },
        deleteTaskSuccess: (state, action) => {
            state.allUserTasks = state.allUserTasks.map(userTasks => ({
                ...userTasks,
                tasks: userTasks.tasks.filter(task => task._id !== action.payload)
            }));
            state.userTasks = state.userTasks.filter(task => 
                task._id !== action.payload
            );
            state.loading = false;
        },
        deleteUserSuccess: (state, action) => {
            state.allUserTasks = state.allUserTasks.filter(userTasks => 
                userTasks.user._id !== action.payload
            );
            state.loading = false;
        }
    }
});

export const { 
    fetchTasksStart, 
    fetchAllTasksSuccess,
    fetchUserTasksSuccess, 
    fetchTasksFailure,
    createTaskSuccess,
    updateTaskSuccess,
    deleteTaskSuccess,
    deleteUserSuccess
} = DashboardSlice.actions;

// Admin Thunk actions
export const fetchAllUserTasks = () => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        const data = await api.getAllUserTasks();
        dispatch(fetchAllTasksSuccess(data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

// User Thunk actions
export const fetchUserTasks = () => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        const data = await api.getUserTasks();
        dispatch(fetchUserTasksSuccess(data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

// Other existing thunk actions...
export const createTask = (taskData) => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        const data = await api.createTask(taskData);
        dispatch(createTaskSuccess(data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const updateTask = ({taskId, taskData}) => async (dispatch) => {
    console.log(taskId, taskData);
    dispatch(fetchTasksStart());
    try {
        const data = await api.updateTask(taskId, taskData);
        dispatch(updateTaskSuccess(data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const updateStatusTask = (taskId, taskData) => async (dispatch) => {
    console.log(taskId, taskData);
    dispatch(fetchTasksStart());
    try {
        const data = await api.updateTask(taskId, taskData);
        dispatch(updateTaskSuccess(data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const deleteTask = (taskId) => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        await api.deleteTask(taskId);
        dispatch(deleteTaskSuccess(taskId));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const deleteUser = (userId) => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        await api.deleteUser(userId);
        dispatch(deleteUserSuccess(userId));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const updateTaskStatus = ({taskId, status}) => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        const data = await api.updateTaskStatus(taskId, status);
        dispatch(updateTaskSuccess(data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
}

export default DashboardSlice.reducer;