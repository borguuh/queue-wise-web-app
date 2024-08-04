import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Ticket.module.css";
import logo from "../../assets/logo.png";
import guaranty from "../../assets/g.png";
import { IoIosPrint } from "react-icons/io";
import QrCodeGenerator from "../../components/qrcode/QrCode";

const Ticket = () => {
  const location = useLocation();
  const { ticket } = location.state || {};

  const printTicket = () => {
    window.print();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      day: "numeric",
      weekday: "long",
      month: "long",
      year: "numeric",
    });
  };

  if (!ticket) {
    return <div>No ticket available</div>;
  }

  return (
    <div>
      <div className={styles.ticket}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img src={logo} alt="logo" className={styles.logo} />
            <h2>{ticket.tenant?.name}</h2>
          </div>
          <div className={styles.orgDetails}>
            <p>{ticket.tenant?.address}</p>
          </div>
        </div>

        <div className={styles.details}>
          <h3 className={styles.service}>
            Service Name <span>{ticket.service?.service_name}</span>
          </h3>
          <h3 className={styles.queueNumber}>
            Queue Number <span>{ticket.queue_number}</span>
          </h3>
          <img src={guaranty} alt="Guarantee Stamp" className={styles.stamp} />
          <p className={styles.date}>
            {formatDateTime(ticket.tenant?.created_at)}
          </p>
        </div>
        <div className={styles.bottom}>
          <p className={styles.queue}>
            There are <span>{ticket.queue_info?.no_of_people_before_you}</span>{" "}
            people ahead of you
          </p>
          <QrCodeGenerator  />
        </div>
      </div>
      <IoIosPrint onClick={printTicket} className={styles.icon} />
    </div>
  );
};

export default Ticket;
