import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Icon,
  Textarea,
  Image,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FaUpload, FaTrash } from 'react-icons/fa6';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetWhyUniBridgeByIdQuery, useUpdateWhyUniBridgeMutation } from '../../../api/why';
import { useAddFileMutation } from '../../../api/filesSlice';
import Swal from 'sweetalert2';

const UpdateWhy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // API hooks
  const { data: whyData, isLoading: isFetching } = useGetWhyUniBridgeByIdQuery(id);
  const [updateWhyUniBridge] = useUpdateWhyUniBridgeMutation();
  const [addFile] = useAddFileMutation();

  // State
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    image: null,
    imageUrl: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Colors
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  // Load initial data
  useEffect(() => {
    if (whyData?.data) {
      setFormData({
        title_en: whyData.data.title_en || '',
        title_ar: whyData.data.title_ar || '',
        image: null,
        imageUrl: whyData.data.image || null,
      });
    }
  }, [whyData]);

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid file',
        text: 'Please upload an image file',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsUploadingImage(true);
    setFormData(prev => ({ ...prev, image: file }));

    try {
      const fileFormData = new FormData();
      fileFormData.append('img', file);

      const fileResponse = await addFile(fileFormData).unwrap();
      
      if (!fileResponse.flag) {
        throw new Error(fileResponse.message || 'Failed to upload image');
      }

      setFormData(prev => ({ ...prev, imageUrl: fileResponse.url }));
      toast({
        title: 'Image uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to upload image',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      setFormData(prev => ({ ...prev, image: null, imageUrl: prev.imageUrl }));
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

  const handleSubmit = async () => {
    if (!formData.title_en || !formData.title_ar || !formData.imageUrl) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields and upload an image',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateWhyUniBridge({
        id,
        data: {
          image: formData.imageUrl,
          title_en: formData.title_en,
          title_ar: formData.title_ar
        }
      }).unwrap();

      if (!response.flag) {
        throw new Error(response.message || 'Failed to update reason');
      }

      await Swal.fire({
        title: 'Success!',
        text: 'Reason updated successfully',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });

      navigate('/admin/undefined/cms/why-uni-bridge');
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all unsaved changes',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/cms/why-unibridge');
      }
    });
  };

  if (isFetching) return <div>Loading...</div>;

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
            Update Reason
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
          {/* English Title Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              English Title <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              name="title_en"
              placeholder="Enter English title"
              value={formData.title_en}
              onChange={handleInputChange}
              required
              mt={2}
              rows={4}
            />
          </Box>

          {/* Arabic Title Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Arabic Title <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              name="title_ar"
              placeholder="Enter Arabic title"
              value={formData.title_ar}
              onChange={handleInputChange}
              required
              mt={2}
              rows={4}
              dir="rtl"
            />
          </Box>

          {/* Image Upload Section */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Image <Text as="span" color="red.500">*</Text>
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
                    isDisabled={isUploadingImage}
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
                </>
              )}
              {(formData.image || formData.imageUrl) && !isUploadingImage && (
                <Box mt={4}>
                  <Image
                    src={formData.imageUrl || URL.createObjectURL(formData.image)}
                    alt="Reason image preview"
                    maxW="100%"
                    maxH="150px"
                    borderRadius="8px"
                  />
                  <Text mt={2} fontSize="sm" color="gray.600">
                    {formData.image?.name || 'Current Image'}
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
                         !formData.title_en || !formData.title_ar || 
                         !formData.imageUrl}
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

export default UpdateWhy;