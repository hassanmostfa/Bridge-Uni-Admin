import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Box,
  SimpleGrid,
  Badge,
  Image,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const ReviewStep = ({ formData }) => {
  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Review Program Information</Text>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={2} spacing={4} mb={6}>
          <Box>
            <Text fontWeight="bold">English Title:</Text>
            <Text>{formData.titleEn}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Arabic Title:</Text>
            <Text>{formData.titleAr}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Featured:</Text>
            <Badge colorScheme={formData.featured ? "green" : "gray"}>
              {formData.featured ? "Yes" : "No"}
            </Badge>
          </Box>
          <Box>
            <Text fontWeight="bold">Main Image:</Text>
            {formData.mainImage && (
              <Image
                src={formData.mainImage}
                alt="Main Program"
                maxH="100px"
                mt={2}
              />
            )}
          </Box>
        </SimpleGrid>

        <Box mb={6}>
          <Text fontWeight="bold">Description:</Text>
          <Text>{formData.description}</Text>
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold">All About Section:</Text>
          <Text>Title: {formData.allAboutTitle}</Text>
          <Text>Number of Universities: {formData.numUniversities}</Text>
          <Text>Number of Majors: {formData.numMajors}</Text>
          
          <Text mt={2} fontWeight="bold">Top Universities:</Text>
          <List spacing={2}>
            {formData.topUniversities.map((uni, index) => (
              <ListItem key={index}>
                <ListIcon as={FaCheck} color="green.500" />
                {uni.name}
              </ListItem>
            ))}
          </List>
          
          <Text mt={2} fontWeight="bold">Popular Majors:</Text>
          <List spacing={2}>
            {formData.popularMajors.map((major, index) => (
              <ListItem key={index}>
                <ListIcon as={FaCheck} color="green.500" />
                {major}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold">Proof Section:</Text>
          <Text>{formData.proofDescription}</Text>
          
          <Text mt={2} fontWeight="bold">Requirements:</Text>
          <List spacing={2}>
            {formData.requirements.map((req, index) => (
              <ListItem key={index}>
                <ListIcon as={FaCheck} color="green.500" />
                {req}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold">Visa Information:</Text>
          <Text>{formData.visaDescription}</Text>
          
          <Text mt={2} fontWeight="bold">Visa Attributes:</Text>
          <List spacing={2}>
            {formData.visaAttributes.map((attr, index) => (
              <ListItem key={index}>
                <ListIcon as={FaCheck} color="green.500" />
                {attr.name}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold">Financial Information:</Text>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text>Program Level: {formData.programLevel}</Text>
              <Text>Program Length: {formData.programLength}</Text>
            </Box>
            <Box>
              <Text>Tuition: ${formData.tuition}</Text>
              <Text>Cost of Living: ${formData.costOfLiving}</Text>
              <Text>Application Fee: ${formData.applicationFee}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box>
          <Text fontWeight="bold">Summary:</Text>
          <Text>{formData.summary}</Text>
          
          <Text mt={2} fontWeight="bold">Program Requirements:</Text>
          <List spacing={2}>
            {formData.programRequirements.map((req, index) => (
              <ListItem key={index}>
                <ListIcon as={FaCheck} color="green.500" />
                {req}
              </ListItem>
            ))}
          </List>
        </Box>
      </CardBody>
    </Card>
  );
};

export default ReviewStep;