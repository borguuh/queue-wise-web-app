import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./Constant";
import { toast, Toaster } from 'react-hot-toast'; 


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const getToken = () => {
  
    const newToken = localStorage.getItem("QueueWise")
    return newToken;
  }
  


export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [reload, setReload] = useState(true);

   const refreshToken = async () => {
    const refresh = localStorage.getItem("QueueWise-refresh")
    if (refresh) {
    try {
      const response = await axios.post(`${BASE_URL}/refresh?refresh_token=${refresh}`)
      console.log(response);
      setAccessToken(response.data.access_token);
      localStorage.setItem("QueueWise", response.data.access_token)
      fetchUserData();
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      setUserData(null);
      setAccessToken(null);
      localStorage.setItem("QueueWise", null)
      localStorage.setItem("QueueWise-refresh", null)
      toast.error("Session expired. Please log in again."); 
    }
  }
  }

  const fetchUserData = async () => {
    let currentToken
    currentToken = getToken()
    try {
      const response = await axios.get(`${BASE_URL}/logged/user`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      setUserData(response.data);
      setAccessToken(currentToken);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      if(error.response.status === 401){
        await refreshToken(); 
      } else {
        const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
        toast.error(errMsg);
      }
    }
  };

  
  return (
    <>
      <Toaster /> {/* Add Toaster component here */}
      <AuthContext.Provider
        value={{ accessToken, setAccessToken, userData, fetchUserData, setUserData, reload, setReload }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};