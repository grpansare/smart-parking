import React, { useRef, useState } from "react";
import { Button, Typography, Box } from "@mui/material";

const ParkingImageUpload = ({  setFormData, formData }) => {
  const fileInputRef = useRef(null);
  const [image,setImage]=useState()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(e.target.files[0])
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click(); // trigger file input
  };

  const handleUpload = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("parkingImage", image);
    console.log("Image ready to be uploaded", image);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      className="w-full"
    >
      <Typography className="text-left w-full">Parking Space Image</Typography>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {/* Custom Styled Upload Button */}
      <div className="fileupload w-full" onClick={handleDivClick}>
        <div className="border flex bg-white w-full h-11 overflow-hidden rounded-lg cursor-pointer">
          <div className="flex justify-center items-center bg-blue-600 text-sm text-white w-32 min-h-full">
            Choose Image
          </div>
          <div className="flex text-sm justify-center items-center ">
            {image ? image.name : "No Image Chosen"}
          </div>
        </div>
      </div>

      {/* Preview */}
    </Box>
  );
};

export default ParkingImageUpload;
