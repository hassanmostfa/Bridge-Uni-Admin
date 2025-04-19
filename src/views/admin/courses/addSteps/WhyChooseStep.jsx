import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormControl,
  Flex,
  Input,
  Button,
  SimpleGrid,
  Text,
  Box,
  Icon,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { FaPlus, FaMinus, FaUpload, FaTrash } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";
import { useDeleteFileMutation } from "api/filesSlice";

const WhyChooseStep = ({ formData, handleChange, updateNestedState ,errors }) => {
  const [addFile] = useAddFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const addWhyChooseTitle = () => {
    handleChange("whyChooseTitles", [...formData.whyChooseTitles, ""]);
  };

  const removeWhyChooseTitle = (index) => {
    if (formData.whyChooseTitles.length > 1) {
      const updated = [...formData.whyChooseTitles];
      updated.splice(index, 1);
      handleChange("whyChooseTitles", updated);
    }
  };

  const updateWhyChooseTitle = (index, value) => {
    const updated = [...formData.whyChooseTitles];
    updated[index] = value;
    handleChange("whyChooseTitles", updated);
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;
    
    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append('img', file);
      const response = await addFile(formData).unwrap();
      
      if (response.url) {
        updateNestedState("benefits", index, "image", response.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file, index);
    }
  };

  const handleFileInputChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file, index);
    }
    // Reset the input value to allow re-uploading the same file
    e.target.value = null;
  };

  const handleRemoveImage = async (index,file) => {
    updateNestedState("benefits", index, "image", null);
    await deleteFile(file);
  };

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Why Choose This Course</Text>
      </CardHeader>
      <CardBody>
        <FormControl mb={4} isInvalid={!!errors.whyChooseTitles}>
          <Text fontSize="sm" fontWeight="700">
            Titles
          </Text>
          {formData.whyChooseTitles.map((title, index) => (
            <Flex key={index} mb={2} mt={2}>
              <Input
                value={title}
                onChange={(e) => updateWhyChooseTitle(index, e.target.value)}
                placeholder="Enter title"
                isInvalid={errors.whyChooseTitles && errors.whyChooseTitles[index]}
              />
              <Button
                ml={2}
                colorScheme="red"
                onClick={() => removeWhyChooseTitle(index)}
              >
                <FaMinus />
              </Button>
            </Flex>
          ))}
          {errors.whyChooseTitles && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.whyChooseTitles}
            </Text>
          )}
          <Button 
            colorScheme="purple" 
            onClick={addWhyChooseTitle} 
            leftIcon={<FaPlus />} 
            mt={2}
          >
            Add Title
          </Button>
        </FormControl>

        <FormControl isInvalid={!!errors.benefits}>
          <Text fontSize="sm" fontWeight="700">
            Benefits
          </Text>
          <SimpleGrid columns={2} spacing={4} mt={2}>
            {formData.benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <Text fontWeight="bold">Benefit {index + 1}</Text>
                </CardHeader>
                <CardBody>
                  <Box mb={2}>
                    <Text fontSize="sm" fontWeight="700">
                      Image
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
                      {uploadingIndex === index ? (
                        <Flex direction="column" align="center" justify="center" minH="120px">
                          <Spinner size="lg" mb={4} />
                          <Text>Uploading...</Text>
                        </Flex>
                      ) : benefit.image ? (
                        <Box position="relative">
                          <Image
                            src={benefit.image}
                            alt={`Benefit ${index + 1}`}
                            width="100%"
                            maxH="200px"
                            objectFit="contain"
                            borderRadius="md"
                          />
                          <Flex justify="center" mt={2} gap={2}>
                            <Button
                              variant="outline"
                              colorScheme="blue"
                              size="sm"
                              onClick={() => document.getElementById(`benefitImage-${index}`).click()}
                            >
                              Change Image
                            </Button>
                            <Button
                              variant="solid"
                              colorScheme="red"
                              size="sm"
                              onClick={() => handleRemoveImage(index,benefit.image)}
                              leftIcon={<FaTrash />}
                            >
                              Remove
                            </Button>
                          </Flex>
                          <Input
                            type="file"
                            id={`benefitImage-${index}`}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileInputChange(e, index)}
                          />
                        </Box>
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
                            onClick={() => document.getElementById(`benefitImage-${index}`).click()}
                          >
                            Browse Files
                          </Button>
                          <Input
                            type="file"
                            id={`benefitImage-${index}`}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileInputChange(e, index)}
                          />
                        </>
                      )}
                    </Box>
                  </Box>
                  <Text fontSize="sm" fontWeight="700">
                    Title
                  </Text>
                  <Input
                    value={benefit.title}
                    onChange={(e) => updateNestedState("benefits", index, "title", e.target.value)}
                    placeholder="Enter benefit title"
                    mt={2}
                    isInvalid={errors.benefits && errors.benefits[index]}
                  />
                </CardBody>
              </Card>
            ))}
            {errors.benefits && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.benefits} (All fields are required)
              </Text>
            )}
          </SimpleGrid>
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default WhyChooseStep;