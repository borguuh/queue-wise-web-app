import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../Authcontext";
import axios from "axios";
import { BASE_URL } from "../../../Constant";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import styles from "./BmUsers.module.css";
import Add from "./add/Add";
import { toast, Toaster } from 'react-hot-toast'; 

const BmUsers = () => {
  const { branchId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { accessToken } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/organization/users/all?tenant_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const users = response.data.filter(
        (ad) => ad.role === "clerk" || ad.role === "ticket-dispenser" || ad.role === "display"
      );
      setUsers(users);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken, branchId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
       `${BASE_URL}/organization/users/all?tenant_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const users = response.data.filter(
        (ad) => ad.role === "clerk" || ad.role === "ticket-dispenser"
      );
      setUsers(users);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const names = name.split(" ");
    return (
      names[0].charAt(0).toUpperCase() +
      (names.length > 1 ? names[1].charAt(0).toUpperCase() : "")
    );
  };

  const handleAddClick = () => {
    setIsAddingUser(true);
  };

  const handleAddComplete = async () => {
    setIsAddingUser(false);
    await handleUpdate();
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/delete?user_id=${selectedUser.id}&user_tenant_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      await handleUpdate();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error delecting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.searchCon}>
          <MdSearch />
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
        <div className={styles.addButtonWrapper}>
          <button onClick={handleAddClick} className={styles.addButton}>
            <FaPlus />
          </button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Created at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className={styles.loaderCon}>
                <div className={styles.loader}></div>
              </td>
            </tr>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.user}>
                    <div className={styles.userImage}>
                      {getInitials(user.username)}
                    </div>
                    <div className={styles.name}>
                      <p className={styles.username}>{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className={styles[user.role]}>{user.role}</td>
                <td className={styles.date}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className={styles.del}>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className={`${styles.button} ${styles.delete}`}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingUser && (
        <Add
          onClose={() => setIsAddingUser(false)}
          onAdd={handleAddComplete}
          branchId={branchId}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Are you sure you want to delete?</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDeleteUser}
                className={styles.confirmButton}
              >
                Yes
              </button>
              <button onClick={cancelDelete} className={styles.cancelButton}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmUsers;
