import React, { useEffect, useState } from "react";
import styles from "./BranchModify.module.css";
import { useAuth } from "../../../Authcontext";
import { BASE_URL } from "../../../Constant";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast'; 


const BranchModify = ({ onClose, branch, onModify }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { accessToken } = useAuth();

  useEffect(() => {
    if (branch && accessToken) {
      setName(branch.name);
      setAddress(branch.address);
      setEmail(branch.contact_email);
      setPhoneNumber(branch.contact_phone);
    }
  }, [branch, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/organization/update?model_id=${branch.id}`,
        { name, address, contact_email: email, contact_phone: phoneNumber },
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
      console.error("Error modifying headquarter:", error);
    }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Branch</h2>
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
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
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

export default BranchModify;
