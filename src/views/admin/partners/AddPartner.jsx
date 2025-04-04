import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa6';

const AddPartner = () => {
  const [formData, setFormData] = useState({
    en_name: '',
    ar_name: '',
    logo: null
  });

  const [isDragging, setIsDragging] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
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
    handleImageUpload(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files[0]);
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.en_name || !formData.ar_name || !formData.logo) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically send the data to your API
    console.log('Partner data:', formData);
    
    toast({
      title: 'Success',
      description: 'Partner added successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    navigate('/admin/partners');
  };

  return (
    <Box w="100%" className="container">
      <Box bg={cardBg} className="add-admin-card shadow p-4 w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Add New Partner
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
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
              </Button>
              {formData.logo && (
                <Box mt={4}>
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Partner logo preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '8px'
                    }}
                  />
                  <Text mt={2} fontSize="sm" color="gray.600">
                    {formData.logo.name}
                  </Text>
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
            >
              Save Partner
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPartner;