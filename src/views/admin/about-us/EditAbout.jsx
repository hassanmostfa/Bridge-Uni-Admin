import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Icon,
  Textarea,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { FaUpload, FaTrash } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateAboutMutation } from "api/aboutSlice";
import { useGetAboutQuery } from "api/aboutSlice";
import { useAddFileMutation, useDeleteFileMutation } from "api/filesSlice";
import Swal from "sweetalert2";

const EditAbout = () => {
  const { id } = useParams();
  const [addFile, { isLoading: isUploading }] = useAddFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [updateAbout] = useUpdateAboutMutation();
  const { data: aboutData, isLoading, isError, refetch } = useGetAboutQuery(id);
  const [textEN, setTextEN] = useState("");
  const [textAR, setTextAR] = useState("");
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();
  const toast = useToast();

  // Load existing data
  useEffect(() => {
    if (aboutData?.data) {
      setTextEN(aboutData.data.title_en || "");
      setTextAR(aboutData.data.title_ar || "");
      setCurrentImageUrl(aboutData.data.image || "");
    }
  }, [aboutData]);

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

  const handleRemoveImage = () => {
    setImage(null);
    setCurrentImageUrl("");
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
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      let imageUrl = currentImageUrl;

      // If new image uploaded
      if (image) {
        // Delete old image if exists
        if (currentImageUrl) {
          try {
            await deleteFile(currentImageUrl).unwrap();
          } catch (error) {
            console.warn("Failed to delete old image:", error);
          }
        }

        // Upload new image
        const formData = new FormData();
        formData.append("img", image);
        const uploadResponse = await addFile(formData).unwrap();
        
        if (!uploadResponse.flag || !uploadResponse.url) {
          throw new Error(uploadResponse.message || "Failed to upload image");
        }
        imageUrl = uploadResponse.url;
      }

      // Prepare update data
      const updateData = {
        id: parseInt(id),
        title_en: textEN,
        title_ar: textAR,
        image: imageUrl,
      };

      // Update about content
      const response = await updateAbout(updateData).unwrap();

      if (response.flag) {
        await Swal.fire({
          title: "Success!",
          text: response.message || "About content updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        refetch();
        navigate("/admin/undefined/cms/about-us");
      } else {
        throw new Error(response.message || "Failed to update about content");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || error.message || "Failed to update about content",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if ((textEN !== aboutData?.data?.title_en) || 
        (textAR !== aboutData?.data?.title_ar) || 
        image) {
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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text color="red.500">Error loading about content</Text>
      </Flex>
    );
  }

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
            Edit About Content
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

            {(image || currentImageUrl) && (
              <Box mt={4} position="relative">
                <img
                  src={image ? URL.createObjectURL(image) : currentImageUrl}
                  alt="About content preview"
                  width={150}
                  height={100}
                  style={{ 
                    borderRadius: "md", 
                    objectFit: "cover",
                    maxWidth: "100%",
                    maxHeight: "200px"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <Button
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="full"
                  p={1}
                  onClick={handleRemoveImage}
                >
                  <Icon as={FaTrash} />
                </Button>
                {image && (
                  <Text mt={2} fontSize="sm">
                    {image.name}
                  </Text>
                )}
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
              loadingText="Updating..."
            >
              Update
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditAbout;