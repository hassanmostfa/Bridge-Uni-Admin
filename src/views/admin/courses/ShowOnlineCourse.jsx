import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Box,
  Image,
  Flex,
  Badge,
  Divider,
  Link,
  Button,
  useColorModeValue,
  Tag,
  TagLabel,
  VStack,
  HStack,
  Stack,
  Heading,
  AspectRatio,
  Spinner
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "api/onlineCourseSlice";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { StarIcon, TimeIcon } from "@chakra-ui/icons";

const ShowOnlineCourse = () => {
  const { id } = useParams();
  const { data,refetch } = useGetCourseQuery(id);
    useEffect(() => {
      refetch();
    },[]);
  const course = data?.data;
  
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  if (!course) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" mt={12} p={4}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="flex-start" spacing={1}>
          <Heading as="h1" size="xl">
            {course.title_en}
          </Heading>
          <Text fontSize="lg" color="gray.500" fontFamily="Tahoma" dir="rtl">
            {course.title_ar}
          </Text>
        </VStack>
        
        <Flex>
          {course.coming_soon && (
            <Badge colorScheme="red" fontSize="md" px={3} py={2} mr={2}>
              <TimeIcon /> {" "}
              Coming Soon
            </Badge>
          )}
          {course.featured_course && (
            <Badge colorScheme="blue" fontSize="md" px={3} py={2} mr={2}>
                <StarIcon /> {" "}
              Featured
            </Badge>
          )}
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Main Content Column */}
        <Box gridColumn={{ lg: "1 / span 2" }}>
          {/* Course Images */}
          <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={2}>Course Image</Text>
                  <Image
                    src={course.image}
                    alt="Course thumbnail"
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                    // fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Course Banner</Text>
                  <Image
                    src={course.banner}
                    alt="Course banner"
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                    // fallbackSrc="https://via.placeholder.com/300x200?text=No+Banner"
                  />
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Basic Information */}
          <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
            <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
              <Heading size="md">Course Details</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Provider</Text>
                  <Text>{course.provider?.title_en || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Category</Text>
                  <Text>{course.category?.title_en || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Location</Text>
                  <Text>{course.location || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Mode of Study</Text>
                  <Text>{course.mode_of_study || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Qualification</Text>
                  <Text>{course.qualification || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Study Duration</Text>
                  <Text>{course.study_duration || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Start Date</Text>
                  <Text>{new Date(course.start_date).toLocaleDateString() || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Awarding Body</Text>
                  <Text>{course.awarding_body || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Delivered By</Text>
                  <Text>{course.delivered_by || "Not specified"}</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Why Choose This Course */}
          {course.why_courses?.length > 0 && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Why Choose This Course</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {course.why_courses.map((item, index) => (
                    <Box key={index} p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="semibold">Reason {index + 1}</Text>
                      <Text mt={1}>{item.title}</Text>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}

          {/* Benefits */}
          {course.benefits?.length > 0 && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Key Benefits</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {course.benefits.map((benefit, index) => (
                    <Box 
                      key={index} 
                      border="1px solid" 
                      borderColor={borderColor}
                      borderRadius="md"
                      p={3}
                    >
                      {benefit.image && (
                        <Image
                          src={benefit.image}
                          alt={`Benefit ${index + 1}`}
                          mb={2}
                          borderRadius="md"
                          maxH="120px"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/300x150?text=No+Image"
                        />
                      )}
                      <Text fontWeight="semibold">{benefit.title}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}

          {/* Course Structure */}
          {course.course_structures?.length > 0 && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Course Structure</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {course.course_structures.map((structure, index) => (
                    <Box 
                      key={index} 
                      border="1px solid" 
                      borderColor={borderColor}
                      borderRadius="md"
                      p={4}
                    >
                      <Heading size="sm" mb={2}>{structure.name}</Heading>
                      {structure.image && (
                        <Image
                          src={structure.image}
                          alt={`Structure ${index + 1}`}
                          mb={3}
                          borderRadius="md"
                          maxH="150px"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/300x150?text=No+Image"
                        />
                      )}
                      <Text>{structure.text}</Text>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}

          {/* Videos */}
          {course.course_videos?.length > 0 && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Course Videos</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {course.course_videos.map((video, index) => (
                    <Box 
                      key={index} 
                      border="1px solid" 
                      borderColor={borderColor}
                      borderRadius="md"
                      p={4}
                    >
                      <Heading size="sm" mb={2}>Video {index + 1}</Heading>
                      <Text mb={2}>Year: {new Date(video.year).getFullYear()}</Text>
                      {/* {video.video && (
                        <AspectRatio ratio={16/9} mb={3}>
                          <iframe
                            src={video.video}
                            title={`Course Video ${index + 1}`}
                            allowFullScreen
                          />
                        </AspectRatio>
                      )} */}
                      <Button
                        as="a"
                        href={video.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="blue"
                        size="sm"
                        rightIcon={<FiExternalLink />}
                      >
                        Watch Video
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}
        </Box>

        {/* Sidebar Column */}
        <Box>
          {/* Study Guide */}
          <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
            <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
              <Heading size="md">Study Guide</Heading>
            </CardHeader>
            <CardBody>
              {course.study_guide ? (
                <Button
                  as="a"
                  href={course.study_guide}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="teal"
                  w="full"
                  leftIcon={<FiDownload />}
                >
                  Download Study Guide
                </Button>
              ) : (
                <Text color="gray.500">No study guide available</Text>
              )}
            </CardBody>
          </Card>

          {/* Quick Facts */}
          <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
            <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
              <Heading size="md">At a Glance</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Start Date</Text>
                  <Text>{new Date(course.start_date).toLocaleDateString() || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Duration</Text>
                  <Text>{course.study_duration || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Delivery</Text>
                  <Text>{course.mode_of_study || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Qualification</Text>
                  <Text>{course.qualification || "Not specified"}</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          {/* Provider Info */}
          {course.provider && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Provider</Heading>
              </CardHeader>
              <CardBody>
                <Text fontWeight="bold" mb={2}>{course.provider.title_en}</Text>
                {/* Add more provider info if available */}
              </CardBody>
            </Card>
          )}

          {/* Action Buttons
          <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stack spacing={3}>
                <Button colorScheme="blue" size="lg" w="full">
                  Enroll Now
                </Button>
                <Button variant="outline" size="lg" w="full">
                  Contact Advisor
                </Button>
              </Stack>
            </CardBody>
          </Card> */}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ShowOnlineCourse;