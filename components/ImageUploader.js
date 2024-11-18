import React from "react";
import PropTypes from "prop-types";
import styles from "../src/styles/ImageUploader.module.css";

function ImageUploader({ onImageUpload }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      // define the onload event to handle the binary data after reading
      reader.onloadend = () => {
        // The result will be an ArrayBuffer (binary data)
        const binaryData = reader.result;
        // Pass the binary data to the parent component
        onImageUpload(binaryData);
      };

      // Read the file as an ArrayBuffer instead of BLOB
      reader.readAsArrayBuffer(file);
    }
  };

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
