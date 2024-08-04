import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import styles from "./QueueDataComponent.module.css";

// const data = `${JSON.stringify(data, null, 2)}`;

const QueueDataComponent = () => {
  const [view, setView] = useState("queueLength");
  const [timeFrame, setTimeFrame] = useState("day");

  const data = [
    { date: '2024-01-01', queueLength: 20, avgWaitingTime: 15, avgJourneyTime: 30, statusCount: 10, service: 'Service A' },
    { date: '2024-01-02', queueLength: 25, avgWaitingTime: 20, avgJourneyTime: 35, statusCount: 15, service: 'Service B' },
    // Add more data as needed
  ];

  const processData = (data) => {
    return data;
  };

  const aggregatedData = processData(data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Queue Data Visualization</h1>
        <div className={styles.dropdown}>
          <label htmlFor="view">Select View: </label>
          <select
            id="view"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="queueLength">Queue Length</option>
            <option value="avgWaitingTime">Average Waiting Time</option>
            <option value="avgJourneyTime">Average Journey Time</option>
            <option value="statusCount">Status Count by Service</option>
          </select>
        </div>
        <div className={styles.dropdown}>
          <label htmlFor="timeFrame">Select Time Frame: </label>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="day">Per Day</option>
            <option value="week">Per Week</option>
            <option value="month">Per Month</option>
            <option value="year">Per Year</option>
          </select>
        </div>
      </div>
      <div className={styles.chartContainer}>
        {view === "queueLength" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="queueLength"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {view === "avgWaitingTime" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgWaitingTime"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {view === "avgJourneyTime" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgJourneyTime"
                stroke="#ffc658"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {view === "statusCount" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="statusCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default QueueDataComponent;
