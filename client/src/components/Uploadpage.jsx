import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { baseUrl } from "./Urls";  
import "./upload.css";


const UploadPage = () => {
  const [name, setName] = useState("");
  const [adhaar, setAdhaar] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleAdhaarChange = (e) => {
    setAdhaar(e.target.value);
  };
  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("adhaar", adhaar);
    formData.append("dob", dob);
    formData.append("testImage", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("Image uploaded successfully!");
     
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const cardStyle = { width: "90%", height: "100%", boxShadow: "none" }; // Added fixed height for the cards
  const imageStyle = { objectFit: "contain", height: "70%" }; // Use 'contain' instead of 'cover'

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/upload`);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" d-flex h-100 justify-content-center align-items-center">
      <div className="u mt-5">
        <div className="frm p-5">
          <h1 className="text-center fw-regular mb-4 text-secondary">
            New Character
          </h1>
          <div className="l text-center">
            <label>Name:</label>
            <input
              required= 'true'
              className="p-1 n "
              type="text"
              placeholder=""
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="l text-center">
            <label>Favorite food:</label>
            <input
              className="p-1 n d"
              type="text"
              placeholder=""
              value={adhaar}
              onChange={handleAdhaarChange}
            />
          </div>
          <div className="l text-center">
            <label>Activity:</label>
            <input
              className="p-1 n p"
              type="text"
              placeholder=""
              value={dob}
              onChange={handleDobChange}
            />
          </div>
          <div className="d-flex l text-center">
            <label className="ms-5 ">Image:</label>
            <input className=" cf" type="file" onChange={handleFileChange} />
          </div>
          <div className="d-flex">
            <button
              className="mt-1 py-0 ub btn btn-success shadow font-weight-normal"
              onClick={handleUpload}
            >
              Upload
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
export default UploadPage;
