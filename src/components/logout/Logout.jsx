import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import styles from "./Logout.module.css";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

const Logout = ({ onClose }) => {
  const { accessToken, setAccessToken, setUserData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAccessToken(null);
      setUserData(null);
      navigate("/");
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Are you sure you want to log out?</h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleLogout}
            className={styles.yesButton}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Yes"}
          </button>
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
