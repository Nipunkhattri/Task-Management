import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { toast } from 'react-toastify';

const initialState = {
    username: null,
    loading: false,
    error: null,
    token : null
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.username = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = AuthSlice.actions;

export const { reducers : AuthReducers } = AuthSlice;


const login = (email, password) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await api.login(email, password);
        const data = response.data;
        console.log(data);
        dispatch(loginSuccess(data));
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        dispatch(loginFailure(error.message));
        toast.error('Invalid email or password');
    }
}

const register = (username, email, password) => async (dispatch) => {
    try {
        console.log(username,email,password);
        const data = await api.register(username, email, password);
        toast.success('Registration successful');
        return data
    } catch (error) {
        dispatch(loginFailure(error.message));
        toast.error('Invalid email or password');
    }
}

const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch(logout());
};

export { login , register , logoutUser};

export default AuthSlice.reducer;