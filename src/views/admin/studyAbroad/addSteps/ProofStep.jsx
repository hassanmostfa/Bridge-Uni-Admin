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
} from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import FileUploadField from "./FileUploadField";
import MultiFileUpload from "./MultiFileUpload";

const ProofStep = ({ formData, handleChange, updateNestedState, errors }) => {
  const addRequirement = () => {
    handleChange("requirements", [...formData.requirements, ""]);
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const updated = [...formData.requirements];
      updated.splice(index, 1);
      handleChange("requirements", updated);
    }
  };

  // Modified update function specifically for requirements
  const updateRequirement = (index, value) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    handleChange("requirements", updated);
  };

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Proof Section</Text>
      </CardHeader>
      <CardBody>
        <FormControl mb={4} isInvalid={errors.proofDescription}>
          <Text fontSize="sm" fontWeight="700">
            Description <span className="text-danger">*</span>
          </Text>
          <Textarea
            value={formData.proofDescription}
            onChange={(e) => handleChange("proofDescription", e.target.value)}
            placeholder="Enter proof description"
            rows={4}
            mt={2}
          />
          {errors.proofDescription && (
            <Text color="red.500" fontSize="sm">{errors.proofDescription}</Text>
          )}
        </FormControl>
        <MultiFileUpload
          label="Proof Images"
          value={formData.proofImages}
          setValue={(files) => handleChange("proofImages", files)}
          accept="image/*"
          isRequired
          error={errors.proofImages}
        />
        <FormControl mt={4} isInvalid={errors.requirements}>
          <Text fontSize="sm" fontWeight="700">
            Requirements <span className="text-danger">*</span>
          </Text>
          {formData.requirements.map((requirement, index) => (
            <Flex key={index} mb={2} mt={2}>
              <Input
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder="Enter requirement"
              />
              <Button
                ml={2}
                colorScheme="red"
                onClick={() => removeRequirement(index)}
              >
                <FaMinus />
              </Button>
            </Flex>
          ))}
          {errors.requirements && (
            <Text color="red.500" fontSize="sm">{errors.requirements}</Text>
          )}
          <Button onClick={addRequirement} leftIcon={<FaPlus />} colorScheme="purple">
            Add Requirement
          </Button>
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default ProofStep;