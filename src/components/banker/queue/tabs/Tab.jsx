import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Tab.module.css";
import { useAuth } from "../../../../Authcontext";
import { BASE_URL } from "../../../../Constant";
import { toast, Toaster } from 'react-hot-toast'; 

const Tab = () => {
  const { tenant_id, window_id } = useParams();
  const { accessToken, setReload, reload } = useAuth();
  const [windows, setWindows] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [calledList, setCalledList] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [selectedWindow, setSelectedWindow] = useState(window_id || "");
  const [showPopup, setShowPopup] = useState(false);
  const [popupButtons, setPopupButtons] = useState("initial");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  const fetchWindows = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/window/all?branch_id=${tenant_id}`,
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

  const fetchWaitingList = async () => {
    if (accessToken) {
      try {
        const response = await axios.get(
          `${BASE_URL}/queues/waiting/list/window-id?branch_id=${tenant_id}&window_id=${selectedWindow}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setWaitingList(response.data);
      } catch (error) {
        const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
        toast.error(errMsg);
        console.error("Error fetching waiting list:", error);
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchWindows();
      if (selectedWindow) {
        fetchWaitingList();
      }
    }
  }, [accessToken, tenant_id, selectedWindow]);

  useEffect(() => {
    if (selectedWindow && accessToken) {
      (async () => {
        await fetchWaitingList();
      })();
    }
  }, [selectedWindow, accessToken]);
  

  const fetchCalledList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/called/list/window-id?branch_id=${tenant_id}&window_id=${window_id}`,
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

  const fetchRejectedList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/rejected/list/window-id?branch_id=${tenant_id}&window_id=${window_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching rejected list:", error);
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
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching accepted list:", error);
    }
  };

  const handleWindowChange = (e) => {
    const windowId = e.target.value;
    setSelectedWindow(windowId);
    navigate(`/waiting/${tenant_id}/${windowId}`);
  };

  const handleCallCustomer = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/call/client-by-window?window_id=${selectedWindow}&branch_id=${tenant_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSelectedCustomer(response.data);
      console.log(response.data);
      setShowPopup(true);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error calling customer:", error);
    }
  };

  const handleRejectCustomer = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/queues/reject/customer/client-by-window?window_id=${selectedWindow}&queue_id=${selectedCustomer.queue_id}&branch_id=${tenant_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowPopup(false);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error calling customer:", error);
    }
  };

  const handleFinishedCustomer = async () => {
    try {
      await axios.put(
        `${BASE_URL}/queues/service-completed/client-by-window?window_id=${selectedWindow}&queue_id=${selectedCustomer.queue_id}&branch_id=${tenant_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowPopup(false);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error calling customer:", error);
    }
  };

  const handlePresentCustomer = async () => {
    try {
      await axios.put(
        `${BASE_URL}/queues/start/processing/client-by-window?window_id=${selectedWindow}&queue_id=${selectedCustomer.queue_id}&branch_id=${tenant_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowPopup(true);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error calling customer:", error);
    }
  };

  const fetchProcessingList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/queues/processing/list/window-id?branch_id=${tenant_id}&window_id=${selectedWindow}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching processing list:", error);
    }
  };

  const handlePresent = async () => {
    setPopupButtons("processing");
    try {
      await handlePresentCustomer();
      await fetchCalledList(selectedWindow);
      await fetchProcessingList(selectedWindow);
    } catch (error) {
      console.error("Error updating customer status to called:", error);
    }
  };

  const handleDone = async () => {
    setPopupButtons("done");
    setReload(!reload);
    try {
      await handleFinishedCustomer();
      await fetchAcceptedList(selectedWindow);
    } catch (error) {
      console.error("Error updating customer status to accepted:", error);
    }
  };

  const handleAbsentOrCancel = async () => {
    setPopupButtons("initial");
    setShowPopup(false);
    try {
      await handleRejectCustomer();
      setReload(!reload);
      await fetchRejectedList(selectedWindow);
    } catch (error) {
      console.error("Error updating customer status to rejected:", error);
    }
  };

  const handleCLick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <select
          className={styles.dropdown}
          value={selectedWindow}
          onChange={handleWindowChange}
        >
          <option value="">Select a Desk</option>
          {windows.map((window) => (
            <option key={window.id} value={window.id}>
              {window.window_number}
            </option>
          ))}
        </select>
        <button
          className={styles.callButton}
          onClick={handleCallCustomer}
          disabled={!selectedWindow || waitingList.length === 0}
        >
          Call Next In Line
        </button>
      </div>
      <div className={styles.tabs}>
        <Link
          className={`${styles.tab} ${selectedWindow ? styles.active : ""}`}
          to={`/waiting/${tenant_id}/${selectedWindow}`}
        >
          Waiting List
        </Link>
        <Link
          className={`${styles.tab} ${selectedWindow === calledList ? styles.active : ""}`}
          to={`/called/${tenant_id}/${selectedWindow}`}
        >
          Called List
        </Link>
        <Link
          className={`${styles.tab}`}
          to={`/processing/${tenant_id}/${selectedWindow}`}
        >
          Processing List
        </Link>
        <Link
          className={`${styles.tab}`}
          to={`/accepted/${tenant_id}/${selectedWindow}`}
        >
          Accepted List
        </Link>
        <Link
          className={`${styles.tab}`}
          to={`/rejected/${tenant_id}/${selectedWindow}`}
        >
          Rejected List
        </Link>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
      {showPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Customer Action</h2>
            {popupButtons === "initial" && (
              <div className={styles.buttonGroup}>
                <button
                  onClick={handlePresent}
                  className={styles.confirmButton}
                >
                  Present
                </button>
                <button
                  onClick={handleAbsentOrCancel}
                  className={styles.cancelButton}
                >
                  Absent
                </button>
              </div>
            )}
            {popupButtons === "processing" && (
              <div className={styles.buttonGroup}>
                <button onClick={handleDone} className={styles.confirmButton}>
                  Done
                </button>
                {/* <button
                  onClick={handleAbsentOrCancel}
                  className={styles.cancelButton}
                >
                  Cancel
                </button> */}
              </div>
            )}
            {/* {popupButtons === "done" && (
              <div className={styles.buttonGroup}>
                <button
                  onClick={handleAbsentOrCancel}
                  className={styles.cancelButton}
                >
                  Close
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tab;
