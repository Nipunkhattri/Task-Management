import { configureStore } from "@reduxjs/toolkit";
import authReducers from './features/AuthSlice';
import dashboardReducers from './features/DashboardSlice';

const store = configureStore({
    reducer: {
        auth: authReducers,
        dashboard : dashboardReducers
    },
});
export default store;