import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BASE_URL } from "../../../../Constant";
import axios from "axios";
import styles from "./Pie.module.css";
import { useAuth } from "../../../../Authcontext";
import { toast, Toaster } from 'react-hot-toast'; 

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { accessToken } = useAuth();
  const [headquartersData, setHeadquartersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const headquartersResponse = await axios.get(
        `${BASE_URL}/organizations-with-branches?skip=0&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const headquarters = headquartersResponse.data.map((org) => ({
        name: org.name,
        branches: org.branches.length,
      }));

      const usersResponse = await axios.get(`${BASE_URL}/user/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const users = usersResponse.data
        .filter((user) =>
          ["super-admin", "admin", "head-officer"].includes(user.role)
        )
        .map((user) => ({
          username: user.username,
          role: user.role,
        }));


      setHeadquartersData(headquarters);
      setUsersData(users);
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(accessToken){
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
    }
  }, [accessToken]);

  const generatePieData = (data, labelKey, valueKey) => {
    const valueCounts = data.reduce((acc, item) => {
      acc[item[labelKey]] = (acc[item[labelKey]] || 0) + 1;
      return acc;
    }, {});

    const pieData = {
      labels: Object.keys(valueCounts),
      datasets: [
        {
          data: Object.values(valueCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#E7E9ED",
            "#4BC0C0",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#E7E9ED",
            "#4BC0C0",
          ],
        },
      ],
    };
   
    return pieData;
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <h4>Headquarters</h4>
        <Pie
          data={generatePieData(headquartersData, "name", "branches")}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const dataset = tooltipItem.dataset;
                    const value = dataset?.data?.[tooltipItem.dataIndex];
                    return `${value} branches`;
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className={styles.chartWrapper}>
        <h4>Users</h4>
        <Pie
          data={generatePieData(usersData, "role", "role")}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const dataset = tooltipItem.dataset;
                    const value = dataset?.data?.[tooltipItem.dataIndex];
                    return `${value}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;
