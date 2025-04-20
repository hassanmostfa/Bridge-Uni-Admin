import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Box,
  Image,
  Button,
} from "@chakra-ui/react";
import { useGetProviderQuery } from "api/providerSlice";
import { useGetCategoriesQuery } from "api/categorySlice";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa6";

const ReviewStep = ({ formData }) => {
  const {data:provider} = useGetProviderQuery(formData.provider);
  const {data:categories} = useGetCategoriesQuery();
  const category = categories?.data?.data?.find((category) => category.id == formData.category);
  
  
  return (
  <Card mb={4}>
    <CardHeader bg="gray.100" p={3}>
      <Text fontWeight="bold">Review Your Course</Text>
    </CardHeader>
    <CardBody>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Basic Information</Text>
      <SimpleGrid columns={2} spacing={4} mb={6}>
        <Box>
          <Text fontWeight="bold">English Title:</Text>
          <Text>{formData.titleEn || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Arabic Title:</Text>
          <Text>{formData.titleAr || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Provider:</Text>
          <Text>{provider?.data?.title_en || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Category:</Text>
          <Text>{category?.title_en || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Featured:</Text>
          <Text>{formData.featured ? "Yes" : "No"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Coming Soon:</Text>
          <Text>{formData.soon ? "Yes" : "No"}</Text>
        </Box>
      </SimpleGrid>

      <Text fontSize="lg" fontWeight="bold" mb={4}>Media</Text>
      <SimpleGrid columns={3} spacing={4} mb={6}>
        <Box>
          <Text fontWeight="bold">Course Image:</Text>
          {formData.courseImage ? (
            <Image 
              src={formData.courseImage} 
              alt="Course Preview" 
              maxH="100px" 
              mt={2}
            />
          ) : (
            <Text>Not provided</Text>
          )}
        </Box>
        <Box>
          <Text fontWeight="bold">Course Banner:</Text>
          {formData.courseBanner ? (
            <Image 
              src={formData.courseBanner} 
              alt="Banner Preview" 
              maxH="100px" 
              mt={2}
            />
          ) : (
            <Text>Not provided</Text>
          )}
        </Box>
        <Box>
          <Text fontWeight="bold">Study Guide:</Text>
          {formData.studyGuide ? (
            <Link href={formData.studyGuide} isExternal>
              <Button variant="link" rightIcon={<FaEye />}>
                Preview
              </Button>
            </Link>
          ) : (
            <Text>Not provided</Text>
          )}
        </Box>
      </SimpleGrid>

      <Text fontSize="lg" fontWeight="bold" mb={4}>Course Overview</Text>
      <SimpleGrid columns={2} spacing={4} mb={6}>
        <Box>
          <Text fontWeight="bold">Location:</Text>
          <Text>{formData.location || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Mode of Study:</Text>
          <Text>{formData.modeOfStudy || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Qualification:</Text>
          <Text>{formData.qualification || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Study Duration:</Text>
          <Text>{formData.studyDuration || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Start Date:</Text>
          <Text>{formData.startDate || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Awarding Body:</Text>
          <Text>{formData.awardingBody || "Not provided"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Delivered By:</Text>
          <Text>{formData.deliveredBy || "Not provided"}</Text>
        </Box>
      </SimpleGrid>

      <Text fontSize="lg" fontWeight="bold" mb={4}>Why Choose This Course</Text>
      <Box mb={6}>
        <Text fontWeight="bold" mb={2}>Titles:</Text>
        {formData.whyChooseTitles.map((title, index) => (
          <Text key={index} ml={4}>- {title || `Title ${index + 1} (empty)`}</Text>
        ))}
        
        <Text fontWeight="bold" mt={4} mb={2}>Benefits:</Text>
        <SimpleGrid columns={2} spacing={4}>
          {formData.benefits.map((benefit, index) => (
            <Box key={index} borderWidth="1px" borderRadius="md" p={3}>
              <Text fontWeight="semibold">Benefit {index + 1}</Text>
              {benefit.image && (
                <Image 
                  src={benefit.image} 
                  alt={`Benefit ${index + 1}`} 
                  maxH="80px" 
                  mt={2}
                />
              )}
              <Text mt={2}>{benefit.title}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Text fontSize="lg" fontWeight="bold" mb={4}>Course Structure</Text>
      {formData.structures.map((structure, index) => (
        <Box key={index} borderWidth="1px" borderRadius="md" p={4} mb={4}>
          <Text fontWeight="bold">Structure {index + 1}: {structure.name}</Text>
          {structure.image && (
            <Image 
              src={structure.image} 
              alt={`Structure ${index + 1}`} 
              maxH="100px" 
              mt={2}
            />
          )}
          <Text mt={2}>{structure.text || "No description provided"}</Text>
        </Box>
      ))}

      <Text fontSize="lg" fontWeight="bold" mb={4}>Course Videos</Text>
      {formData.videos.map((video, index) => (
        <Box key={index} borderWidth="1px" borderRadius="md" p={3} mb={3}>
          <Text fontWeight="bold">Video {index + 1}</Text>
          <Text>URL: {video.url ? (<a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">View Video</a>) : "Not provided"}</Text>
          <Text>Year: {video.year || "Not provided"}</Text>
        </Box>
      ))}
    </CardBody>
  </Card>
);
}

export default ReviewStep;