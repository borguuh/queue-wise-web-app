import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Authcontext";
import { BASE_URL } from "../../../Constant";
import styles from "./BmModify.module.css";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast'; 

const BmModify = ({ onClose, service, branchId, onModify }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (service && accessToken) {
      setName(service.service_name);
      setDescription(service.service_description);
      setPublished(service.published ?? true);
    }
  }, [service, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/service/edit?id=${service.id}&branch_id=${branchId}`,
        {
          service_name: name,
          service_description: description,
          tenant_id: branchId,
          published: published,
        },
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
      console.error("Error modifying Service:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Service</h2>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default BmModify;
