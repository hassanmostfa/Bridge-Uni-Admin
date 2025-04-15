import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Icon,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa6';
import { useUpdatePartnerMutation } from '../../../api/partners';
import { useAddFileMutation } from '../../../api/filesSlice';
import { useGetPartnerByIdQuery } from '../../../api/partners';

const UpdatePartner = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    image: null,
    currentImageUrl: '',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const navigate = useNavigate();
  const toast = useToast();

  const [addFile] = useAddFileMutation();
  const [updatePartner] = useUpdatePartnerMutation();
  const { data: partnerData, isLoading, error } = useGetPartnerByIdQuery(id);

  useEffect(() => {
    if (partnerData?.data) {
      setFormData(prev => ({
        ...prev,
        currentImageUrl: partnerData.data.image
      }));
    }
  }, [partnerData]);

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let imageUrl = formData.currentImageUrl;

      // If a new image was uploaded, upload it first
      if (formData.image) {
        const fileFormData = new FormData();
        fileFormData.append('img', formData.image);

        const fileResponse = await addFile(fileFormData).unwrap();
        
        if (!fileResponse.flag) {
          throw new Error(fileResponse.message || 'Failed to upload image');
        }
        imageUrl = fileResponse.url;
      }

      // Then update the partner with the new data
      const partnerResponse = await updatePartner({
        id,
        data: { image: imageUrl }  // Make sure to wrap in data object
      }).unwrap();

      if (!partnerResponse.flag) {
        throw new Error(partnerResponse.message || 'Failed to update partner');
      }

      toast({
        title: 'Success',
        description: 'Partner updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/admin/undefined/partners');
      
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

  if (isLoading) return <Spinner />;
  if (error) return <Text>Error loading partner data</Text>;

  return (
    <Box w="100%" className="container">
      <Box bg={cardBg} className="add-admin-card shadow p-4 w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Update Partner
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

        <Box>
          {/* Logo Upload */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Partner Logo <span className="text-danger">*</span>
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
              <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
              <Text color="gray.500" mb={2}>
                Drag & Drop Logo Here
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
                Upload Logo
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  onChange={handleFileInputChange}
                />
              </Button>
              {(formData.image || formData.currentImageUrl) && (
                <Box mt={4}>
                  <img
                    src={formData.image ? URL.createObjectURL(formData.image) : formData.currentImageUrl}
                    alt="Partner logo preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '8px'
                    }}
                  />
                  {formData.image && (
                    <Text mt={2} fontSize="sm" color="gray.600">
                      {formData.image.name}
                    </Text>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Flex justify="flex-end" mt={6} gap={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={() => navigate(-1)}
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
              isDisabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Update Partner'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdatePartner;