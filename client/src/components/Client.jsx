import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./client.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { baseUrl } from "./Urls";

const Client = () => {
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState();
  const [editedName, setEditedName] = useState("");
  const [editedAdhaar, setEditedAdhaar] = useState("");
  const [editedDob, setEditedDob] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const { email } = useParams();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-out",
      once: true,
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/admin`);
        let filteredData = response.data.filter((item) => item.name === email);
        setImage(filteredData[0]);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchData();
  }, [email, navigate]);

  const handleDelete = (id) => {
    axios
      .delete(`${baseUrl}/admin/${id}`)
      .then(() => {
        setImage(null);
      })
      .catch((error) => {
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
        setImage((prev) => ({
          ...prev,
          name: editedName,
          adhaar: editedAdhaar,
          dob: editedDob,
        }));
        setEditId(null);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  };

  return (
    <div className="co" style={{ height: "100vh", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px",
            color: 'gray',
            fontSize: '16px',
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            width: "100%",
            textAlign: "center",
            zIndex: 1000
          }}
        >
          Loading...
        </div>
      )}
      {!loading && image && (
        <>
          <div
            key={image._id}
            className="character text-center shadow"
            data-aos="zoom-out"
          >
            <img
              className="bg-transparent"
              src={`data:${image.img.contentType};base64,${arrayBufferToBase64(
                image.img.data.data
              )}`}
              alt={image.name}
            />
          </div>
          <div className="char-info p-3 mx-2" data-aos="fade-left">
            <h4>
              Name : &nbsp;
              {editId === image._id ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder=""
                />
              ) : (
                image.name
              )}
            </h4>
            <h4>
              Favorite food : &nbsp;
              {editId === image._id ? (
                <input
                  value={editedAdhaar}
                  onChange={(e) => setEditedAdhaar(e.target.value)}
                />
              ) : (
                image.adhaar
              )}
            </h4>
            <h4>
              Activity : &nbsp;
              {editId === image._id ? (
                <input
                  value={editedDob}
                  onChange={(e) => setEditedDob(e.target.value)}
                />
              ) : (
                image.dob
              )}
            </h4>
            <div className="btn">
              {image._id === editId ? (
                <button
                  onClick={() => handleUpdate(image._id)}
                  className="btn btn-outline-dark btn-sm shadow"
                >
                  Update
                </button>
              ) : (
                <a
                  href="#"
                  onClick={() =>
                    handleEdit(image._id, image.name, image.adhaar, image.dob)
                  }
                  className="btn btn-outline-dark btn-sm mx-1 p-0 px-2 shadow font-weight-normal"
                >
                  Edit
                </a>
              )}
            </div>
          </div>
        </>
      )}
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

export default Client;
