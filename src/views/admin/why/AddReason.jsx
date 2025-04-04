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

import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddReason = () => {
  const [enDescription, setEnDescription] = useState("");
  const [arDescription, setArDescription] = useState("");
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

  const handleCancel = () => {
    setEnDescription("");
    setArDescription("");
    setImage(null);
  };

  const handleSubmit = () => {
    const reasonData = {
      en_description: enDescription,
      ar_description: arDescription,
      image,
    };
    console.log("Reason Data:", reasonData);
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
            Add New Reason
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
          {/* English Description Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              English Description
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Textarea
              id="en_description"
              placeholder="Enter English description"
              value={enDescription}
              onChange={(e) => setEnDescription(e.target.value)}
              required
              mt={"8px"}
              minH="100px"
            />
          </div>

          {/* Arabic Description Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Arabic Description
              <span className="text-danger mx-1">*</span>
            </Text> 
            <Textarea
              id="ar_description"
              placeholder="Enter Arabic description"
              value={arDescription}
              onChange={(e) => setArDescription(e.target.value)}
              required
              mt={"8px"}
              minH="100px"
              dir="rtl"
            />
          </div>

          {/* Drag-and-Drop Upload Section */}
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
            transition="all 0.2s ease"
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
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  width={120}
                  height={120}
                  style={{ borderRadius: '8px', objectFit: 'cover' }}
                />
                <Text mt={2} fontSize="sm" color="gray.600">
                  {image.name}
                </Text>
              </Box>
            )}
          </Box>
          
          {/* Action Buttons */}
          <Flex justify="center" mt={4} gap={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={handleCancel}
              width="120px"
            >
              Cancel
            </Button>
            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              width="120px"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddReason;