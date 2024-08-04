import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Banker.module.css";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import { useParams } from "react-router-dom";
import AddAssign from "./add/AddAssign";
import { MdSearch } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast'; 

const Banker = () => {
  const { tenant_id } = useParams();
  const [clerks, setClerks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAssign, setIsAddingAssign] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");


  const fetchClerks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/clerk/all/info?branch_id=${tenant_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setClerks(response.data);
    } catch (error) {
      console.error("Error fetching clerks:", error);
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
   if (accessToken){
    fetchClerks();
   }
  }, [accessToken, tenant_id]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/clerk/all/info?branch_id=${tenant_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setClerks(response.data);
    } catch (error) {
      console.error("Error fetching clerks:", error);
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteEntry = (entry) => {
    setSelectedAssign(entry);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEntry = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/clerk/delete_by_id?id=${selectedAssign.id}&branch_id=${tenant_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeleteConfirm(false);
      setSelectedAssign(null);
      await handleUpdate();
    } catch (error) { const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting clerk:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedAssign(null);
  };

  const handleAddClick = () => {
    setIsAddingAssign(true);
  };

  const handleAddComplete = async () => {
    setIsAddingAssign(false);
    await handleUpdate();
  };

  const filteredClerks = clerks.filter(
    (clerk) =>
      clerk.window?.window_number.toString().includes(searchQuery) ||
      clerk.service?.service_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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
        <div className={styles.addButtonWrapper}>
          <button className={styles.addButton} onClick={handleAddClick}>
            <FaPlus />
            <span>Create entry</span>
          </button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Window Number</th>
            <th>Service Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className={styles.loaderCon}>
                <div className={styles.loader}>Loading...</div>
              </td>
            </tr>
          ) : filteredClerks.length > 0 ? (
            filteredClerks.map((clerk) => (
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
              <td colSpan="3">No clerks found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingAssign && (
        <AddAssign
          onClose={() => setIsAddingAssign(false)}
          onAdd={handleAddComplete}
          branchId={tenant_id}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Are you sure you want to delete this entry?</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDeleteEntry}
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

export default Banker;
