import React from "react";
import styles from "./QueueModal.module.css";

const QueueModal = ({ queue, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Queue Details</h2>
        <p>
          <strong>Queue Number:</strong> {queue.queue.queue_number}
        </p>
        <p>
          <strong>Service Name:</strong> {queue.service.service_name}
        </p>
        <p>
          <strong>Service Description:</strong>{" "}
          {queue.service.service_description}
        </p>
        <p>
          <strong>Status:</strong> {queue.queue.status}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(queue.queue.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Tenant Name:</strong> {queue.tenant.name}
        </p>
        <p>
          <strong>Tenant Address:</strong> {queue.tenant.address}
        </p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default QueueModal;
