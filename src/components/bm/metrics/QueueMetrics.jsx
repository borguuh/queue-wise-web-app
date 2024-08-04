import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./QueueMetrics.module.css";
import { useAuth } from "../../../Authcontext";
import { BASE_URL } from "../../../Constant";
import { useParams } from "react-router-dom";
import QueueModal from "./modal/QueueModal";
import { FaFilter } from "react-icons/fa"; // Example icon
import { toast, Toaster } from 'react-hot-toast'; 

const QueueMetrics = () => {
  const { branchId } = useParams();
  const [queueMetrics, setQueueMetrics] = useState([]);
  const [filteredQueueMetrics, setFilteredQueueMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: [],
    service: "",
    deskLabel: "",
    startDate: "",
    endDate: "",
  });

  const fetchQueueMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/queuemetrics/all/info?branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setQueueMetrics(response.data);
      setFilteredQueueMetrics(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching queue metrics:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (accessToken) {
      fetchQueueMetrics();
    }
  }, [accessToken, branchId]);

  useEffect(() => {
    let filteredData = queueMetrics;

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((queue) =>
        filters.status.includes(queue.queue.status.toLowerCase())
      );
    }

    if (filters.service) {
      filteredData = filteredData.filter((queue) =>
        queue.service.service_name
          .toLowerCase()
          .includes(filters.service.toLowerCase())
      );
    }

    if (filters.deskLabel) {
      filteredData = filteredData.filter((queue) =>
        (queue.queue.window || "")
          .toLowerCase()
          .includes(filters.deskLabel.toLowerCase())
      );
    }

    if (filters.startDate || filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filteredData = filteredData.filter((queue) => {
        const arrivalDate = new Date(queue.queue.created_at);
        return (
          (filters.startDate ? arrivalDate >= startDate : true) &&
          (filters.endDate ? arrivalDate <= endDate : true)
        );
      });
    }

    setFilteredQueueMetrics(filteredData);
  }, [filters, queueMetrics]);

  const handleRowClick = (queue) => {
    setSelectedQueue(queue);
  };

  const closeModal = () => {
    setSelectedQueue(null);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days} day${days !== 1 ? "s" : ""} `;
    }
    if (hours > 0) {
      formattedTime += `${hours} hour${hours !== 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes} minute${minutes !== 1 ? "s" : ""} `;
    }
    if (seconds < 60) {
      formattedTime += `${secs} second${secs !== 1 ? "s" : ""}`;
    }

    return formattedTime.trim();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((s) => s !== value)
        : [...prev.status, value],
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      service: "",
      deskLabel: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className={styles.container}>
      <h1>Queue Metrics</h1>

      <button
        className={styles.filterButton}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter /> Filters
      </button>

      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Time of Arrival:</label>
            <input type="date" name="startDate" onChange={handleFilterChange} />
            <label>Finished time:</label>
            <input type="date" name="endDate" onChange={handleFilterChange} />
          </div>

          <div className={`${styles.filterGroup} ${styles.statusFilter}`}>
            <label>Status:</label>
            <div className={styles.statusOption}>
              <input
                type="checkbox"
                value="called"
                checked={filters.status.includes("called")}
                onChange={handleStatusChange}
              />
              <label>Called</label>
            </div>
            <div className={styles.statusOption}>
              <input
                type="checkbox"
                value="accepted"
                checked={filters.status.includes("accepted")}
                onChange={handleStatusChange}
              />
              <label>Accepted</label>
            </div>
            <div className={styles.statusOption}>
              <input
                type="checkbox"
                value="rejected"
                checked={filters.status.includes("rejected")}
                onChange={handleStatusChange}
              />
              <label>Rejected</label>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Service:</label>
            <select name="service" onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(
                new Set(queueMetrics.map((queue) => queue.service.service_name))
              ).map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Desk Label:</label>
            <input
              type="text"
              name="deskLabel"
              placeholder="Filter by desk label"
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterActions}>
            <button
              className={styles.applyButton}
              onClick={() => {
                /* Apply filters */
              }}
            >
              Apply
            </button>
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Time of arrival</th>
            <th>Queue Number</th>
            <th>Status</th>
            <th>Service rendered</th>
            <th>Desk label</th>
            <th>Time called upon</th>
            <th>Finished time stamp</th>
            <th>Rejected time stamp</th>
            <th>Total waiting time</th>
            <th>Total journey time</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className={styles.loaderCon}>
                <div className={styles.loader}>Loading...</div>
              </td>
            </tr>
          ) : filteredQueueMetrics.length > 0 ? (
            filteredQueueMetrics.map((queue) => (
              <tr key={queue.id} onClick={() => handleRowClick(queue)}>
                <td>{new Date(queue.queue.created_at).toLocaleString()}</td>
                <td>{queue.queue.queue_number}</td>
                <td>{queue.queue.status}</td>
                <td>{queue.service.service_name}</td>
                <td>{window.window_number || "-"}</td>
                <td>
                  {queue?.called_timestamp
                    ? new Date(queue.called_timestamp).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {queue?.accepted_timestamp
                    ? new Date(queue.accepted_timestamp).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {queue?.rejected_timestamp
                    ? new Date(queue.rejected_timestamp).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {queue?.waiting_time ? formatTime(queue.waiting_time) : "-"}
                </td>
                <td>
                  {queue?.total_journey_time
                    ? formatTime(queue.total_journey_time)
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No queue metrics found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedQueue && (
        <QueueModal queue={selectedQueue} onClose={closeModal} />
      )}
    </div>
  );
};

export default QueueMetrics;
