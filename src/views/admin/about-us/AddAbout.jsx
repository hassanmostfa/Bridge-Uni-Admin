import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import "./about.css";
import { IoMdArrowBack } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const AddAbout = () => {
  const [textEN, setTextEN] = useState("");
  const [textAR, setTextAR] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  const handleSubmit = () => {
    const aboutData = {
      textEN,
      textAR,
      image,
    };
    console.log("About Data:", aboutData);
    // You can send this data to an API or perform other actions
  };

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            mb="20px !important"
            lineHeight="100%"
          >
            Add New About Content
          </Text>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            colorScheme="teal"
            size="sm"
            leftIcon={<IoMdArrowBack />}
          >
            Back
          </Button>
        </div>
        <form>
          {/* English Text Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Text (English)
              <span className="text-danger mx-1">*</span>
            </Text>
            <Textarea
              id="textEN"
              placeholder="Enter about content in English"
              value={textEN}
              onChange={(e) => setTextEN(e.target.value)}
              required
              mt="8px"
              minH="120px"
            />
          </div>

          {/* Arabic Text Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Text (Arabic)
              <span className="text-danger mx-1">*</span>
            </Text>
            <Textarea
              id="textAR"
              placeholder="أدخل المحتوى باللغة العربية"
              value={textAR}
              onChange={(e) => setTextAR(e.target.value)}
              required
              mt="8px"
              minH="120px"
              dir="rtl"
            />
          </div>

          {/* Image Upload Section */}
          <Box
            border="1px dashed"
            borderColor={isDragging ? "blue.500" : "gray.300"}
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor={isDragging ? "blue.50" : "gray.100"}
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mb={4}
            transition="all 0.2s"
          >
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Image Here
            </Text>
            <Text color="gray.500" mb={2}>
              or
            </Text>
            <Button
              variant="outline"
              color="#422afb"
              border="none"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload Image
              <input
                type="file"
                id="fileInput"
                hidden
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </Button>
            {image && (
              <Box
                mt={4}
                display={'flex'}
                flexDirection="column"
                alignItems="center"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="About content preview"
                  width={150}
                  height={100}
                  style={{ borderRadius: "md", objectFit: "cover" }}
                />
                <Text mt={2} fontSize="sm">
                  {image.name}
                </Text>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Flex justify="flex-start" mt={4}>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={handleSubmit}
              mt="30px"
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddAbout;