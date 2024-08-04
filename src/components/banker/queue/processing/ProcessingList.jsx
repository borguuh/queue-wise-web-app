import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProcessingList.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const ProcessingList = () => {
  const { tenant_id, window_id, queue_id } = useParams();
  const { accessToken, reload, setReload } = useAuth();
  const [processingCustomers, setProcessingCustomers] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState(window_id || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProcessingCustomers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/processing/list/window-id?branch_id=${tenant_id}&window_id=${window_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProcessingCustomers(response.data);
    } catch (error) {
      const errMsg = error.response?.data["detail"] ?? "Unknown error occurred";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/accepted/list/window-id?branch_id=${tenant_id}&window_id=${window_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSelectedWindow(response.data);
    } catch (error) {
      const errMsg = error.response?.data["detail"] ?? "Unknown error occurred";
      toast.error(errMsg);
      console.error("Error fetching accepted list:", error);
    }
  };

  const handleFinishedCustomer = async (customerId) => {
    try {
      await axios.put(
        `${BASE_URL}/queues/service-completed/client-by-window?window_id=${selectedWindow}&queue_id=${customerId}&branch_id=${tenant_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      const errMsg = error.response?.data["detail"] ?? "Unknown error occurred";
      toast.error(errMsg);
      console.error("Error calling customer:", error);
    }
  };

  const handleDone = async (customerId) => {
    setReload(!reload);
    try {
      await handleFinishedCustomer(customerId);
      await fetchProcessingCustomers(); // Refresh the processing list
      await fetchAcceptedList(); // Refresh the accepted list
    } catch (error) {
      console.error("Error updating customer status to accepted:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProcessingCustomers();
      fetchAcceptedList();
    }
  }, [accessToken, tenant_id, window_id, reload]);

  return (
    <div className={styles.container}>
      <Toaster />
      {loading && <div className={styles.loader}></div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <table className={styles.customerTable}>
          <thead>
            <tr>
              <th>Queue no</th>
              <th>Intended service</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processingCustomers.map((customer) => (
              <tr key={customer.id} className={styles.customerItem}>
                <td>{customer.queue_number}</td>
                <td>{customer.service?.service_name}</td>
                <td>
                  <button
                    onClick={() => handleDone(customer.id)}
                    className={styles.confirmButton}
                  >
                    Done
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcessingList;
