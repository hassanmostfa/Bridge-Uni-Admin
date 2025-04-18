import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAddBannerMutation } from "../../../api/banners";
import { useAddFileMutation } from "../../../api/filesSlice";
import Swal from "sweetalert2";

const AddBanner = () => {
  const [titleEN, setTitleEN] = useState("");
  const [titleAR, setTitleAR] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();
  const toast = useToast();

  const [addFile] = useAddFileMutation();
  const [addBanner] = useAddBannerMutation();

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
      } else {
        toast({
          title: 'Invalid file',
          description: 'Please upload an image file',
          status: 'error',
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
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleCancel = () => {
    setTitleEN("");
    setTitleAR("");
    setImage(null);
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!titleEN || !titleAR || !image) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First upload the image
      const fileFormData = new FormData();
      fileFormData.append('img', image);

      const fileResponse = await addFile(fileFormData).unwrap();
      
      if (!fileResponse.flag) {
        throw new Error(fileResponse.message || 'Failed to upload image');
      }

      // Then create the banner with the image URL
      const bannerResponse = await addBanner({
        title_en: titleEN,
        title_ar: titleAR,
        image: fileResponse.url
      }).unwrap();

      if (!bannerResponse.flag) {
        throw new Error(bannerResponse.message || 'Failed to add banner');
      }

      await Swal.fire({
        title: 'Success',
        text: 'Banner added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/admin/undefined/cms/banners');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="container" w="100%">
      <Box bg="white" className="add-admin-card shadow p-4 w-100">
        <Flex mb="20px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Add New Banner
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
        </Flex>

        <Box>
          {/* English Title Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Title (English)
              <Text as="span" color="red.500" mx={1}>*</Text>
            </Text>
            <Input
              type="text"
              id="titleEN"
              placeholder="Enter title in English"
              value={titleEN}
              onChange={(e) => setTitleEN(e.target.value)}
              required
              mt={2}
            />
          </Box>

          {/* Arabic Title Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Title (Arabic)
              <Text as="span" color="red.500" mx={1}>*</Text>
            </Text>
            <Input
              type="text"
              id="titleAR"
              placeholder="أدخل العنوان بالعربية"
              value={titleAR}
              onChange={(e) => setTitleAR(e.target.value)}
              required
              mt={2}
              dir="rtl"
            />
          </Box>

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
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Banner preview"
                  style={{ 
                    width: '150px',
                    height: 'auto',
                    maxHeight: '80px',
                    borderRadius: 'md',
                    objectFit: 'cover'
                  }}
                />
                <Text mt={2} fontSize="sm">
                  {image.name}
                </Text>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Flex justify="center" mt={6} gap={4}>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
              width="120px"
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              width="120px"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AddBanner;