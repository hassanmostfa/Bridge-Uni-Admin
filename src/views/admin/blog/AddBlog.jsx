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
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Spinner,
  useToast
} from "@chakra-ui/react";
import "./blog.css";
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAddBlogMutation } from "../../../api/blogs";
import { useAddFileMutation } from "../../../api/filesSlice";
import Swal from "sweetalert2";

const AddBlog = () => {
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();
  const [addBlog, { isLoading: isAddingBlog }] = useAddBlogMutation();
  const [addFile] = useAddFileMutation();

  const toast = useToast();
  const handleImageUpload = async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("img", file);
        
        const response = await addFile(formData).unwrap();
        setImageUrl(response.url); // Assuming your API returns { url: "..." }
        
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error uploading image",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setImage(null);
      } finally {
        setIsUploading(false);
      }
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

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCancel = () => {
    setEnglishTitle("");
    setArabicTitle("");
    setEnglishDescription("");
    setArabicDescription("");
    setPublishDate(new Date().toISOString().split('T')[0]);
    setImage(null);
    setImageUrl("");
    setTags([]);
  };

  const handleSubmit = async () => {
    if (!englishTitle || !arabicTitle || !englishDescription || !arabicDescription || !publishDate || !imageUrl) {
      Swal.fire("Error!", "Please fill all required fields", "error");
      return;
    }

    const blogData = {
      title_en: englishTitle,
      title_ar: arabicTitle,
      description_en: englishDescription,
      description_ar: arabicDescription,
      date: publishDate,
      image: imageUrl,
      tags: tags,
    };

    try {
      await addBlog(blogData).unwrap();
      Swal.fire("Success!", "Blog created successfully", "success");
      navigate("/admin/undefined/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      Swal.fire("Error!", "Failed to create blog", "error");
    }
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
            <FormControl flex={1} isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                English Title
              </FormLabel>
              <Input
                type="text"
                placeholder="Enter English Title"
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
              />
            </FormControl>
            <FormControl flex={1} isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Arabic Title
              </FormLabel>
              <Input
                type="text"
                placeholder="ادخل عنوان"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                dir="rtl"
              />
            </FormControl>
          </Flex>

          {/* English Description and Arabic Description Fields */}
          <Flex gap={4} mb={4}>
            <FormControl flex={1} isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                English Description
              </FormLabel>
              <Textarea
                placeholder="Enter English Description"
                value={englishDescription}
                onChange={(e) => setEnglishDescription(e.target.value)}
                minH="120px"
              />
            </FormControl>
            <FormControl flex={1} isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Arabic Description
              </FormLabel>
              <Textarea
                placeholder="ادخل الوصف"
                value={arabicDescription}
                onChange={(e) => setArabicDescription(e.target.value)}
                dir="rtl"
                minH="120px"
              />
            </FormControl>
          </Flex>

          {/* Date and Tags Fields */}
          <Flex gap={4} mb={4}>
            <FormControl flex={1} isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Publish Date
              </FormLabel>
              <Input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Tags
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Add tags (press Enter)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Flex mt={2} wrap="wrap" gap={2}>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                ))}
              </Flex>
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
            {isUploading ? (
              <Flex direction="column" align="center">
                <Spinner size="xl" mb={4} />
                <Text>Uploading image...</Text>
              </Flex>
            ) : (
              <>
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
                {imageUrl && (
                  <Box
                    mt={4}
                    display={'flex'}
                    flexDirection="column"
                    alignItems="center"
                  >
                    <img
                      src={imageUrl}
                      alt="Blog preview"
                      width={150}
                      height={100}
                      style={{ borderRadius: "md", objectFit: "cover" }}
                    />
                    <Text mt={2} fontSize="sm">
                      {image?.name || "Uploaded image"}
                    </Text>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Action Buttons */}
          <Flex justify="flex-end" mt={6} gap={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={handleCancel}
              width="120px"
              isDisabled={isUploading || isAddingBlog}
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
              isLoading={isAddingBlog}
              isDisabled={isUploading}
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