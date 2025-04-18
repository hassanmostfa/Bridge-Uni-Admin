import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner
} from "@chakra-ui/react";
import { IoMdArrowBack, IoIosArrowDown } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from "api/categorySlice";
import Swal from "sweetalert2";

const EditCategory = () => {
  const { id } = useParams();
  console.log("Category ID:", id);
  
  const { data, isLoading: isCategoryLoading } = useGetCategoryByIdQuery(id);

  const categoryData = data?.data;
  
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const navigate = useNavigate();

  // State for form fields
  const [enName, setEnName] = useState("");
  const [arName, setArName] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] = useState("Select Category Type");

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  // Populate the form with the existing data when the component mounts
  useEffect(() => {
    if (categoryData) {
      setEnName(categoryData.title_en || "");
      setArName(categoryData.title_ar || "");
      setSelectedCategoryType(categoryData.categoryType || "Select Category Type");
    }
  }, [categoryData]);

  const handleCancel = () => {
    navigate("/admin/categories");
  };

  const handleSelectCategoryType = (type) => {
    setSelectedCategoryType(type);
  };

  const handleSend = async () => {
    if (!enName || !arName || !selectedCategoryType) {
      Swal.fire("Error!", "Please fill all required fields.", "error");
      return;
    }

    const payload = {
      title_en: enName,
      title_ar: arName,
      // categoryType: selectedCategoryType, // Uncomment if you need this
    };

    try {
      const response = await updateCategory({ id, category: payload }).unwrap();
      Swal.fire("Success!", "Category updated successfully.", "success");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
      Swal.fire("Error!", "Failed to update category.", "error");
    }
  };

  if (isCategoryLoading) {
    return <Spinner />;
  }

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container add-admin-container w-100">
      <Box bg={cardBg} className="add-admin-card shadow p-4 w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            mb="20px !important"
            lineHeight="100%"
          >
            Edit Category
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
          {/* English Name Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Category En-Name
              <span className="text-danger mx-1">*</span>
            </Text>
            <Input
              type="text"
              id="en_name"
              placeholder="Enter Category En-Name"
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              required
              mt={"8px"}
              bg={inputBg}
            />
          </div>

          {/* Arabic Name Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Category Ar-Name
              <span className="text-danger mx-1">*</span>
            </Text>
            <Input
              type="text"
              id="ar_name"
              placeholder="Enter Category Ar-Name"
              value={arName}
              onChange={(e) => setArName(e.target.value)}
              required
              mt={"8px"}
              bg={inputBg}
            />
          </div>

          {/* Action Buttons */}
          <Flex justify="center" mt={4}>
            <Button variant="outline" colorScheme="red" onClick={handleCancel} mr={2}>
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
              onClick={handleSend}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </Flex>
        </form>
      </Box>
    </div>
  );
};

export default EditCategory;