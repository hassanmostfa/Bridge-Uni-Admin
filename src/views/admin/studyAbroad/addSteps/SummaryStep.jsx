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

const SummaryStep = ({ formData, handleChange, updateNestedState, errors }) => {
  const addProgramRequirement = () => {
    handleChange("programRequirements", [...formData.programRequirements, ""]);
  };

  const removeProgramRequirement = (index) => {
    if (formData.programRequirements.length > 1) {
      const updated = [...formData.programRequirements];
      updated.splice(index, 1);
      handleChange("programRequirements", updated);
    }
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const updated = [...formData.requirements];
      updated.splice(index, 1);
      handleChange("programRequirements", updated);
    }
  };

  // Modified update function specifically for requirements
  const updateRequirement = (index, value) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    handleChange("programRequirements", updated);
  };

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Summary</Text>
      </CardHeader>
      <CardBody>
        <FormControl mb={4} isInvalid={errors.summary}>
          <Text fontSize="sm" fontWeight="700">
            Summary Text <span className="text-danger">*</span>
          </Text>
          <Textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Enter program summary"
            rows={4}
            mt={2}
          />
          {errors.summary && <Text color="red.500" fontSize="sm">{errors.summary}</Text>}
        </FormControl>
        <FormControl isInvalid={errors.programRequirements}>
          <Text fontSize="sm" fontWeight="700">
            Program Requirements <span className="text-danger">*</span>
          </Text>
          {formData.programRequirements.map((requirement, index) => (
            <Flex key={index} mb={2} mt={2}>
              <Input
                value={requirement}
                onChange={(e) => updateRequirement(index,e.target.value)}
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
          {errors.programRequirements && <Text color="red.500" fontSize="sm">{errors.programRequirements}</Text>}
          <Button onClick={addProgramRequirement} leftIcon={<FaPlus />} colorScheme="purple">
            Add Requirement
          </Button>
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default SummaryStep;