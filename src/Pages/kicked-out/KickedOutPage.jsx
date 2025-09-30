import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import stars from "../../assets/spark.svg";
import "../loginPage/LoginPage.css";

const KickedOutPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8f9fa", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center",
      textAlign: "center"
    }}>
      {/* Intervue Poll Badge */}
      <button className="btn btn-sm intervue-btn mb-5" style={{ marginBottom: "40px" }}>
        <img src={stars} className="px-1" alt="" />
        Intervue Poll
      </button>

      {/* Main Message */}
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "600",
        color: "#333",
        marginBottom: "16px"
      }}>
        You've been Kicked out !
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: "1.1rem",
        color: "#666",
        marginBottom: "0",
        maxWidth: "500px",
        lineHeight: "1.5"
      }}>
        Looks like the teacher had removed you from the poll system. Please<br />
        Try again sometime.
      </p>
    </div>
  );
};

export default KickedOutPage;