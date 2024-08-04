import React, { useState, useEffect } from "react";
import styles from "./AddUser.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast'; 

const AddUsers = ({ onClose, onAdd, branchId }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(branchId || "");
  const { accessToken } = useAuth();

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        `http://165.232.140.213:8000/headquarter/branches/all?model_id=f732dff7-5d5c-4cee-9fb1-0135013366a8`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBranches(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
  if (accessToken){
    fetchBranches();
  }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        username: name,
        password: password,
        branch_id: selectedBranch,
      };
      const response = await axios.post(
        `${BASE_URL}/create/branch-manager`,
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
      console.error("Error creating branch manager:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Manager</h2>
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
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Branch:
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              required
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
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

export default AddUsers;
