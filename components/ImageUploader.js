import React from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ImageUploader.module.css";

function ImageUploader({ onImageUpload }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        // array of bytes
        const arrayBuffer = event.target.result;
        const arrayOfBytes = new Uint8Array(arrayBuffer);
        onImageUpload(arrayOfBytes);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  // const uploadArray = async (blob, filename) =>{

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.fileInput}
      />
    </div>
  );
}

ImageUploader.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};

export default ImageUploader;
