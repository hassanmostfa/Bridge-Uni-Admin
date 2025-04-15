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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAddAboutMutation } from "api/aboutSlice";
import { useAddFileMutation } from "api/filesSlice";
import Swal from "sweetalert2";

const AddAbout = () => {
  const [addAbout] = useAddAboutMutation();
  const [addFile, { isLoading: isUploading }] = useAddFileMutation();
  const [textEN, setTextEN] = useState("");
  const [textAR, setTextAR] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();
  const toast = useToast();

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    if (!textEN.trim() || !textAR.trim()) {
      toast({
        title: "Validation Error",
        description: "Both English and Arabic content are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = "";

      // Upload image if exists
      if (image) {
        const formData = new FormData();
        formData.append("img", image);

        const uploadResponse = await addFile(formData).unwrap();
        if (!uploadResponse.flag || !uploadResponse.url) {
          throw new Error(uploadResponse.message || "Failed to upload image");
        }
        imageUrl = uploadResponse.url;
      }

      // Prepare about data
      const aboutData = {
        title_en: textEN,
        title_ar: textAR,
        image: imageUrl,
      };

      // Create about content
      const response = await addAbout(aboutData).unwrap();

      if (response.flag) {
        await Swal.fire({
          title: "Success!",
          text: response.message || "About content created successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/undefined/cms/about-us");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create about content",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: error.data?.message || error.message || "Failed to create about content",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (textEN || textAR || image) {
      Swal.fire({
        title: "Are you sure?",
        text: "You have unsaved changes that will be lost!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, discard changes!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });
    } else {
      navigate(-1);
    }
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
            onClick={handleCancel}
            colorScheme="teal"
            size="sm"
            leftIcon={<IoMdArrowBack />}
          >
            Back
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
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
              isDisabled={isSubmitting || isUploading}
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
              isDisabled={isSubmitting || isUploading}
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
            opacity={isSubmitting || isUploading ? 0.7 : 1}
            pointerEvents={isSubmitting || isUploading ? "none" : "auto"}
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
              onClick={() => document.getElementById("fileInput").click()}
              isLoading={isUploading}
              loadingText="Uploading..."
            >
              Upload Image
              <input
                type="file"
                id="fileInput"
                hidden
                accept="image/*"
                onChange={handleFileInputChange}
                disabled={isSubmitting || isUploading}
              />
            </Button>
            {image && (
              <Box
                mt={4}
                display={"flex"}
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
              type="submit"
              mt="30px"
              isLoading={isSubmitting || isUploading}
              loadingText="Submitting..."
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