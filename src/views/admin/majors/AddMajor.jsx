import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Text,
  useColorModeValue,
  Icon,
  Image,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaXmark } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddMajor = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages([...images, ...newImages]);
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
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleCancel = () => {
    setTitle("");
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
  };

  const handleSubmit = () => {
    const majorData = {
      title,
      images: images.map(img => img.file),
    };
    console.log("Major Data:", majorData);
    navigate('/admin/majors');
  };

  return (
    <Box className="container add-admin-container w-100">
      <Box className="add-admin-card shadow p-4 bg-white w-100">
        <Flex className="mb-3" justify="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            mb="20px"
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
        <Box as="form">
          <Grid templateColumns="repeat(1, 1fr)" gap={6}>
            <Box>
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
              />
            </Box>
          </Grid>

          <Box
            border="1px dashed"
            borderColor={isDragging ? "blue.500" : "gray.300"}
            borderRadius="md"
            p={4}
            textAlign="center"
            backgroundColor={isDragging ? "blue.50" : "gray.100"}
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mb={4}
            mt={6}
          >
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Images Here
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
              Upload Images
              <input
                type="file"
                id="fileInput"
                hidden
                accept="image/*"
                onChange={handleFileInputChange}
                multiple
              />
            </Button>
          </Box>

          {images.length > 0 && (
            <Box mt={6}>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb={2}>
                Uploaded Images ({images.length})
              </Text>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {images.map((image, index) => (
                  <Box key={index} position="relative">
                    <Image
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      width="100%"
                      height="120px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                    <IconButton
                      icon={<FaXmark />}
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      size="xs"
                      isRound
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}

          <Flex justify="center" mt={6}>
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
              onClick={handleSubmit}
              disabled={!title || images.length === 0}
            >
              Save Major
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMajor;