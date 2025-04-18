import React, { useState, useEffect } from "react";
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
import { FaUpload } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "../../../api/blogs";
import { useAddFileMutation } from "../../../api/filesSlice";
import Swal from "sweetalert2";

const UpdateBlog = () => {
  const { id } = useParams();
  const { data: response, isLoading: isBlogLoading , refetch } = useGetBlogByIdQuery(id);
  const blogData = response?.data;
  
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [addFile] = useAddFileMutation();
  const navigate = useNavigate();

  // Form state
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Populate form with existing blog data
  useEffect(() => {
    if (blogData) {
      setEnglishTitle(blogData.title_en || "");
      setArabicTitle(blogData.title_ar || "");
      setEnglishDescription(blogData.description_en || "");
      setArabicDescription(blogData.description_ar || "");
      setPublishDate(blogData.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
      setImageUrl(blogData.image || "");
      
      // Convert blog_tags array to simple tag strings
      const tagNames = blogData.blog_tags?.map(tag => tag.name) || [];
      setTags(tagNames);
    }
  }, [blogData]);

     // Trigger refetch when component mounts (navigates to)
     React.useEffect(() => {
      // Only trigger refetch if the data is not being loaded
      if (!isBlogLoading) {
        refetch(); // Manually trigger refetch when component is mounted
      }
    }, [refetch, isBlogLoading]); // Dependency array to ensure it only runs on mount

  const toast = useToast();
  const handleImageUpload = async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setNewImage(file);
      
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("img", file);
        
        const response = await addFile(formData).unwrap();
        setImageUrl(response.url);
        
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire("Error!", "Failed to upload image", error);
        setNewImage(null);
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
    navigate("/admin/undefined/blogs");
  };

  const handleSubmit = async () => {
    if (!englishTitle || !arabicTitle || !englishDescription || !arabicDescription || !publishDate) {
      Swal.fire("Error!", "Please fill all required fields", "error");
      return;
    }

    // Format the date to ISO string
    const formattedDate = new Date(publishDate).toISOString();

    const updateData = {
      title_en: englishTitle,
      title_ar: arabicTitle,
      description_en: englishDescription,
      description_ar: arabicDescription,
      date: formattedDate,
      image: imageUrl,
      tags: tags, // Array of strings
    };

    try {
      await updateBlog({ id, blog: updateData }).unwrap();
      Swal.fire("Success!", "Blog updated successfully", "success");
      navigate("/admin/undefined/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire("Error!", "Failed to update blog", "error");
    }
  };

  if (isBlogLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
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
            Update Blog
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
                {tags?.map((tag, index) => (
                  <Tag
                    key={index}
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
                  {imageUrl ? "Change Image" : "Upload Image"}
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
                      {newImage?.name || "Current image"}
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
              isDisabled={isUploading || isUpdating}
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
              isLoading={isUpdating}
              isDisabled={isUploading}
            >
              Update
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;