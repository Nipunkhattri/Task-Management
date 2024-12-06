let logoutCallback = null;

export const setLogoutCallback = (callback) => {
    logoutCallback = callback;
};

export const handleLogout = () => {
    if (logoutCallback) {
        logoutCallback();
    }
};