export const BASE_URL = "http://localhost:8000"

// utils/apiPath 
export const API_PATH = {
    AUTH : {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile"
    },
    USERS:{
        GET_ALL_USERS: "/api/users",
        GET_USERS_BY_ID: (userId) => `/api/users/${userId}`,
        UPDATE_USER: (userId) => `/api/users/${userId}`,
        CREATE_USER: "/api/users",
        DELETE_USER: (userId) => `/api/users/${userId}`,
    },

    ACTIONS: {
        GET_DASHBOARD_DATA: "/api/actions/dashboard-data",
        GET_USER_DASHBOARD_DATA: "/api/actions/user-dashboard-data",
        GET_ALL_ACTIONS: "/api/actions",
        GET_ACTION_BY_ID: (actionId) => `/api/actions/${actionId}`,
        CREATE_ACTION: "/api/actions",
        UPDATE_ACTION: (actionId) => `/api/actions/${actionId}`,
        DELETE_ACTION: (actionId) => `/api/actions/${actionId}`,

        UPDATE_ACTION_STATUS: (actionId) => `/api/actions/${actionId}/status`,
        UPDATE_ACTION_CHECKLIST: (actionId) => `/api/actions/${actionId}/acts`,
    },
    REPORTS:{
        EXPORT_ACTIONS : "/api/reports/export/actions",
        EXPORT_USERS : "/api/reports/export/users"
    },
    IMAGE:{
        UPLOAD_IMAGE: "/api/auth/upload-image"
    }
}