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

const OverviewStep = ({ formData, handleChange }) => (
  <Card mb={4}>
    <CardHeader bg="gray.100" p={3}>
      <Text fontWeight="bold">Course Overview</Text>
    </CardHeader>
    <CardBody>
      <SimpleGrid columns={2} spacing={4}>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Location
          </Text>
          <Input
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter location"
            mt={2}
          />
        </FormControl>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Mode of Study
          </Text>
          <Input
            value={formData.modeOfStudy}
            onChange={(e) => handleChange("modeOfStudy", e.target.value)}
            placeholder="Enter mode of study"
            mt={2}
          />
        </FormControl>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Qualification
          </Text>
          <Input
            value={formData.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
            placeholder="Enter qualification"
            mt={2}
          />
        </FormControl>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Study Duration
          </Text>
          <Input
            value={formData.studyDuration}
            onChange={(e) => handleChange("studyDuration", e.target.value)}
            placeholder="Enter study duration"
            mt={2}
          />
        </FormControl>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Start Date
          </Text>
          <Input
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            placeholder="Enter start date"
            mt={2}
            type="date"
          />
        </FormControl>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Awarding Body
          </Text>
          <Input
            value={formData.awardingBody}
            onChange={(e) => handleChange("awardingBody", e.target.value)}
            placeholder="Enter awarding body"
            mt={2}
          />
        </FormControl>
        <FormControl>
          <Text fontSize="sm" fontWeight="700">
            Delivered By
          </Text>
          <Input
            value={formData.deliveredBy}
            onChange={(e) => handleChange("deliveredBy", e.target.value)}
            placeholder="Enter delivered by"
            mt={2}
          />
        </FormControl>
      </SimpleGrid>
    </CardBody>
  </Card>
);

export default OverviewStep;