import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAddCategoryMutation } from "api/categorySlice";
import Swal from "sweetalert2";

const AddCategory = () => {
  const [enName, setEnName] = useState(""); // State for English name
  const [arName, setArName] = useState(""); // State for Arabic name
  const [image, setImage] = useState(null); // State for image file
  const [selectedCategoryType, setSelectedCategoryType] = useState("Select Category Type"); // State for category type
  const [addCategory, { isLoading }] = useAddCategoryMutation(); // Mutation hook for adding a category
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();

   const textColor = useColorModeValue('secondaryGray.900', 'white');
    const cardBg = useColorModeValue('white', 'navy.700');
    const inputBg = useColorModeValue('gray.100', 'gray.700');

  // Handle cancel action
  const handleCancel = () => {
    setEnName("");
    setArName("");
    setSelectedCategoryType("Select Category Type");
  };



  // Handle form submission
  const handleSend = async () => {
    if (!enName || !arName === "Select Category Type") {
      Swal.fire("Error!", "Please fill all required fields.", "error");
      return;
    }

    // Convert the image file to a base64 string
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // Remove the data URL prefix

      const payload = {
        translations: [
          { languageId: "en", name: enName }, // English translation
          { languageId: "ar", name: arName }, // Arabic translation
        ],
        // categoryType: selectedCategoryType, // Include the category type
      };

      try {
        const response = await addCategory(payload).unwrap(); // Send data to the API
        Swal.fire("Success!", "Category added successfully.", "success");
        navigate("/admin/categories"); // Redirect to the categories page
      } catch (error) {
        console.error("Failed to add category:", error);
        Swal.fire("Error!", "Failed to add category.", "error");
      }
    };
  };

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
            Add New Category
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
              Save
            </Button>
          </Flex>
        </form>
      </Box>
    </div>
  );
};

export default AddCategory;