import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProviderMutation, useGetProviderQuery } from "api/providerSlice";
import Swal from "sweetalert2";

const EditProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Fetch provider data
  const { data: providerData, isLoading: isFetching } = useGetProviderQuery(id);
  const [updateProvider, { isLoading: isUpdating }] = useUpdateProviderMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: ""
  });

  // Theme colors
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");

  // Populate form when data is loaded
  useEffect(() => {
    if (providerData?.data) {
      setFormData({
        title_ar: providerData.data.title_ar || "",
        title_en: providerData.data.title_en || ""
      });
    }
  }, [providerData]);

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
      await updateProvider({ id, data:{...formData} }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Provider updated successfully',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/admin/undefined/providers');
      });
      
    } catch (error) {
      console.error("Update provider error:", error);
      const errorMessage = error.data?.context?.error?.errors?.[0]?.message || 
            error.data?.message || 
            'Failed to update provider';
      
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
    if (providerData?.data) {
      setFormData({
        title_ar: providerData.data.title_ar || "",
        title_en: providerData.data.title_en || ""
      });
    }
  };

  if (isFetching) {
    return (
      <Box p={{ base: 4, md: 6 }} className="container">
        <Card w="100%" bg={cardBg} borderRadius="lg" boxShadow="sm" p={6}>
          <Text>Loading provider data...</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} className="container">
      <Card w="100%" bg={cardBg} borderRadius="lg" boxShadow="sm" p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Edit Provider
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
              colorScheme="blue"
              isLoading={isUpdating}
              loadingText="Updating"
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              width={'200px'}
            >
              Update Provider
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};

export default EditProvider;