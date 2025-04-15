import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdatePositionMutation, useGetPositionQuery } from "api/positionSlice";
import Swal from "sweetalert2";

const EditPosition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Fetch position data
  const { data: positionData, isLoading: isFetching } = useGetPositionQuery(id);
  const [updatePosition, { isLoading: isUpdating }] = useUpdatePositionMutation();

  // Form state
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: ""
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (positionData?.data) {
      setFormData({
        title_en: positionData.data.title_en || "",
        title_ar: positionData.data.title_ar || ""
      });
    }
  }, [positionData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    if (positionData?.data) {
      setFormData({
        title_en: positionData.data.title_en || "",
        title_ar: positionData.data.title_ar || ""
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title_en || !formData.title_ar) {
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
      await updatePosition({ id, data:{...formData} }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Position updated successfully',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/undefined/cms/positions');
        }
      });
      
    } catch (error) {
      console.error("Update position error:", error);
      const errorMessage = error.data?.context?.error?.errors?.[0]?.message || 
                         error.data?.message || 
                         'Failed to update position';
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isFetching) {
    return (
      <div className="container add-admin-container w-100">
        <div className="add-admin-card shadow p-4 bg-white w-100">
          <Text>Loading position data...</Text>
        </div>
      </div>
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
            Edit Position
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
        <form>
          {/* English Position Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Position Title (English)
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              name="title_en"
              type="text"
              placeholder="Enter position title in English"
              value={formData.title_en}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          {/* Arabic Position Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Position Title (Arabic)
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              name="title_ar"
              type="text"
              placeholder="أدخل المسمى الوظيفي بالعربية"
              value={formData.title_ar}
              onChange={handleInputChange}
              dir="rtl"
              required
            />
          </FormControl>

          {/* Action Buttons */}
          <Flex justify="flex-end" mt={6} gap={4}>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
              width="120px"
            >
              Reset
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
              isLoading={isUpdating}
              loadingText="Updating"
            >
              Update
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditPosition;