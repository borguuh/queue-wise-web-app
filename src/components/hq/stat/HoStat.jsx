import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import { BASE_URL } from "../../../Constant";
import { useAuth } from "../../../Authcontext";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataChart = () => {
  const { accessToken } = useAuth();
  const { hqId } = useParams();
  const [data, setData] = useState(null);
  const [selectedChart, setSelectedChart] = useState("bar");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/overall-stats/branch-comparison?hq_id=${hqId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  if (
    !data ||
    !data.average_waiting_time ||
    !data.average_service_time ||
    !data.average_journey_time
  ) {
    return <div>Loading...</div>;
  }

  const {
    average_waiting_time = { minutes: 0, seconds: 0, hours: 0 },
    average_service_time = { minutes: 0, seconds: 0, hours: 0 },
    average_journey_time = { minutes: 0, seconds: 0, hours: 0 },
    peak_hour = 0,
  } = data;

  const barData = {
    labels: ["Minutes", "Seconds", "Hours"],
    datasets: [
      {
        label: "Average Waiting Time",
        data: [
          average_waiting_time.minutes,
          average_waiting_time.seconds,
          average_waiting_time.hours,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Average Service Time",
        data: [
          average_service_time.minutes,
          average_service_time.seconds,
          average_service_time.hours,
        ],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Average Journey Time",
        data: [
          average_journey_time.minutes,
          average_journey_time.seconds,
          average_journey_time.hours,
        ],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Peak Hour"],
    datasets: [
      {
        label: "Peak Hour",
        data: [peak_hour],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container">
      <h2>Data Chart</h2>
      <select
        onChange={(e) => setSelectedChart(e.target.value)}
        value={selectedChart}
        className="chart-selector"
      >
        <option value="bar">Bar Chart</option>
        <option value="line">Line Graph</option>
      </select>
      <div className="chart-container">
        {selectedChart === "bar" ? (
          <Bar data={barData} options={{ responsive: true }} />
        ) : (
          <Line data={lineData} options={{ responsive: true }} />
        )}
      </div>
    </div>
  );
};

export default DataChart;
