import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  FormControl,
  Text,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const FinancialStep = ({ formData, handleChange, errors }) => {
  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Financial Information</Text>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isInvalid={errors.programLevel}>
            <Text fontSize="sm" fontWeight="700">
              Program Level <span className="text-danger">*</span>
            </Text>
            <Select
              value={formData.programLevel}
              onChange={(e) => handleChange("programLevel", e.target.value)}
              placeholder="Select program level"
              mt={2}
            >
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
            </Select>
            {errors.programLevel && <Text color="red.500" fontSize="sm">{errors.programLevel}</Text>}
          </FormControl>
          <FormControl isInvalid={errors.programLength}>
            <Text fontSize="sm" fontWeight="700">
              Program Length <span className="text-danger">*</span>
            </Text>
            <Input
              value={formData.programLength}
              onChange={(e) => handleChange("programLength", e.target.value)}
              placeholder="e.g. 4 Years"
              mt={2}
            />
            {errors.programLength && <Text color="red.500" fontSize="sm">{errors.programLength}</Text>}
          </FormControl>
          <FormControl isInvalid={errors.tuition}>
            <Text fontSize="sm" fontWeight="700">
              Tuition Fees <span className="text-danger">*</span>
            </Text>
            <NumberInput
              min={0}
              value={formData.tuition}
              onChange={(value) => handleChange("tuition", value)}
              mt={2}
            >
              <NumberInputField placeholder="Enter tuition fees" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.tuition && <Text color="red.500" fontSize="sm">{errors.tuition}</Text>}
          </FormControl>
          <FormControl isInvalid={errors.costOfLiving}>
            <Text fontSize="sm" fontWeight="700">
              Cost of Living <span className="text-danger">*</span>
            </Text>
            <NumberInput
              min={0}
              value={formData.numMajors}
              onChange={(value) => handleChange("numMajors", value)}
              mt={2}
            >
              <NumberInputField placeholder="Enter number" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.costOfLiving && <Text color="red.500" fontSize="sm">{errors.costOfLiving}</Text>}
          </FormControl>
          <FormControl isInvalid={errors.applicationFee}>
            <Text fontSize="sm" fontWeight="700">
              Application Fee <span className="text-danger">*</span>
            </Text>
            <NumberInput min={0} value={formData.applicationFee} onChange={(value) => handleChange("applicationFee", value)} mt={2}>
              <NumberInputField placeholder="Enter application fee" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.applicationFee && <Text color="red.500" fontSize="sm">{errors.applicationFee}</Text>}
          </FormControl>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default FinancialStep;