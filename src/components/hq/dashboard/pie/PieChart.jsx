import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BASE_URL } from "../../../../Constant";
import axios from "axios";
import styles from "./PieChart.module.css";
import { useAuth } from "../../../../Authcontext";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast'; 

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { accessToken } = useAuth();
  const { hqId } = useParams();
  const [branchesData, setBranchesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch branches data
      const branchesResponse = await axios.get(
        `${BASE_URL}/headquarter/branches/all?model_id=${hqId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const branches = branchesResponse.data
        .filter((org) => org.organization_type === "BRANCH")
        .map((organization) => ({
          name: organization.name,
        }));

      // Fetch users data
      const usersResponse = await axios.get(
        `${BASE_URL}/hq/users/all?hq_id=${hqId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const users = usersResponse.data
        .filter((user) =>
          ["branch-manager", "head-officer"].includes(user.role)
        )
        .map((user) => ({
          username: user.username,
          role: user.role,
        }));

      setBranchesData(branches);
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
   if (accessToken){
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
   }
  }, [accessToken, hqId]);

  const generatePieData = (data, labelKey) => {
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
        <h4>Branches</h4>
        <Pie
          data={generatePieData(branchesData, "name")}
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
      <div className={styles.chartWrapper}>
        <h4>Users</h4>
        <Pie
          data={generatePieData(usersData, "role")}
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
