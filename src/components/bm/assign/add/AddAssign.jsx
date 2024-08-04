import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AddAssign.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant"
import { toast, Toaster } from 'react-hot-toast'; 

const AddAssign = ({ onClose, onAdd, branchId }) => {
  const [services, setServices] = useState([]);
  const [windows, setWindows] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const { accessToken } = useAuth();

  const fetchServices = async () => {
    try {
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
    }
  };

  const fetchWindows = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/window/all?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setWindows(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching windows:", error);
    }
  };

  useEffect(() => {
  if (accessToken){
    fetchServices();
    fetchWindows();
  }
  }, [accessToken, branchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        service_id: selectedService,
        window_id: selectedWindow,
        branch_id: branchId,
      };
      const response = await axios.post(
        `${BASE_URL}/clerk/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onAdd(response.data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error creating clerk:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Clerk Assignment</h2>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <label>
            Service:
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Window:
            <select
              value={selectedWindow}
              onChange={(e) => setSelectedWindow(e.target.value)}
              required
            >
              <option value="">Select a Desk</option>
              {windows.map((window) => (
                <option key={window.id} value={window.id}>
                  {window.window_number}
                </option>
              ))}
            </select>
          </label>
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
        </form>
      </div>
    </div>
  );
};

export default AddAssign;
