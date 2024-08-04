import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Security.module.css";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaQuestion, FaSignOutAlt } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast'; 

const Security = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const { accessToken } = useAuth();
  const { tenant_id } = useParams();
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/service/all?branch_id=${tenant_id}`,
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

  useEffect(() => {
    if (accessToken) {
      fetchServices();
    }
  }, [accessToken, tenant_id]);

  const joinQueue = async (serviceId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/queues/join?service_id=${serviceId}&branch_id=${tenant_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate(`/ticket`, { state: { ticket: response.data } });
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error joining queue:", error);
    }
  };

  const handleShowInfo = (service) => {
    console.log("Service clicked:", service); // Debug log
    setSelectedService(service);
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setSelectedService(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <button className={styles.logout}>
          <Link to="/logout">
            <FaSignOutAlt className={styles.icon} /> Logout
          </Link>
        </button>
      </div>
      <div className={styles.serviceList}>
        {services.map((service) => (
          <div
            key={service.id}
            className={styles.serviceCard}
            onClick={() => joinQueue(service.id)}
          >
            <div className={styles.serviceContent}>
              <div
                className={styles.button}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowInfo(service);
                }}
              >
                <FaQuestion />
              </div>
              <h2>{service.service_name}</h2>
              <p>Select to join queue</p>
            </div>
          </div>
        ))}
      </div>
      {showInfo && selectedService && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{selectedService.service_name}</h2>
            <p>{selectedService.service_description}</p>
            <button onClick={handleCloseInfo} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
