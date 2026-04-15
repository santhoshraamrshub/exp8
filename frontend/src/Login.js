import React from "react";
import { useForm } from "react-hook-form";
import axios from "./axiosConfig";
import "./Login.css";

function Login() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://exp8-xtnk.onrender.com/api/login", data);

      localStorage.setItem("token", res.data.token);

      alert("Login Success");
      window.location.href = "/dashboard";

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>

        <input {...register("username")} placeholder="Username" />
        <input {...register("password")} type="password" placeholder="Password" />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;