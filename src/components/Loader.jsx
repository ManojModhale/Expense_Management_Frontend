import React from "react";
import "./Loader.css";

const Loader = ({ message }) => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
