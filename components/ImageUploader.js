import React from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ImageUploader.module.css";

function ImageUploader({ onImageUpload }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // create a BLOB (Binary Large Object)
      const blob = new Blob([file], { type: file.type });
      onImageUpload(blob);
    }
  };

  /*
<<<<<<< HEAD
  const uploadBlob = async (blob, filename) =>{
    
  }
=======

  const uploadArray = async () =>{
>>>>>>> 1c12e5d5e0ecb1d8a3fd8c0a6f0b4e416e90ddc4
  */

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
