import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import { useAuth } from "../../Authcontext";
import { BASE_URL } from "../../Constant";
import login from "../../assets/login.jpg";
import { toast, Toaster } from 'react-hot-toast'; 

const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken, fetchUserData, userData } = useAuth();
  const [refreshToken, setRefreshToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { username, password } = data;

    try {
      const loginResponse = await axios.post(
        `${BASE_URL}/login?username=${username}&password=${password}`
      );

      if (loginResponse.status === 200) {
        const { access_token, refresh_token } = loginResponse.data;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        localStorage.setItem("QueueWise", access_token);
        localStorage.setItem("QueueWise-refresh", refresh_token);

        await fetchUserData();
      } 
    } catch (error) {
      const errMsg = error.response?.data['detail'] ?? 'Unknown error occurred';
      toast.error(errMsg);
      // setError("Login error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      const { role, tenant_id } = userData;
      if (role === "super-admin") {
        navigate("/admin/dashboard");
      } else if (role === "head-officer") {
        navigate(`/headquarters/${tenant_id}/dashboard`);
      } else if (role === "clerk") {
        navigate(`/clerk/${tenant_id}`);
      } else if (role === "ticket-dispenser") {
        navigate(`ticket-dispenser/${tenant_id}`);
      } else if (role === "display") {
        navigate(`/display/${tenant_id}`)
      } else if (role === "branch-manager") {
        navigate(`branches/${tenant_id}/dashboard`);
      }
    }
  }, [userData, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <img src={login} alt="" className={styles.logo}/>
        </h1>
      </div>
      <div className={styles.sub}>
        <h2>Welcome back!</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
        {loading && <div className={styles.loader}></div>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
