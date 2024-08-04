import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
