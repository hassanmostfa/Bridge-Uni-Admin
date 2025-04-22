import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormControl,
  Text,
  Textarea,
  Button,
  Flex,
  Input,
  Image,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaUpload } from "react-icons/fa6";
import FileUploadField from "./FileUploadField";
import { useAddFileMutation } from "api/filesSlice";

const VisaStep = ({ formData, handleChange, updateNestedState, errors }) => {
  const [addFile] = useAddFileMutation();
  const addVisaAttribute = () => {
    handleChange("visaAttributes", [...formData.visaAttributes, { name: "", image: null }]);
  };

  const removeVisaAttribute = (index) => {
    if (formData.visaAttributes.length > 1) {
      const updated = [...formData.visaAttributes];
      updated.splice(index, 1);
      handleChange("visaAttributes", updated);
    }
  };
  const handleUploadAttribute =async (file,index) => {
    const fileFormData = new FormData();
    fileFormData.append('img', file);
    // Upload file to API and get URL
    const fileUrl = await addFile(fileFormData).unwrap();
    updateNestedState("visaAttributes", index, "image", fileUrl?.url)
  }

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Visa Information</Text>
      </CardHeader>
      <CardBody>
        <FormControl mb={4} isInvalid={errors.visaDescription}>
          <Text fontSize="sm" fontWeight="700">
            Description <span className="text-danger">*</span>
          </Text>
          <Textarea
            value={formData.visaDescription}
            onChange={(e) => handleChange("visaDescription", e.target.value)}
            placeholder="Enter visa description"
            rows={4}
            mt={2}
          />
          {errors.visaDescription && <Text color="red.500" fontSize="sm">{errors.visaDescription}</Text>}
        </FormControl>
        <FileUploadField
          label="Visa Image"
          value={formData.visaImage}
          setValue={(file) => handleChange("visaImage", file)}
          accept="image/*"
          isRequired
          error={errors.visaImage}
        />
        <Text fontSize="sm" fontWeight="700" mt={4} mb={2}>
          Visa Attributes <span className="text-danger">*</span>
        </Text>
        {formData.visaAttributes.map((attribute, index) => (
          <Card key={index} mb={4}>
            <CardHeader>
              <Flex justify="space-between">
                <Text fontWeight="bold">Attribute {index + 1}</Text>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeVisaAttribute(index)}
                  leftIcon={<FaTrash />}
                >
                  Remove
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormControl mb={4} isInvalid={errors.visaAttributes && errors.visaAttributes[index]?.name}>
                <Text fontSize="sm" fontWeight="700">
                  Attribute Name <span className="text-danger">*</span>
                </Text>
                <Input
                  value={attribute.name}
                  onChange={(e) => updateNestedState("visaAttributes", index, "name", e.target.value)}
                  placeholder="Enter attribute name"
                  mt={2}
                />
                {errors.visaAttributes && errors.visaAttributes[index]?.name && (
                  <Text color="red.500" fontSize="sm">{errors.visaAttributes[index].name}</Text>
                )}
              </FormControl>
              <FormControl isInvalid={errors.visaAttributes && errors.visaAttributes[index]?.image}>
                <Text fontSize="sm" fontWeight="700">
                  Attribute Image <span className="text-danger">*</span>
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
                  _hover={{ bg: "gray.100" }}
                >
                  {attribute.image ? (
                    <>
                      <Image
                        src={attribute.image}
                        alt={`Attribute ${index + 1}`}
                        maxH="80px"
                        maxW="80px"
                        mx="auto"
                        mb={3}
                        borderRadius="md"
                        objectFit="contain"
                      />
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={() => updateNestedState("visaAttributes", index, "image", null)}
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
                        onClick={() => document.getElementById(`attributeImage-${index}`).click()}
                      >
                        Browse Files
                      </Button>
                      <Input
                        type="file"
                        id={`attributeImage-${index}`}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleUploadAttribute(e.target.files[0], index)}
                      />
                    </>
                  )}
                </Box>
                {errors.visaAttributes && errors.visaAttributes[index]?.image && (
                  <Text color="red.500" fontSize="sm">{errors.visaAttributes[index].image}</Text>
                )}
              </FormControl>
            </CardBody>
          </Card>
        ))}
        <Button onClick={addVisaAttribute} leftIcon={<FaPlus />} colorScheme="purple">
          Add Visa Attribute
        </Button>
      </CardBody>
    </Card>
  );
};

export default VisaStep;