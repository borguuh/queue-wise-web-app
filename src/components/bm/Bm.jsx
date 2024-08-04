import React, { useEffect, useState } from "react";
import styles from "./Bm.module.css";
import { MdSearch } from "react-icons/md";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../Authcontext";
import { useParams } from "react-router-dom";
import Add from "./add/Add";
import { BASE_URL } from "../../Constant";
import BmModify from "./modify/BmModify";
import { toast, Toaster } from 'react-hot-toast'; 

const Bm = () => {
  const { branchId } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingService, setIsAddingService] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { accessToken } = useAuth();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/service/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setServices(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (accessToken){
    fetchServices();
  }
  }, [branchId, accessToken]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/service/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setServices(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsEditingService(true);
  };

  const handleEditComplete = async () => {
    setIsEditingService(false);
    await handleChange();
  };

  const filteredServices = services.filter(
    (service) =>
      service.service_name &&
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = () => {
    setIsAddingService(true);
  };

  const handleAddComplete = async () => {
    await handleChange();
    setIsAddingService(false);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteService = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/service/delete?id=${selectedService.id}&branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowDeleteConfirm(false);
      setSelectedService(null);
      await handleChange();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error deleting service:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedService(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.searchCon}>
          <MdSearch />
          <input
            type="text"
            placeholder="Search for a service..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
        <button onClick={handleAddService} className={styles.addButton}>
          <FaPlus />
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className={styles.loader}>
                Loading...
              </td>
            </tr>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <tr key={service.id}>
                <td>{service.service_name}</td>
                <td>{service.service_description}</td>
                <td className={styles.date}>{new Date(service.created_at).toLocaleString()}</td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      onClick={() => handleEditService(service)}
                      className={`${styles.button} ${styles.modify}`}
                      title="Modify"
                    >
                      <FaCog />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className={`${styles.button} ${styles.delete}`}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No services found</td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingService && (
        <Add
          onClose={() => setIsAddingService(false)}
          onAdd={handleAddComplete}
          branchId={branchId}
        />
      )}
      {isEditingService && (
        <BmModify
          onClose={() => setIsEditingService(false)}
          service={selectedService}
          onModify={handleEditComplete}
          branchId={branchId}
        />
      )}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Are you sure you want to delete?</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDeleteService}
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

export default Bm;
