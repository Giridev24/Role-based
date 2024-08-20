import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './signup.css';
import { baseUrl } from "./Urls";


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userrole = 'user'

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}/signup`, { email, password, userrole })
      .then((result) => {
        navigate('/');
        console.log(result);
      });
  };

  return (
    <div className="f">
      <div className="b">
        <form onSubmit={handleSubmit}>
          <h3 className="mb-4">Registration form</h3>
          <label>Name</label> <br />
          <input
            type="text"
            className="mb-2"
            name="email"
            placeholder="Enter your Name"
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
          <button className="btn btn-primary mt-3 mb-3">Register</button>
        </form>
        <h5 className="fs-6">Already have an account? Log in</h5>
        <Link to="/login" className="btn btn-success btn-sm ">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
