import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Add.module.css";
import { useAuth } from "../../../Authcontext";
import { ADMIN_URL, HEAD_OFFICER_URL, BASE_URL } from "../../../Constant";
import { toast, Toaster } from 'react-hot-toast'; 

const Add = ({ onClose, onAdd }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [headquarters, setHeadquarters] = useState([]);
  const [selectedHqId, setSelectedHqId] = useState("");
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  const fetchHeadquarters = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/headquarters/all?skip=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setHeadquarters(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching headquarters:", error);
    }
  };


  useEffect(() => {
  if (accessToken){
    fetchHeadquarters();
  }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { username, password, };
      let url = ADMIN_URL;
      if (role === "head-officer") {
        userData.hq_id = selectedHqId;
        url = HEAD_OFFICER_URL;
      }
      const response = await axios.post(url, userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onAdd(response.data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      // setError(
      //   `Error creating ${role}: ${error.response?.status} ${error.response?.statusText}`
      // );
      console.error(`Error creating ${role}:`, error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create User</h2>
        <div className={styles.toggleContainer}>
          <div
            className={`${styles.toggle} ${
              role === "admin" ? styles.active : ""
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </div>
          <div
            className={`${styles.toggle} ${
              role === "head-officer" ? styles.active : ""
            }`}
            onClick={() => setRole("head-officer")}
          >
            Head Officer
          </div>
        </div>
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
          {role === "head-officer" && (
            <label>
              Headquarter:
              <select
                value={selectedHqId}
                onChange={(e) => setSelectedHqId(e.target.value)}
                required
              >
                <option value="">Select Headquarter</option>
                {headquarters.map((hq) => (
                  <option key={hq.id} value={hq.id}>
                    {hq.name}
                  </option>
                ))}
              </select>
            </label>
          )}
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
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Add;
