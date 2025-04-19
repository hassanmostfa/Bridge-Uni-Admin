import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormControl,
  Text,
  Input,
  Textarea,
  Button,
  Box,
  Icon,
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";
import { useDeleteFileMutation } from "api/filesSlice";

const StructureStep = ({ formData, handleChange, updateNestedState, errors }) => {
  const [addFile] = useAddFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [uploadingIndices, setUploadingIndices] = useState([]);

  const addStructure = () => {
    handleChange("structures", [...formData.structures, { name: "", image: null, text: "" }]);
  };

  const removeStructure = (index) => {
    if (formData.structures.length > 1) {
      const updated = [...formData.structures];
      updated.splice(index, 1);
      handleChange("structures", updated);
    }
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;
    
    try {
      setUploadingIndices(prev => [...prev, index]);
      const formData = new FormData();
      formData.append('img', file);
      const response = await addFile(formData).unwrap();
      
      if (response.url) {
        updateNestedState("structures", index, "image", response.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingIndices(prev => prev.filter(i => i !== index));
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
    updateNestedState("structures", index, "image", null);
    await deleteFile(file);
  };

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Course Structure</Text>
      </CardHeader>
      <CardBody>
        {formData.structures.map((structure, index) => (
          <Card key={index} mb={4}>
            <CardHeader>
              <Flex justify="space-between">
                <Text fontWeight="bold">Structure {index + 1}</Text>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeStructure(index)}
                  leftIcon={<FaTrash />}
                >
                  Remove
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormControl mb={4} isInvalid={!structure.name}>
                <Text fontSize="sm" fontWeight="700">
                  Structure Name
                </Text>
                <Input
                  value={structure.name}
                  onChange={(e) => updateNestedState("structures", index, "name", e.target.value)}
                  placeholder="Enter structure name"
                  mt={2}
                />
                {errors.structures && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.structures} (Name is required)
                  </Text>
                )}
              </FormControl>

              <FormControl mb={4}>
                <Text fontSize="sm" fontWeight="700">
                  Image (Optional)
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
                      <Text>Uploading...</Text>
                    </Flex>
                  ) : structure.image ? (
                    <Box position="relative">
                      <Image
                        src={typeof structure.image === 'string' ? structure.image : URL.createObjectURL(structure.image)}
                        alt={`Structure ${index + 1}`}
                        maxH="200px"
                        maxW="100%"
                        mx="auto"
                        objectFit="contain"
                        borderRadius="md"
                      />
                      <Flex justify="center" mt={2} gap={2}>
                        <Button
                          as="label"
                          htmlFor={`structureImage-${index}`}
                          variant="outline"
                          colorScheme="blue"
                          size="sm"
                        >
                          Change Image
                        </Button>
                        <Button
                          variant="solid"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemoveImage(index,structure.image)}
                          leftIcon={<FaTrash />}
                        >
                          Remove
                        </Button>
                      </Flex>
                      <Input
                        type="file"
                        id={`structureImage-${index}`}
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
                        onClick={() => document.getElementById(`structureImage-${index}`).click()}
                      >
                        Browse Files
                      </Button>
                      <Input
                        type="file"
                        id={`structureImage-${index}`}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, index)}
                      />
                    </>
                  )}
                </Box>
              </FormControl>

              <FormControl isInvalid={!structure.text}>
                <Text fontSize="sm" fontWeight="700">
                  Text *
                </Text>
                <Textarea
                  value={structure.text}
                  onChange={(e) => updateNestedState("structures", index, "text", e.target.value)}
                  placeholder="Enter structure details"
                  rows={4}
                  mt={2}
                />
                {errors.structures && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.structures} (Text is required)
                  </Text>
                )}
              </FormControl>
            </CardBody>
          </Card>
        ))}
        <Button 
          onClick={addStructure} 
          leftIcon={<FaPlus />} 
          mt={2}
          colorScheme="purple"
        >
          Add New Structure
        </Button>
      </CardBody>
    </Card>
  );
};

export default StructureStep;