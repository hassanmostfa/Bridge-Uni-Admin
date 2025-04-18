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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FaUpload, FaTrash } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import { useAddStudentTestimonialMutation } from "../../../api/studentTestimonials";
import { useAddFileMutation } from "../../../api/filesSlice";
import Swal from "sweetalert2";

const AddTestimonial = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    stars: 5,
    description: "",
    image: null,
    imageUrl: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const navigate = useNavigate();

  const [addFile] = useAddFileMutation();
  const [addTestimonial] = useAddStudentTestimonialMutation();

  const toast = useToast();
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      Swal.fire({
        title: "Invalid file",
        text: "Please upload an image file",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsUploadingImage(true);
    setFormData(prev => ({ ...prev, image: file }));

    try {
      const fileFormData = new FormData();
      fileFormData.append("img", file);

      const fileResponse = await addFile(fileFormData).unwrap();
      
      if (!fileResponse.flag) {
        throw new Error(fileResponse.message || "Failed to upload image");
      }

      setFormData(prev => ({ ...prev, imageUrl: fileResponse.url }));
      toast({
        title: "Image uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to upload image",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      setFormData(prev => ({ ...prev, image: null, imageUrl: null }));
    } finally {
      setIsUploadingImage(false);
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
    if (e.dataTransfer.files.length) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStarsChange = (value) => {
    setFormData(prev => ({ ...prev, stars: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.title || !formData.description || !formData.imageUrl) {
      Swal.fire({
        title: "Error!",
        text: "Please fill all required fields",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const testimonialResponse = await addTestimonial({
        student_name: formData.name,
        title: formData.title,
        rate: formData.stars,
        testimonial: formData.description,
        image: formData.imageUrl
      }).unwrap();
      if (!testimonialResponse.flag) {
        throw new Error(testimonialResponse.message || "Failed to add testimonial");
      }

      await Swal.fire({
        title: "Success!",
        text: "Testimonial added successfully",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      navigate("/admin/undefined/student-testimonials");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will lose all unsaved changes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          name: "",
          title: "",
          stars: "",
          description: "",
          image: null,
          imageUrl: null,
        });
      }
    });
  };

  return (
    <Box w="100%" className="container">
      <Box bg={cardBg} className="add-admin-card shadow p-4 w-100">
        <Flex className="mb-3" justify="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Add New Testimonial
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
          {/* Name Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Student Name <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="name"
              type="text"
              placeholder="Enter student name"
              value={formData.name}
              onChange={handleInputChange}
              required
              mt={2}
            />
          </Box>

          {/* Title Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Title <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="title"
              type="text"
              placeholder="Enter student title/position"
              value={formData.title}
              onChange={handleInputChange}
              required
              mt={2}
            />
          </Box>

          {/* Stars Rating */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Rating <Text as="span" color="red.500">*</Text>
            </Text>
            <Flex align="center" mt={2}>
              <NumberInput
                min={1}
                max={5}
                value={formData.stars}
                onChange={handleStarsChange}
                width="100px"
                mr={4}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Flex>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < formData.stars ? "yellow.400" : "gray.300"}
                    boxSize={5}
                    mx={0.5}
                  />
                ))}
              </Flex>
            </Flex>
          </Box>

          {/* Description Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Testimonial <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              name="description"
              placeholder="Enter testimonial description"
              value={formData.description}
              onChange={handleInputChange}
              required
              mt={2}
              rows={4}
            />
          </Box>

          {/* Image Upload */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Student Photo <Text as="span" color="red.500">*</Text>
            </Text>
            <Box
              border="1px dashed"
              borderColor={isDragging ? "blue.500" : "gray.300"}
              borderRadius="md"
              p={4}
              textAlign="center"
              backgroundColor={isDragging ? "blue.50" : inputBg}
              cursor="pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              mt={2}
            >
              {isUploadingImage ? (
                <Flex direction="column" align="center">
                  <Spinner size="xl" mb={4} />
                  <Text>Uploading image...</Text>
                </Flex>
              ) : (
                <>
                  <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
                  <Text color="gray.500" mb={2}>
                    Drag & Drop Photo Here
                  </Text>
                  <Text color="gray.500" mb={2}>
                    or
                  </Text>
                  <Button
                    variant="outline"
                    color="#422afb"
                    border="none"
                    onClick={() => document.getElementById('fileInput').click()}
                    isDisabled={isUploadingImage}
                  >
                    Upload Photo
                    <input
                      type="file"
                      id="fileInput"
                      hidden
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                  </Button>
                </>
              )}
              {formData.image && !isUploadingImage && (
                <Box mt={4}>
                  <Image
                    src={formData.imageUrl || URL.createObjectURL(formData.image)}
                    alt="Student photo preview"
                    maxW="100%"
                    maxH="150px"
                    borderRadius="8px"
                  />
                  <Text mt={2} fontSize="sm" color="gray.600">
                    {formData.image.name}
                  </Text>
                  <Button
                    leftIcon={<FaTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    mt={2}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      image: null,
                      imageUrl: null 
                    }))}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Flex justify="center" mt={6} gap={4}>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
              mr={4}
              width="120px"
              isDisabled={isSubmitting || isUploadingImage}
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
              onClick={handleSubmit}
              isDisabled={isSubmitting || isUploadingImage || 
                         !formData.name || !formData.title || 
                         !formData.description || !formData.imageUrl}
              width="120px"
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Save'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTestimonial;