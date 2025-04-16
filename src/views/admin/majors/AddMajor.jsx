import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Icon,
  Image,
  useToast,
  Spinner,
  Input,
  IconButton
} from "@chakra-ui/react";
import { FaUpload, FaXmark } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAddMajorMutation } from "../../../api/popularMajors";
import { useAddFileMutation } from "../../../api/filesSlice";
import Swal from "sweetalert2";

const AddMajor = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState({
    file: null,
    preview: null,
    isUploading: false,
    isUploaded: false,
    url: null,
    error: null
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const navigate = useNavigate();
  const toast = useToast();

  const [addFile] = useAddFileMutation();
  const [addMajor] = useAddMajorMutation();

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file only",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Clear previous image if exists
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }

    // Set new image with preview
    setImage({
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      isUploaded: false,
      url: null,
      error: null
    });

    try {
      const fileFormData = new FormData();
      fileFormData.append('img', file);

      const fileResponse = await addFile(fileFormData).unwrap();
      
      if (!fileResponse.flag) {
        throw new Error(fileResponse.message || 'Failed to upload image');
      }

      setImage(prev => ({
        ...prev,
        isUploading: false,
        isUploaded: true,
        url: fileResponse.url,
        error: null
      }));

    } catch (error) {
      setImage(prev => ({
        ...prev,
        isUploading: false,
        error: error.message
      }));

      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        status: "error",
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
    if (e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleImageUpload(e.target.files[0]);
    }
    e.target.value = null; // Reset input
  };

  const removeImage = () => {
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage({
      file: null,
      preview: null,
      isUploading: false,
      isUploaded: false,
      url: null,
      error: null
    });
  };

  const handleSubmit = async () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for the major",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!image.isUploaded) {
      toast({
        title: "Error",
        description: "Please wait for image to finish uploading",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const majorResponse = await addMajor({
        title,
        image: image.url
      }).unwrap();

      if (!majorResponse.flag) {
        throw new Error(majorResponse.message || 'Failed to add major');
      }

      Swal.fire({
        title: "Success!",
        text: "Major added successfully",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        navigate("/admin/undefined/majors");
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add major",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will lose all unsaved changes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
        navigate("/admin/majors");
      }
    });
  };

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
            Add New Major
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

        <Box>
          <Box mb={6}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Major Title
              <Text as="span" className="text-danger mx-1">*</Text>
            </Text>
            <Input
              type="text"
              id="title"
              placeholder="Enter Major Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              mt="8px"
              bg={inputBg}
            />
          </Box>

          <Box mb={6}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Major Image
              <Text as="span" className="text-danger mx-1">*</Text>
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
            </Box>

            {image.preview && (
              <Box mt={4} position="relative" maxW="300px">
                <Image
                  src={image.preview}
                  alt="Preview"
                  width="100%"
                  height="200px"
                  borderRadius="md"
                  objectFit="contain"
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg={image.isUploading ? "rgba(0,0,0,0.5)" : "transparent"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                >
                  {image.isUploading && <Spinner color="white" />}
                  {image.isUploaded && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="green.500"
                      color="white"
                      borderRadius="full"
                      p={1}
                      fontSize="xs"
                    >
                      ✓
                    </Box>
                  )}
                  {image.error && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="red.500"
                      color="white"
                      borderRadius="full"
                      p={1}
                      fontSize="xs"
                    >
                      !
                    </Box>
                  )}
                </Box>
                <IconButton
                  icon={<FaXmark />}
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="red"
                  size="xs"
                  isRound
                  onClick={removeImage}
                  aria-label="Remove image"
                />
              </Box>
            )}
          </Box>

          <Flex justify="flex-end" mt={6} gap={4}>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
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
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !image.isUploaded}
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Save Major'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMajor;