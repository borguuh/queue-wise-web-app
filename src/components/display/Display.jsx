import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Display.module.css";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import { Link, useParams } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast'; 

const Display = () => {
  const [calledList, setCalledList] = useState([]);
  const { accessToken } = useAuth();
  const { tenant_id } = useParams();

  const fetchCalledList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/called/list?branch_id=${tenant_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCalledList(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching called list:", error);
    }
  };

  useEffect(() => {
    if (accessToken){
      fetchCalledList();
    }
  }, [accessToken, tenant_id]);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Queue Number</th>
            <th>Service Intended</th>
            <th>Window Number</th>
          </tr>
        </thead>
        <tbody>
          {calledList.map((item) => (
            <tr
              key={item.id}
              className={item.id % 2 === 0 ? styles.activeRow : ""}
            >
              <td>{item.queue_number}</td>
              <td>{item.service?.service_name}</td>
              <td>{item.window?.window_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.logout}>
        <Link to="/logout">
          <FaSignOutAlt className={styles.icon} /> Logout
        </Link>
      </button>
    </div>
  );
};

export default Display;
