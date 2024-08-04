import React, { useEffect, useState } from "react";
import styles from "./Desk.module.css";
import { MdSearch } from "react-icons/md";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../../Authcontext";
import { BASE_URL } from "../../../Constant";
import { useParams } from "react-router-dom";
import Add from "./add/Add";
import DeskModify from "./modify/DeskModify";
import { toast, Toaster } from 'react-hot-toast'; 

const Desk = () => {
  const { branchId } = useParams();
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingDesk, setIsAddingDesk] = useState(false);
  const [isEditingDesk, setIsEditingDesk] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { accessToken } = useAuth();

  const fetchDesks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/window/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDesks(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching desks:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (accessToken) {
      fetchDesks();
    }
  }, [branchId, accessToken]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/window/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDesks(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching desks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDesk = () => {
    setIsAddingDesk(true);
  };

  const handleAddComplete = async () => {
    await handleRefresh();
    setIsAddingDesk(false);
  };

  const handleEditDesk = (desk) => {
    setSelectedDesk(desk);
    setIsEditingDesk(true);
  };

  const handleEditComplete = async () => {
    setIsEditingDesk(false);
    await handleRefresh();
  };

  const handleDeleteWindow = (window) => {
    setSelectedDesk(window);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWindow = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/window/delete?branch_id=${branchId}&id=${selectedDesk.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeleteConfirm(false);
      setSelectedDesk(null);
      await handleUpdate();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting window:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedDesk(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.searchCon}>
          <MdSearch />
          <input
            type="text"
            placeholder="Search for a Desk..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
        <button onClick={handleAddDesk} className={styles.addButton}>
          <FaPlus />
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Desk Label</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" className={styles.loader}>
                Loading...
              </td>
            </tr>
          ) : desks.length > 0 ? (
            desks.map((desk) => (
              <tr key={desk.id}>
                <td>{desk.window_number}</td>
                <td className={styles.date}>
                  {new Date(desk.created_at).toLocaleString()}
                </td>
                <td>
                  <div className={styles.buttons}>
                    <div className={styles.modifyde}>
                      <button
                        onClick={() => handleEditDesk(desk)}
                        className={`${styles.button} ${styles.modify}`}
                      >
                        <FaCog />
                      </button>
                    </div>
                    <div className={styles.del}>
                      <button
                        onClick={() => handleDeleteWindow(desk)}
                        className={`${styles.button} ${styles.delete}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No Desks found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingDesk && (
        <Add
          onClose={() => setIsAddingDesk(false)}
          onAdd={handleAddComplete}
          branchId={branchId}
        />
      )}
      {isEditingDesk && (
        <DeskModify
          onClose={() => setIsEditingDesk(false)}
          window={selectedDesk}
          onModify={handleEditComplete}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Are you sure you want to delete?</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDeleteWindow}
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

export default Desk;
