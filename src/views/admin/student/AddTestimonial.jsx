import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { FaUpload, FaTrash } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";

const AddTestimonial = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [stars, setStars] = useState(5);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setImage(files[0]);
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

  const handleCancel = () => {
    setName("");
    setTitle("");
    setStars(5);
    setDescription("");
    setImage(null);
  };

  const handleSubmit = () => {
    if (!name || !title || !description || !image) {
      alert("Please fill all required fields");
      return;
    }

    const testimonialData = {
      name,
      title,
      stars,
      description,
      image: image.name, // Just logging the filename for demo
      imagePreview: URL.createObjectURL(image) // For demo purposes
    };

    console.log("Testimonial Data:", testimonialData);
    alert("Check console for testimonial data");
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
            Add New Testimonial
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
          {/* Name Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Student Name <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mt={2}
            />
          </Box>

          {/* Title Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Title <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="text"
              placeholder="Enter student title/position"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              mt={2}
            />
          </Box>

          {/* Stars Rating */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Rating <Text as="span" color="red.500">*</Text>
            </Text>
            <Flex align="center" mt={2}>
              <NumberInput
                min={1}
                max={5}
                value={stars}
                onChange={(value) => setStars(value)}
                width="100px"
                mr={4}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Flex>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < stars ? "yellow.400" : "gray.300"}
                    boxSize={5}
                    mx={0.5}
                  />
                ))}
              </Flex>
            </Flex>
          </Box>

          {/* Description Field */}
          <Box mb={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Testimonial <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              placeholder="Enter testimonial description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              mt={2}
              rows={4}
            />
          </Box>

          {/* Action Buttons */}
          <Flex justify="center" mt={6}>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
              mr={4}
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
              onClick={handleSubmit}
              disabled={!name || !title || !description || !image}
              width="120px"
            >
              Save
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTestimonial;