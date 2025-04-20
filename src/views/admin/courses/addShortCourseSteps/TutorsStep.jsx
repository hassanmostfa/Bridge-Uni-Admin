import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Icon,
  Flex,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaPlus } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";
import { useDeleteFileMutation } from "api/filesSlice";
import { from } from "stylis";

const TutorsStep = ({ formData, updateNestedState,handleChange, errors }) => {
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [addFile] = useAddFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  
  const addTutor = () => {
    updateNestedState("tutors", formData.tutors.length, {
      name: "", 
      image: null, 
      rating: 0, 
      courses: 0, 
      students: 0, 
      description: ""
    });
  };

  const removeTutor = (index) => {
    if (formData.tutors.length > 1) {
      // Create a new array without the tutor at the specified index
      const updatedTutors = formData.tutors.filter((_, i) => i !== index);
      
      // Update the state with the new array
      handleChange("tutors", updatedTutors);
      console.log(formData);
    }
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;
    
    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append('img', file);
      
      // Replace this with your actual API call to upload the image
      const response = await addFile(formData).unwrap();
      // Mock response for demonstration
      // const mockResponse = { url: URL.createObjectURL(file) };
      
      if (response.url) {
        updateNestedState("tutors", index, "image", response.url);
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

  const handleRemoveImage = async (index, imageUrl) => {
    try {
      // If you need to delete the file from the server, uncomment this
      // await deleteFile(imageUrl);
      updateNestedState("tutors", index, "image", null);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold">Course Tutors</Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="purple"
            size="sm"
            onClick={addTutor}
          >
            Add Tutor
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        {formData.tutors.map((tutor, index) => (
          <Card key={index} mb={4}>
            <CardHeader>
              <Flex justify="space-between">
                <Text fontWeight="bold">Tutor {index + 1}</Text>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeTutor(index)}
                  leftIcon={<FaTrash />}
                >
                  Remove
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl mb={4} isInvalid={errors.tutors}>
                  <FormLabel>Tutor Name <span className="text-danger">*</span></FormLabel>
                  <Input
                    value={tutor.name}
                    onChange={(e) => updateNestedState("tutors", index, "name", e.target.value)}
                    placeholder="Enter tutor name"
                  />
                </FormControl>
            
                <FormControl mb={4} isInvalid={errors.tutors}>
                  <FormLabel>Rating (1-5) <span className="text-danger">*</span></FormLabel>
                  <NumberInput 
                    min={1} 
                    max={5} 
                    step={0.1} 
                    precision={1}
                    value={tutor.rating}
                    onChange={(value) => updateNestedState("tutors", index, "rating", value)}
                  >
                    <NumberInputField placeholder="Enter rating" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl mb={4} isInvalid={errors.tutors}>
                  <FormLabel>Number of Courses <span className="text-danger">*</span></FormLabel>
                  <NumberInput 
                    min={0}
                    value={tutor.courses}
                    onChange={(value) => updateNestedState("tutors", index, "courses", value)}
                  >
                    <NumberInputField placeholder="Enter number" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl mb={4} isInvalid={errors.tutors}>
                  <FormLabel>Total Students <span className="text-danger">*</span></FormLabel>
                  <NumberInput 
                    min={0}
                    value={tutor.students}
                    onChange={(value) => updateNestedState("tutors", index, "students", value)}
                  >
                    <NumberInputField placeholder="Enter number" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              <FormControl isInvalid={errors.tutors}>
                <FormLabel>Description <span className="text-danger">*</span></FormLabel>
                <Textarea
                  value={tutor.description}
                  onChange={(e) => updateNestedState("tutors", index, "description", e.target.value)}
                  placeholder="Enter tutor description"
                  rows={3}
                />
              </FormControl>
              <FormControl mt={4} isInvalid={errors.tutors}>
                <FormLabel>Tutor Image <span className="text-danger">*</span></FormLabel>
                <Box
                  border="1px dashed"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  backgroundColor={"gray.100"}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {uploadingIndex === index ? (
                    <Spinner size="xl" />
                  ) : tutor.image ? (
                    <>
                      <Image
                        src={tutor.image}
                        alt={`Tutor ${index + 1}`}
                        maxH="80px"
                        maxW="80px"
                        mx="auto"
                        mb={3}
                        borderRadius="full"
                        objectFit="cover"
                      />
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleRemoveImage(index, tutor.image)}
                        leftIcon={<FaTrash />}
                      >
                        Remove
                      </Button>
                    </>
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
                        onClick={() => document.getElementById(`tutorImage-${index}`).click()}
                      >
                        Browse Files
                      </Button>
                      <Input
                        type="file"
                        id={`tutorImage-${index}`}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, index)}
                      />
                    </>
                  )}
                </Box>
                {errors.tutors && (
                  <FormErrorMessage>{errors.tutors} (All fields are required)</FormErrorMessage>
                )}
              </FormControl>
            </CardBody>
          </Card>
        ))}
      </CardBody>
    </Card>
  );
};

export default TutorsStep;