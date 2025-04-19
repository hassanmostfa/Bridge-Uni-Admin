import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";

const OverviewStep = ({ formData, handleChange,errors }) => (
  <Card mb={4}>
    <CardHeader bg="gray.100" p={3}>
      <Text fontWeight="bold">Course Overview</Text>
    </CardHeader>
    <CardBody>
      <SimpleGrid columns={2} spacing={4}>
        <FormControl isInvalid={!!errors.location}>
          <Text fontSize="sm" fontWeight="700">
            Location <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter location"
            mt={2}
          />
          {errors.location && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.location}
            </Text>
          )}

        </FormControl>
        <FormControl isInvalid={!!errors.modeOfStudy}>
          <Text fontSize="sm" fontWeight="700">
            Mode of Study <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.modeOfStudy}
            onChange={(e) => handleChange("modeOfStudy", e.target.value)}
            placeholder="Enter mode of study"
            mt={2}
          />
          {errors.modeOfStudy && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.modeOfStudy}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.qualification}>
          <Text fontSize="sm" fontWeight="700">
            Qualification <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
            placeholder="Enter qualification"
            mt={2}
          />
          {errors.qualification && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.qualification}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.studyDuration}>
          <Text fontSize="sm" fontWeight="700">
            Study Duration <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.studyDuration}
            onChange={(e) => handleChange("studyDuration", e.target.value)}
            placeholder="Enter study duration"
            mt={2}
          />
          {errors.studyDuration && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.studyDuration}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.startDate}>
          <Text fontSize="sm" fontWeight="700">
            Start Date <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            placeholder="Enter start date"
            mt={2}
            type="date"
          />
          {errors.startDate && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.startDate}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.awardingBody}>
          <Text fontSize="sm" fontWeight="700">
            Awarding Body <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.awardingBody}
            onChange={(e) => handleChange("awardingBody", e.target.value)}
            placeholder="Enter awarding body"
            mt={2}
          />
          {errors.awardingBody && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.awardingBody}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.deliveredBy}>
          <Text fontSize="sm" fontWeight="700">
            Delivered By <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.deliveredBy}
            onChange={(e) => handleChange("deliveredBy", e.target.value)}
            placeholder="Enter delivered by"
            mt={2}
          />
          {errors.deliveredBy && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.deliveredBy}
            </Text>
          )}
        </FormControl>
      </SimpleGrid>
    </CardBody>
  </Card>
);

export default OverviewStep;