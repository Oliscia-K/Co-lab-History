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
  const uploadBlob = async (blob, filename) =>{
    
  }
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
