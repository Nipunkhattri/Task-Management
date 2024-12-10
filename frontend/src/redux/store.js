import { configureStore } from "@reduxjs/toolkit";
import authReducers from './features/AuthSlice';
import dashboardReducers from './features/DashboardSlice';
import themeReducer from './features/themeSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducers,
        dashboard : dashboardReducers,
        theme : themeReducer
    },
});
export default store;