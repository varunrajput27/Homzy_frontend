import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); 

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData)); 
        setIsLoggedIn(true);
        setUser(userData); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.jsx

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios'; // <-- 1. AXIOS IMPORT KIYA HAI YAHAN

// // GLOBAL LOGOUT FUNCTION
// export const globalLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user'); 
//     window.location.href = '/login'; 
// };

// // 🔥 YEH FUNCTION AXIOS PAR INTERCEPTOR LAGATA HAI
// const setupAxiosInterceptor = () => {
    
//     // Response Interceptor: Checks for 401 and calls globalLogout
//     axios.interceptors.response.use(
//         (response) => {
//             return response;
//         },
//         (error) => {
//             // Check for 401 Unauthorized status
//             if (error.response && error.response.status === 401) {
//                 console.warn("JWT Expired. Forcing global logout and redirecting.");
//                 globalLogout(); // Logout and Redirect
//             }
//             return Promise.reject(error);
//         }
//     );

//     // Request Interceptor: Automatically adds token to API calls
//     axios.interceptors.request.use(
//         (config) => {
//             const token = localStorage.getItem('token');
//             // Ek basic check ki call hamari API par ja rahi hai ya nahi
//             const isApiCall = config.url && config.url.startsWith(import.meta.env.VITE_API_BASE_URL || '/api');
            
//             if (token && isApiCall) {
//                 config.headers.Authorization = `Bearer ${token}`; 
//             }
//             return config;
//         },
//         (error) => {
//             return Promise.reject(error);
//         }
//     );
// };

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
//     const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); 

//     // 🔥 2. useEffect to setup interceptor once when AuthProvider mounts
//     useEffect(() => {
//         setupAxiosInterceptor();
//     }, []); // Runs only once

//     const login = (token, userData) => {
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(userData)); 
//         setIsLoggedIn(true);
//         setUser(userData); 
//     };

//     const localLogout = () => {
//         setIsLoggedIn(false);
//         setUser(null);
//         globalLogout(); 
//     };

//     return (
//         <AuthContext.Provider value={{ isLoggedIn, user, login, logout: localLogout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
