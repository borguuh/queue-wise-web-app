import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import styles from "./Add.module.css";
import { toast, Toaster } from 'react-hot-toast'; 

const CreateUser = ({ onClose, onAdd, branchId }) => {
  const { accessToken } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("clerk");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = {
        username: name,
        password: password,
        role: role,
        branch_id: branchId,
      };
      const response = await axios.post(`${BASE_URL}/create/other/user`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      onAdd(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      // setError("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create New User</h2>
        <form onSubmit={handleCreateUser} className={styles.formGroup}>
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
            Password:
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Role:
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="clerk">Clerk</option>
              <option value="ticket-dispenser">Ticket Dispenser</option>
              <option value="display">Display</option>
            </select>
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
