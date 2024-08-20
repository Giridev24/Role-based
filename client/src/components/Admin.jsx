import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css"
import AOS from "aos";
import "aos/dist/aos.css";
import { baseUrl } from "./Urls";


const Admin = () => {
  axios.defaults.withCredentials = true;

  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState();
  const [editedName, setEditedName] = useState(""); 
  const [editedAdhaar, setEditedAdhaar] = useState(""); 
  const [editedDob, setEditedDob] = useState("");
  const navigate = useNavigate();

 

  useEffect(() => {

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/admin`);
        setImages(response.data); 
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchData();
  }, [navigate]);

  const handleDelete = (id) => {
    axios
      .delete(`${baseUrl}/admin/${id}`)
      .then(() => {
        setImages(prevImages => prevImages.filter(image => image._id !== id));
      })
      .catch(error => {
        console.error("Error deleting item:", error);
      });
  };

  const handleEdit = (imageId, imageName, imageAdhaar, imageDob) => {
    setEditId(imageId);
    setEditedName(imageName);
    setEditedAdhaar(imageAdhaar);
    setEditedDob(imageDob);
  };

  const handleUpdate = (id) => {
    axios
      .put(`${baseUrl}/admin/${id}`, {
        name: editedName,
        adhaar: editedAdhaar,
        dob: editedDob,
      })
      .then(() => {
        setImages(prevImages =>
          prevImages.map(image =>
            image._id === id ? { ...image, name: editedName, adhaar: editedAdhaar, dob: editedDob } : image
          )
        );
        setEditId(null);
      })
      .catch(error => {
        console.error("Error updating item:", error);
      });
  };

  return (
    <div className="co" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {images.map(image => (
        <div
          key={image._id}
          className=" m-3 text-center cstyle"
          data-aos="flip-right"
        >
          <img
            className=" istyle"
            src={`data:${image.img.contentType};base64,${arrayBufferToBase64(image.img.data.data)}`}
            alt={image.name}
            
          />
          <h4>
            Name: {editId === image._id ? <input value={editedName} onChange={e => setEditedName(e.target.value)} /> : image.name}
          </h4>
          <h4>
            Food: {editId === image._id ? <input value={editedAdhaar} onChange={e => setEditedAdhaar(e.target.value)} /> : image.adhaar}
          </h4>
          <h4>
            Activity: {editId === image._id ? <input value={editedDob} onChange={e => setEditedDob(e.target.value)} /> : image.dob}
          </h4>
          <div className="btn">
            {image._id === editId ? (
              <button
                onClick={() => handleUpdate(image._id)}
                className="btn btn-dark btn-sm shadow m-2"
              >
                Update
              </button>
            ) : (
              <a
                href="#"
                onClick={() => handleEdit(image._id, image.name, image.adhaar, image.dob)}
                className="btn btn-primary btn-sm m-2 shadow font-weight-normal"
              >
                Edit
              </a>
            )}
            <a
              href="#"
              onClick={() => handleDelete(image._id)}
              className="btn btn-outline-danger btn-sm shadow font-weight-normal"
            >
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
