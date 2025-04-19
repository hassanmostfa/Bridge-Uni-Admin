import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormControl,
  Text,
  Input,
  Button,
  Flex,
  Box,
  Icon,
  Image,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";

const VideosStep = ({ formData, handleChange, updateNestedState ,errors }) => {
  const [addFile] = useAddFileMutation();
  const [uploadingIndices, setUploadingIndices] = useState([]);

  const addVideo = () => {
    handleChange("videos", [...formData.videos, { url: "", year: "" }]);
  };

  const removeVideo = (index) => {
    if (formData.videos.length > 1) {
      const updated = [...formData.videos];
      updated.splice(index, 1);
      handleChange("videos", updated);
    }
  };

  const handleVideoUpload = async (file, index) => {
    if (!file) return;
    
    try {
      setUploadingIndices(prev => [...prev, index]);
      const formData = new FormData();
      formData.append('img', file); // Changed from 'img' to 'video'
      const response = await addFile(formData).unwrap();
      
      if (response.url) {
        updateNestedState("videos", index, "url", response.url);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploadingIndices(prev => prev.filter(i => i !== index));
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleVideoUpload(file, index);
    }
  };

  const handleFileInputChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleVideoUpload(file, index);
    }
    // Reset the input value to allow re-uploading the same file
    e.target.value = null;
  };

  const handleRemoveVideo = (index) => {
    updateNestedState("videos", index, "url", "");
  };

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Course Videos</Text>
      </CardHeader>
      <CardBody>
        {formData.videos.map((video, index) => (
          <Card key={index} mb={4}>
            <CardHeader>
              <Flex justify="space-between">
                <Text fontWeight="bold">Video {index + 1}</Text>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeVideo(index)}
                  leftIcon={<FaTrash />}
                >
                  Remove
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormControl mb={4} isInvalid={!video.url}>
                <Text fontSize="sm" fontWeight="700">
                  Video File
                </Text>
                <Box
                  border="1px dashed"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  backgroundColor="gray.100"
                  cursor="pointer"
                  mt={2}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {uploadingIndices.includes(index) ? (
                    <Flex direction="column" align="center" justify="center" minH="120px">
                      <Spinner size="lg" mb={4} />
                      <Text>Uploading Video...</Text>
                    </Flex>
                  ) : video.url ? (
                    <Box position="relative">
                      <Flex direction="column" align="center">
                        <Text mb={2}>Video Uploaded</Text>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: '#3182ce',
                            textDecoration: 'underline',
                            marginBottom: '8px'
                          }}
                        >
                          View Video
                        </a>
                        <Flex justify="center" gap={2}>
                          <Button
                            as="label"
                            htmlFor={`videoFile-${index}`}
                            variant="outline"
                            colorScheme="blue"
                            size="sm"
                          >
                            Change Video
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveVideo(index)}
                            leftIcon={<FaTrash />}
                          >
                            Remove
                          </Button>
                        </Flex>
                      </Flex>
                      <Input
                        type="file"
                        id={`videoFile-${index}`}
                        hidden
                        accept="video/*"
                        onChange={(e) => handleFileInputChange(e, index)}
                      />
                    </Box>
                  ) : (
                    <>
                      <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
                      <Text color="gray.500" mb={2}>
                        Drag & Drop Video Here
                      </Text>
                      <Text color="gray.500" mb={2}>
                        or
                      </Text>
                      <Button
                        variant="outline"
                        color="#422afb"
                        border="none"
                        onClick={() => document.getElementById(`videoFile-${index}`).click()}
                      >
                        Browse Files
                      </Button>
                      <Input
                        type="file"
                        id={`videoFile-${index}`}
                        hidden
                        accept="video/*"
                        onChange={(e) => handleFileInputChange(e, index)}
                      />
                    </>
                  )}
                </Box>
                {errors.videos && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.videos} (Video is required)
                  </Text>
                )}
              </FormControl>

              <FormControl  mb={4} isInvalid={!video.year}>
                <Text fontSize="sm" fontWeight="700">
                  Video Year
                </Text>
                <Input
                  value={video.year}
                  onChange={(e) => updateNestedState("videos", index, "year", e.target.value)}
                  placeholder="Enter video year"
                  mt={2}
                  type="number"
                />

                {errors.videos && (
                  <FormErrorMessage>{errors.videos} (Year is required)</FormErrorMessage>
                )}
              </FormControl>
            </CardBody>
          </Card>
        ))}
        <Button 
          colorScheme="purple" 
          onClick={addVideo} 
          leftIcon={<FaPlus />} 
          mt={2}
        >
          Add Video
        </Button>
      </CardBody>
    </Card>
  );
};

export default VideosStep;