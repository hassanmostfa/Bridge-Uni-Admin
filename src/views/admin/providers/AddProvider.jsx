import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Text,
  useColorModeValue,
  useToast,
  Card,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAddProviderMutation } from "api/providerSlice";
import Swal from "sweetalert2";

const AddProvider = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [createProvider, { isLoading }] = useAddProviderMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: ""
  });

  // Theme colors
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title_ar || !formData.title_en) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createProvider(formData).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Provider created successfully',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/admin/undefined/providers');
      });
      
    } catch (error) {
      console.error("Create provider error:", error);
      const errorMessage = error.data?.context?.error?.errors?.[0]?.message || 
                         error.data?.message || 
                         'Failed to create provider';
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      title_ar: "",
      title_en: ""
    });
  };

  return (
    <Box p={{ base: 4, md: 6 }} className="container">
      <Card  w="100%" bg={cardBg} borderRadius="lg" boxShadow="sm" p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Add New Provider
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

        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6}>
            {/* Arabic Name Field */}
            <FormControl isRequired>
              <FormLabel>Provider Name (Arabic)</FormLabel>
              <Input
                name="title_ar"
                placeholder="Enter provider name in Arabic"
                value={formData.title_ar}
                onChange={handleInputChange}
                dir="rtl"
              />
            </FormControl>

            {/* English Name Field */}
            <FormControl isRequired>
              <FormLabel>Provider Name (English)</FormLabel>
              <Input
                name="title_en"
                placeholder="Enter provider name in English"
                value={formData.title_en}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Flex justify="flex-end" gap={4}>
            <Button
              type="button"
              variant="outline"
              colorScheme="red"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Submitting"
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              width={'200px'}
            >
              Save Provider
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};

export default AddProvider;