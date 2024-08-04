import React from "react";
import styles from "./UserModal.module.css";

const Modal = ({ show, onClose, tenant }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Tenant Details</h2>
        <div className={styles.details}>
          <p className={styles.name}>
            <strong>Name:</strong> {tenant.name}
          </p>
          <p>
            <strong>Address:</strong> {tenant.address}
          </p>
          <p>
            <strong>Contact Phone:</strong> {tenant.contact_phone}
          </p>
          <p>
            <strong>Contact Email:</strong> {tenant.contact_email}
          </p>
          <p>
            <strong>Active:</strong> {tenant.isActive ? "Yes" : "No"}
          </p>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
