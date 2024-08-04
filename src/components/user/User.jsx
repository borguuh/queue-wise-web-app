import React, { useEffect, useState } from "react";
import styles from "./User.module.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../Authcontext";
import Add from "./add/Add";
import { BASE_URL } from "../../Constant";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

const User = () => {
  const { hqId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { userData, accessToken } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const users = response.data.filter(
        (ad) =>
          ad.role === "super-admin" ||
          ad.role === "admin" ||
          ad.role === "head-officer"
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
    if (accessToken){
    fetchUsers();
    }
  }, [accessToken, hqId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const users = response.data.filter(
        (ad) =>
          ad.role === "super-admin" ||
          ad.role === "admin" ||
          ad.role === "head-officer"
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

  const handleAddComplete = async (newUser) => {
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
      const url =
        selectedUser.role === "head-officer"
          ? `${BASE_URL}/delete?user_id=${selectedUser.id}&user_tenant_id=${hqId}`
          : `${BASE_URL}/admins/delete?user_id=${selectedUser.id}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      await handleUpdate();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting user:", error);
      console.error("Response data:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleRowClick = (user) => {
    if (user.role === "head-officer") {
      setSelectedUser(user);
      setShowUserDetails(true);
    }
  };

  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
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
            <span>Create User</span>
          </button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className={styles.loaderCon}>
                <div className={styles.loader}>Loading...</div>
              </td>
            </tr>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`${
                  user.role === "head-officer"
                    ? styles.clickable
                    : styles.nonClickable
                } ${
                  user.role === "super-admin"
                    ? styles.superAdmin
                    : user.role === "admin"
                    ? styles.admin
                    : ""
                }`}
                onClick={() => handleRowClick(user)}
              >
                <td>
                  <div className={styles.user}>
                    <div className={styles.userImageWrapper}>
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.username}
                          className={styles.userImage}
                        />
                      ) : (
                        <div className={styles.userInitials}>
                          {getInitials(user.username)}
                        </div>
                      )}
                    </div>
                    <div className={styles.userDetails}>
                      <p className={styles.userName} style={{color: ["admin", "super-admin"].includes(user.role) ? "black" : "#3498db"}}>{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className={styles[user.role]}>
                  {user.tenant_details?.name || ""}
                </td>
                <td className={styles.date}>
                  {new Date(user.created_at).toLocaleString()}
                </td>
                <td>
                  <div className={styles.del}>
                    {userData?.id !== user.id && (
                      <button
                        onClick={() => {
                          handleDeleteUser(user);
                        }}
                        className={`${styles.button} ${styles.delete}`}
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingUser && (
        <Add
          onClose={() => setIsAddingUser(false)}
          onAdd={handleAddComplete}
          hqId={hqId}
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
      {showUserDetails && selectedUser && (
        <div className={styles.modalOverlay}>
          <div
            className={`${styles.modal} ${
              !selectedUser.isActive ? styles.inactiveBranch : ""
            }`}
          >
            <div className={styles.userDetailsModal}>
              <h2>{selectedUser.username}</h2>
              <p>
                Organization:{" "}
                <span>{selectedUser.tenant_details?.name || ""}</span>
              </p>
              <p>
                Address: <span>{selectedUser.tenant_details.address}</span>
              </p>
              <p>
                Phone: <span>{selectedUser.tenant_details.contact_phone}</span>
              </p>
              <p>
                Email: <span>{selectedUser.tenant_details.contact_email}</span>
              </p>
              <p>
                Status:{" "}
                <span>
                  {selectedUser.tenant_details.isActive ? "True" : "Disabled"}
                </span>
              </p>
              <p>
                Created At:{" "}
                <span>
                  {new Date(selectedUser.created_at).toLocaleString()}
                </span>
              </p>
              <button
                onClick={() => setShowUserDetails(false)}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
