import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RejectedList.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

const RejectedList = () => {
  const { tenant_id, window_id } = useParams();
  const { accessToken } = useAuth();
  const [rejectedCustomers, setRejectedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchRejectedCustomers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/rejected/list/window-id?branch_id=${tenant_id}&window_id=${window_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRejectedCustomers(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(accessToken){
    fetchRejectedCustomers();
}
  }, [accessToken, tenant_id, window_id]);

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loader}></div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <table className={styles.customerTable}>
          <thead>
            <tr>
              <th>Queue no</th>
              <th>Intended service</th>
            </tr>
          </thead>
          <tbody>
            {rejectedCustomers.map((customer) => (
              <tr key={customer.id} className={styles.customerItem}>
                <td>{customer.queue_number}</td>
                <td>{customer.service?.service_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RejectedList;
