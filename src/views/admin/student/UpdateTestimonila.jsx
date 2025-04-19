import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FaUpload, FaTrash } from 'react-icons/fa6';
import { IoMdArrowBack } from 'react-icons/io';
import { StarIcon } from '@chakra-ui/icons';
import { useUpdateStudentTestimonialMutation, useGetStudentTestimonialByIdQuery } from '../../../api/studentTestimonials';
import { useAddFileMutation } from '../../../api/filesSlice';
import Swal from 'sweetalert2';

const UpdateTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");

  const toast = useToast();
  // API Hooks
  const { data: testimonialData, isLoading: isFetching } = useGetStudentTestimonialByIdQuery(id);
  const [updateTestimonial] = useUpdateStudentTestimonialMutation();
  const [addFile] = useAddFileMutation();

  // State
  const [formData, setFormData] = useState({
    student_name: '',
    title: '',
    rate: 5,
    testimonial: '',
    image: null,
    imageUrl: '',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load existing testimonial data
  useEffect(() => {
    if (testimonialData?.data) {
      setFormData({
        student_name: testimonialData.data.student_name || '',
        title: testimonialData.data.title || '',
        rate: testimonialData.data.rate || 5,
        testimonial: testimonialData.data.testimonial || '',
        image: null,
        imageUrl: testimonialData.data.image || '',
      });
    }
  }, [testimonialData]);

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
    
    try {
      const fileFormData = new FormData();
      fileFormData.append("img", file);

      const fileResponse = await addFile(fileFormData).unwrap();
      
      if (!fileResponse.flag) {
        throw new Error(fileResponse.message || "Failed to upload image");
      }

      setFormData(prev => ({ 
        ...prev, 
        image: file,
        imageUrl: fileResponse.url 
      }));

     toast({
       title: "Image uploaded successfully",
       status: "success",
       duration: 5000,
       isClosable: true,
       position: "top-right",
       backgroundColor: "green.500",
     })
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to upload image",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      setFormData(prev => ({ ...prev, image: null, imageUrl: '' }));
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

  const handleRateChange = (value) => {
    setFormData(prev => ({ ...prev, rate: value }));
  };

  const handleSubmit = async () => {
    if (!formData.student_name || !formData.title || !formData.testimonial || !formData.imageUrl) {
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
      const response = await updateTestimonial({
        id, // Correctly passing the id parameter
        data: { // Wrapping the data in a 'data' object as per your RTK mutation
          student_name: formData.student_name,
          title: formData.title,
          rate: formData.rate,
          testimonial: formData.testimonial,
          image: formData.imageUrl
        }
      }).unwrap();

      if (!response.flag) {
        throw new Error(response.message || "Failed to update testimonial");
      }

      await Swal.fire({
        title: "Success!",
        text: "Testimonial updated successfully",
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
    navigate("/admin/student-testimonials");
  };

  if (isFetching) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

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
            Update Testimonial
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
        </Flex>
        
        <Box>
          {/* Name Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Student Name <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              name="student_name"
              type="text"
              placeholder="Enter student name"
              value={formData.student_name}
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

          {/* Rating Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Rating <Text as="span" color="red.500">*</Text>
            </Text>
            <Flex align="center" mt={2}>
              <NumberInput
                min={1}
                max={5}
                value={formData.rate}
                onChange={handleRateChange}
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
                    color={i < formData.rate ? "yellow.400" : "gray.300"}
                    boxSize={5}
                    mx={0.5}
                  />
                ))}
              </Flex>
            </Flex>
          </Box>

          {/* Testimonial Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Testimonial <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              name="testimonial"
              placeholder="Enter testimonial description"
              value={formData.testimonial}
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
              {(formData.image || formData.imageUrl) && !isUploadingImage && (
                <Box mt={4}>
                  <Image
                    src={formData.image ? URL.createObjectURL(formData.image) : formData.imageUrl}
                    alt="Student photo preview"
                    maxW="100%"
                    maxH="150px"
                    borderRadius="8px"
                  />
                  <Text mt={2} fontSize="sm" color="gray.600">
                    {formData.image?.name || "Current image"}
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
                      imageUrl: '' 
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
                         !formData.student_name || !formData.title || 
                         !formData.testimonial || !formData.imageUrl}
              width="120px"
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Update'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateTestimonial;