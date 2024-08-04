import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import styles from "./DeskModify.module.css";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast'; 

const DeskModify = ({ onClose, window, branchId, onModify }) => {
  const [number, setNumber] = useState("");
  const [published, setPublished] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (window && accessToken) {
      setNumber(window.window_number);
      setPublished(window.published ?? true);
    }
  }, [window, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/window/edit?branch_id=${branchId}?tenant_id=${window.id}`,
        { window_number: number, tenant_id: branchId, published: published },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onModify(response.data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error modifying Desk:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Desk</h2>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <label>
            Name:
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
              Save
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

export default DeskModify;
