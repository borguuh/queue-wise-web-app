import React, { useEffect, useState } from "react";
import styles from "./Ho.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import axios from "axios";
import { FaCog, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Add from "./add/Add";
import BranchModify from "./modify/BranchModify";
import { toast, Toaster } from 'react-hot-toast'; 

const Ho = () => {
  const { hqId } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/headquarter/branches/all?model_id=${hqId}`,
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
      console.log("Response data:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken){
      fetchBranches();
    }
  }, [hqId, accessToken]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/headquarter/branches/all?model_id=${hqId}`,
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
      console.log("Response data:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchClick = (branchId) => {
    navigate(`/branches/${branchId}/dashboard`);
  };

  const handleAddBranch = () => {
    setIsAddingBranch(true);
  };

  const handleAddComplete = async (newBranch) => {
    setIsAddingBranch(false);
    await handleChange();
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setIsEditingBranch(true);
  };

  const handleEditComplete = async () => {
    setIsEditingBranch(false);
    await handleChange();
  };

  const handleDeleteBranch = (branch) => {
    setSelectedBranch(branch);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBranch = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/headquarters/${hqId}/branch/${selectedBranch.id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeleteConfirm(false);
      setSelectedBranch(null);
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting branch:", error);
      console.log("Response data:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedBranch(null);
  };

  const handleActivate = async (branch) => {
    setSelectedBranch(branch);
    setShowActivateConfirm(true);
  };

  const confirmActivateBranch = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/headquarters/${hqId}/branches/${selectedBranch.id}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowActivateConfirm(false);
      setSelectedBranch(null);
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error activating branch:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelActivate = () => {
    setShowActivateConfirm(false);
    setSelectedBranch(null);
  };

  const handleDeactivate = (branch) => {
    setSelectedBranch(branch);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivateBranch = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/headquarters/${hqId}/branches/${selectedBranch.id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeactivateConfirm(false);
      setSelectedBranch(null);
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deactivating branch:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDeactivate = () => {
    setShowDeactivateConfirm(false);
    setSelectedBranch(null);
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.contact_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.searchCon}>
          <MdSearch />
          <input
            type="text"
            placeholder="Search for a Branch..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
        <button onClick={handleAddBranch} className={styles.addButton}>
          <FaPlus />
          <span>Create Branch</span>
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className={styles.loaderCon}>
                <div className={styles.loader}></div>
              </td>
            </tr>
          ) : filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <tr
                key={branch.id}
                className={`${styles.branchItem} ${
                  !branch.isActive ? styles.inactive : ""
                }`}
              >
                <td
                  className={styles.userName}
                  onClick={() => handleBranchClick(branch.id)}
                >
                  {branch.name}
                </td>
                <td>{branch.address}</td>
                <td>{branch.contact_email}</td>
                <td>{branch.contact_phone}</td>
                <td>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={branch.isActive}
                      onChange={() =>
                        branch.isActive
                          ? handleDeactivate(branch)
                          : handleActivate(branch)
                      }
                    />
                    <span className={styles.slider}></span>
                  </label>
                </td>
                <td>
                  <div className={styles.iconButtons}>
                    <FaEye
                      className={styles.icon}
                      onClick={() => handleEditBranch(branch)}
                      disabled={!branch.isActive}
                      title="Modify"
                    />
                    <FaTrash
                      className={styles.Trashicon}
                      onClick={() => handleDeleteBranch(branch)}
                      disabled={!branch.isActive}
                      title="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No Branch found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingBranch && (
        <Add
          onClose={() => setIsAddingBranch(false)}
          onAdd={handleAddComplete}
          headquarterId={hqId}
        />
      )}
      {isEditingBranch && (
        <BranchModify
          onClose={() => setIsEditingBranch(false)}
          branch={selectedBranch}
          onModify={handleEditComplete}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Are you sure you want to delete?</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDeleteBranch}
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
      {showActivateConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              Are you sure you want to activate the branch and its services?
            </h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmActivateBranch}
                className={styles.confirmButton}
              >
                Yes
              </button>
              <button onClick={cancelActivate} className={styles.cancelButton}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeactivateConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              Are you sure you want to deactivate the branch and its services?
            </h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={cancelDeactivate}
                className={styles.cancelButton}
              >
                No
              </button>
              <button
                onClick={confirmDeactivateBranch}
                className={styles.confirmButton}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ho;
