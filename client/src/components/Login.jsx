import React, { useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster, toast } from "react-hot-toast";
import { baseUrl } from "./Urls";  


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleShake = (message) => {
    setErrorMessage(message);
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
      errorElement.classList.add("shake");
      setTimeout(() => {
        errorElement.classList.remove("shake");
      }, 500);
    }
  };

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const result = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      if (result.data.success) {
        const { token, userrole, email } = result.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ email, userrole }));

        if (userrole === "admin") {
          toast.success("Logged in");
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        } else if (userrole === "user") {
          toast.success("Logged in");
          setTimeout(() => {
            navigate(`/client/${email}`);
          }, 1000);
        } else {
          handleShake("Invalid role.");
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        handleShake(error.response.data.msg);
      } else {
        console.error("Error logging in:", error);
        handleShake("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="f">
       <h4 className="text-white text-center mb-auto"># Role-Based Access Control</h4>
      <div className="ids p-md-5" data-aos="fade-in">
        <h4 className="text-white">Clients</h4>
        <p className="text-white">tom : 1212</p>
        <p className="text-white">jerry : 2121</p>
        <p className="text-white">spike : 3232</p> <hr className="text-white" />
        <h4 className="text-white">Admin</h4>
        <p className="text-white">ceo : 4141</p>
      </div>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          <label>Username</label> <br />
          <input
            type="text"
            className="mb-2"
            name="email"
            placeholder="Enter your username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label>Password</label> <br />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn btn-primary btn-sm mt-3 mb-3">Login</button>
          {errorMessage && (
            <p id="error-message" className="error-message text-danger">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
