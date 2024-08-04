import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Waiting.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

const Waiting = () => {
    const { tenant_id, window_id } = useParams();
  const { accessToken, reload } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/queues/waiting/list/window-id?branch_id=${tenant_id}&window_id=${window_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCustomers(response.data);
    } catch (error) {
      // setError(error.message);
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if(accessToken){
    console.log(window_id);
    console.log(accessToken);
    if (!window_id) return;

    fetchCustomers();
    }
  }, [accessToken, tenant_id, window_id, reload]);

  return (
    <table className={styles.customerTable}>
      <thead>
        <tr>
          <th>Queue no</th>
          <th>Intended service</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="2" className={styles.loader}></td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan="2" className={styles.error}>
              {error}
            </td>
          </tr>
        )}
        {!loading &&
          !error &&
          customers.map((customer) => (
            <tr key={customer.id} className={styles.customerItem}>
              <td>{customer.queue_number}</td>
              <td>{customer.service?.service_name}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Waiting;
