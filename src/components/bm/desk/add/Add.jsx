import React, { useState } from "react";
import styles from "./Add.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast'; 

const Add = ({ onClose, onAdd, branchId }) => {
  const [number, setNumber] = useState("");
  const [published, setPublished] = useState(true);
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        window_number: number,
        tenant_id: branchId,
        published: true,
      };
      const response = await axios.post(`${BASE_URL}/window/create`, 
        data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onAdd(response.data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error creating desk:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Desk</h2>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <label>
            Name of Desk:
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </label>
          <label>
            Published:
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
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

export default Add;
