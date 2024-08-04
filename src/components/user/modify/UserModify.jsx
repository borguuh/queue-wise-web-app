import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UserModify.module.css";
import { BASE_URL } from "../../../Constant";
import { useAuth } from "../../../Authcontext";

const UserModify = ({ userId, onClose, onUpdate }) => {
  const [userDetails, setUserDetails] = useState({ username: "", role: "" });
  const { accessToken } = useAuth();

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
   if (accessToken){
    fetchUserDetails();
   }
  }, [userId, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://3.129.249.222:8000/user/${userId}`,
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "head-officer", label: "Head-Officer" },
    { value: "branch-manager", label: "Branch-Manager" },
    { value: "clerk", label: "Clerk" },
    // Add more roles as needed
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={userDetails.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Role:
            <select
              name="role"
              value={userDetails.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select role</option>
              {roleOptions
                .filter((role) => role.value !== userDetails.role)
                .map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
            </select>
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

export default UserModify;
