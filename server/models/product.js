const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  name: String,
  adhaar: String,
  dob: String,
  img: {
    data: Buffer,
    contentType: String,
  },
   visibility: String
});

module.exports = ImageModel = mongoose.model("Image", imgSchema);
/*------------import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tom from "../assets/tom.jpg";
import jerry from "../assets/jerry.jpeg";
import dog from "../assets/dog.png";
import "./admin.css";

const Admin = () => {
  const cardStyle = { width: "12rem", height: "40%" };
  const imageStyle = { objectFit: "contain", height: "200px" };

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin");
        setImages(response.data); // Ensure response.data is an array
       
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>hi</h1>
      {images.map((image) => (
        <div key={image._id} className="card">
          <img
            className="card-img bg-light m-2"
            src={`data:${image.img.contentType};base64,${arrayBufferToBase64(
              image.img.data.data
            )}`}
            alt={image.name}
            style={imageStyle}
          />{" "}
          <h2>{image.name}</h2>
          <h4>{image.adhaar}</h4>
          <h4>{image.dob}</h4>
          <div className="btn">
            <a
              href="#"
              className="btn btn-success mx-1 shadow font-weight-normal"
            >
              Edit
            </a>
            <a href="#" className="btn btn-danger shadow font-weight-normal">
              Delete
            </a>
          </div>
        </div>
      ))}
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

export default Admin;

----------*/
