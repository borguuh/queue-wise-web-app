import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Authcontext";
import styles from "./AddHo.module.css";
import { BASE_URL } from "../../../Constant";
import { toast, Toaster } from 'react-hot-toast'; 

const AddHo = ({ onClose, onAdd, hqId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("head-officer");
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
        "username": username,
        "password": password,
        "tenant_id": hqId,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/create/head-officer`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onAdd(response.data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error creating head-officer:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Head Officer</h2>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Role:
            <input type="text" value={role} disabled />
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Create
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHo;
