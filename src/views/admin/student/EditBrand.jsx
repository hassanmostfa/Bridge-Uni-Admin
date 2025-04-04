import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBrandQuery, useUpdateBrandMutation } from "api/brandSlice";
import Swal from "sweetalert2";

const EditBrand = () => {
  const { id } = useParams(); // Get the brand ID from the URL
  const { data: brandResponse, isLoading: isFetching, isError: fetchError } = useGetBrandQuery(id); // Fetch the brand data
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation(); // Mutation hook for updating a brand
  const navigate = useNavigate();

  // State for form fields
  const [enName, setEnName] = useState("");
  const [arName, setArName] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // Populate the form with the existing data when the component mounts
  useEffect(() => {
    if (brandResponse?.data) {
      setEnName(brandResponse.data.name); // Set the English name
      setArName(brandResponse.data.translations.find((t) => t.languageId === "ar")?.name || ""); // Set the Arabic name
      // Set the image if it exists (you may need to fetch the image URL from the API)
    }
  }, [brandResponse]);

  // Handle image upload
  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  // Handle drag-and-drop events
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
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate("/admin/brands"); // Navigate back to the brands list
  };

  // Handle form submission
  const handleSend = async () => {
    if (!enName || !arName) {
      Swal.fire("Error!", "Please fill all required fields.", "error");
      return;
    }

    const payload = {
      id, // Include the brand ID for updating
      name: enName, // English name
      imageKey: image ? await convertImageToBase64(image) : brandResponse.data.imageKey, // Use existing image if no new image is uploaded
      isActive: true, // Default to true
      translations: [
        { languageId: "ar", name: arName }, // Arabic translation
      ],
    };

    try {
      const response = await updateBrand({ id, brand: payload }).unwrap(); // Send data to the API
      Swal.fire("Success!", "Brand updated successfully.", "success");
      navigate("/admin/brands"); // Redirect to the brands page
    } catch (error) {
      console.error("Failed to update brand:", error);
      Swal.fire("Error!", "Failed to update brand.", "error");
    }
  };

  // Convert image file to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  if (isFetching) return <Text>Loading...</Text>;
  if (fetchError) return <Text>Error loading brand data.</Text>;

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
            Edit Brand
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
              Brand En-Name
              <span className="text-danger mx-1">*</span>
            </Text>
            <Input
              type="text"
              id="en_name"
              placeholder="Enter Brand En-Name"
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              required
              mt={"8px"}
            />
          </div>

          {/* Arabic Name Field */}
          <div className="mb-3">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Brand Ar-Name
              <span className="text-danger mx-1">*</span>
            </Text>
            <Input
              type="text"
              id="ar_name"
              placeholder="Enter Brand Ar-Name"
              value={arName}
              onChange={(e) => setArName(e.target.value)}
              required
              mt={"8px"}
            />
          </div>

          {/* Drag-and-Drop Upload Section */}
          <Box
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor="gray.100"
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mb={4}
          >
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
              onClick={() => document.getElementById("fileInput").click()}
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
            {image ? (
              <Box
                mt={4}
                display={"flex"}
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  width={80}
                  height={80}
                  borderRadius="md"
                />
              </Box>
            ) : brandResponse?.data?.imageKey ? (
              <Box
                mt={4}
                display={"flex"}
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={brandResponse.data.imageKey}
                  alt="Brand Image"
                  width={80}
                  height={80}
                  borderRadius="md"
                />
              </Box>
            ) : null}
          </Box>

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
              isLoading={isUpdating}
            >
              Save Changes
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;