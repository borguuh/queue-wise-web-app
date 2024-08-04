import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import { useNavigate } from "react-router-dom";
import styles from "./Org.module.css";
import { FaCog, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Add from "./add/Add";
import OrgModify from "./modify/OrgModify";
import { toast, Toaster } from 'react-hot-toast'; 

const Org = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingHq, setIsAddingHq] = useState(false);
  const [isEditingHq, setIsEditingHq] = useState(false);
  const [selectedHq, setSelectedHq] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/headquarters/all?skip=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const headOrganizations = response.data.filter(
        (org) => org.organization_type === "HEAD"
      );
      setOrganizations(headOrganizations);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   if (accessToken){
    fetchOrganizations();
   }
  }, [accessToken]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/headquarters/all?skip=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const headOrganizations = response.data.filter(
        (org) => org.organization_type === "HEAD"
      );
      setOrganizations(headOrganizations);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching headquarters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHqClick = (hqId) => {
    navigate(`/headquarters/${hqId}/dashboard`);
  };

  const handleEditHeadquarter = (organization) => {
    setSelectedHq(organization);
    setIsEditingHq(true);
  };

  const handleEditComplete = async () => {
    setIsEditingHq(false);
    await handleChange();
  };

  const handleAddHeadquarter = () => {
    setIsAddingHq(true);
  };

  const handleAddComplete = async (newHq) => {
    setIsAddingHq(false);
    await handleChange();
  };

  const handleActivate = async () => {
    try {
      await axios.put(
        `${BASE_URL}/organization/activate?model_id=${selectedHq.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error activating organization:", error);
    } finally {
      setShowActivateConfirm(false);
      setSelectedHq(null);
    }
  };

  const handleDeactivate = async () => {
    try {
      await axios.put(
        `${BASE_URL}/organization/deactivate?model_id=${selectedHq.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deactivating organization:", error);
    } finally {
      setShowDeactivateConfirm(false);
      setSelectedHq(null);
    }
  };

  const handleDeleteHeadquarter = (organization) => {
    setSelectedHq(organization);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteHeadquarter = async () => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/organization/${selectedHq.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setShowDeleteConfirm(false);
      setSelectedHq(null);
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedHq(null);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const names = name.split(" ");
    return (
      names[0].charAt(0).toUpperCase() +
      (names.length > 1 ? names[1].charAt(0).toUpperCase() : "")
    );
  };

  const filteredOrganizations = organizations.filter(
    (organization) =>
      organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organization.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organization.contact_email
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
            placeholder="Search for a HQ..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
        <button onClick={handleAddHeadquarter} className={styles.addButton}>
          <FaPlus />
          <span>Create HQ</span>
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
                <div>Loading...</div>
              </td>
            </tr>
          ) : filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((organization) => (
              <tr
                key={organization.id}
                className={`${styles.hqItem} ${
                  !organization.isActive ? styles.inactive : ""
                }`}
              >
                <td
                  className={styles.userName}
                  onClick={() => handleHqClick(organization.id)}
                >
                  {organization.name}
                </td>
                <td>{organization.address}</td>
                <td>{organization.contact_email}</td>
                <td>{organization.contact_phone}</td>
                <td>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={organization.isActive}
                      onChange={() =>
                        organization.isActive
                          ? (setSelectedHq(organization),
                            setShowDeactivateConfirm(true))
                          : (setSelectedHq(organization),
                            setShowActivateConfirm(true))
                      }
                    />
                    <span className={styles.slider}></span>
                  </label>
                </td>
                <td>
                  <div className={styles.iconButtons}>
                    <FaEye
                      className={styles.icon}
                      onClick={() => handleEditHeadquarter(organization)}
                      title="Modify"
                    />
                    <FaTrash
                      className={styles.deleteIcon}
                      onClick={() => handleDeleteHeadquarter(organization)}
                      title="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No Headquarter found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingHq && (
        <Add
          onClose={() => setIsAddingHq(false)}
          onAdd={handleAddComplete}
          organizationType="HEAD"
        />
      )}
      {isEditingHq && (
        <OrgModify
          onClose={() => setIsEditingHq(false)}
          organization={selectedHq}
          onModify={handleEditComplete}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Are you sure you want to delete?</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDeleteHeadquarter}
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
              Are you sure you want to activate a headquarter and its
              organizations?
            </h2>
            <div className={styles.buttonGroup}>
              <button onClick={handleActivate} className={styles.confirmButton}>
                Yes
              </button>
              <button
                onClick={() => setShowActivateConfirm(false)}
                className={styles.cancelButton}
              >
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
              Are you sure you want to deactivate a headquarter and its
              organizations?
            </h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={handleDeactivate}
                className={styles.confirmButton}
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className={styles.cancelButton}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Org;
