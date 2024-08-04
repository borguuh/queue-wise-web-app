import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DeskAssign.module.css";
import { useAuth } from "../../../Authcontext";
import { BASE_URL } from "../../../Constant";
import { useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import AddAssign from "./add/AddAssign";
import { toast, Toaster } from 'react-hot-toast'; 

const DeskAssign = () => {
  const { branchId } = useParams();
  const [clerksInfo, setClerksInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { accessToken } = useAuth();
  const [isAddingAssign, setIsAddingAssign] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);

  const fetchClerksInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/clerk/all/info?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setClerksInfo(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (accessToken){
    fetchClerksInfo();
  }
  }, [accessToken, branchId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/clerk/all/info?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setClerksInfo(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = (entry) => {
    setSelectedAssign(entry);
    setDeleteAll(false);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEntry = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/clerk/delete_by_id?id=${selectedAssign.id}&branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeleteConfirm(false);
      setSelectedAssign(null);
      await handleUpdate();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting clerk:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedAssign(null);
  };

  const handleDeleteAllEntries = () => {
    setDeleteAll(true);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAllClerks = async () => {
    try {
      await axios.delete(`${BASE_URL}/clerk/delete/all?branch_id=${branchId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setShowDeleteConfirm(false);
      setClerksInfo([]);
      await handleUpdate();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting all clerks:", error);
    }
  };

  const handleAddClick = () => {
    setIsAddingAssign(true);
  };

  const handleAddComplete = async () => {
    setIsAddingAssign(false);
    await handleUpdate();
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.searchCon}>
          <MdSearch />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <div className={styles.addButtonWrapper}>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteAllEntries}
            >
              <FaTrash />
              <span>Delete All entries</span>
            </button>
          </div>
          <div className={styles.addButtonWrapper}>
            <button className={styles.addButton} onClick={handleAddClick}>
              <FaPlus />
              <span>Create entry</span>
            </button>
          </div>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Desk label</th>
            <th>Service Assigned to</th>
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
          ) : clerksInfo.length > 0 ? (
            clerksInfo
              .filter(
                (clerk) =>
                  clerk.window?.window_number
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  clerk.service?.service_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((clerk) => (
                <tr key={clerk.id}>
                  <td>{clerk.window?.window_number}</td>
                  <td>{clerk.service?.service_name}</td>
                  <td>
                    <div className={styles.del}>
                      <button
                        onClick={() => handleDeleteEntry(clerk)}
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
              <td colSpan="3">No assignment found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingAssign && (
        <AddAssign
          onClose={() => setIsAddingAssign(false)}
          onAdd={handleAddComplete}
          branchId={branchId}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {deleteAll
                ? "Are you sure you want to delete all entries?"
                : "Are you sure you want to delete this entry?"}
            </h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={
                  deleteAll ? confirmDeleteAllClerks : confirmDeleteEntry
                }
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

export default DeskAssign;
