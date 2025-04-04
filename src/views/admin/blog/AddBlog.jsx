import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Textarea,
  Text,
  useColorModeValue,
  Icon,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "./blog.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddBlog = () => {
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
  const [publishDate, setPublishDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tags, setTags] = useState([
    { id: 1, name: "Technology" },
    { id: 2, name: "Design" },
    { id: 3, name: "Business" },
  ]);
  const [selectedTags, setSelectedTags] = useState([]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
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
    setEnglishTitle("");
    setArabicTitle("");
    setEnglishDescription("");
    setArabicDescription("");
    setPublishDate(new Date());
    setImage(null);
    setSelectedTags([]);
  };

  const handleSubmit = () => {
    const blogData = {
      englishTitle,
      arabicTitle,
      englishDescription,
      arabicDescription,
      publishDate: publishDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      image,
      tags: selectedTags.map(tag => tag.value),
    };
    console.log("Blog Data:", blogData);
    // You can send this data to an API or perform other actions
  };

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
            Add New Blog
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
          {/* English Title and Arabic Title Fields */}
          <Flex gap={4} mb={4}>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                English Title <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Input
                type="text"
                id="englishTitle"
                placeholder="Enter English Title"
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
                required
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Arabic Title <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Input
                type="text"
                id="arabicTitle"
                placeholder="ادخل عنوان"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                dir="rtl"
                required
              />
            </FormControl>
          </Flex>

          {/* English Description and Arabic Description Fields */}
          <Flex gap={4} mb={4}>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                English Description <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Textarea
                id="englishDescription"
                placeholder="Enter English Description"
                value={englishDescription}
                onChange={(e) => setEnglishDescription(e.target.value)}
                required
                minH="120px"
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Arabic Description <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Textarea
                id="arabicDescription"
                placeholder="ادخل الوصف"
                value={arabicDescription}
                onChange={(e) => setArabicDescription(e.target.value)}
                dir="rtl"
                required
                minH="120px"
              />
            </FormControl>
          </Flex>

          {/* Date and Tags Fields */}
         {/* Date and Tags Fields */}
         <Flex gap={4} mb={4}>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Publish Date <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Tags
              </FormLabel>
              <Select
                id="tags"
                placeholder="Select Tags"
                value={selectedTags}
                onChange={setSelectedTags}
                isMulti
                options={tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                  }),
                }}
              />
            </FormControl>
          </Flex>

          {/* Image Upload Section */}
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
            transition="all 0.2s"
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
            {image && (
              <Box
                mt={4}
                display={'flex'}
                flexDirection="column"
                alignItems="center"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Blog preview"
                  width={150}
                  height={100}
                  style={{ borderRadius: "md", objectFit: "cover" }}
                />
                <Text mt={2} fontSize="sm">
                  {image.name}
                </Text>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Flex justify="flex-end" mt={6} gap={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={handleCancel}
              width="120px"
            >
              Cancel
            </Button>
            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              width="120px"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;