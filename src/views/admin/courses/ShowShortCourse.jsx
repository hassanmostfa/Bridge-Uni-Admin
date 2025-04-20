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
  Avatar
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { FiDownload, FiExternalLink } from "react-icons/fi";
import { StarIcon, TimeIcon } from "@chakra-ui/icons";
import { useGetShortCourseQuery } from "api/shortCourcesSlice";

const ShowShortCourse = () => {
  const { id } = useParams();
  const { data, refetch } = useGetShortCourseQuery(id);
  
  useEffect(() => {
    refetch();
  }, []);

  const course = data?.data;
  
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  if (!course) {
    return (
      <Box p={4}>
        <Text>Loading course details...</Text>
      </Box>
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
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={2}>Course Image</Text>
                  <Image
                    src={course.image}
                    alt="Course thumbnail"
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Brochure</Text>
                  {course.brochure ? (
                    <Button
                      as="a"
                      href={course.brochure}
                      target="_blank"
                      leftIcon={<FiDownload />}
                      colorScheme="blue"
                      w="full"
                    >
                      Download Brochure
                    </Button>
                  ) : (
                    <Text color="gray.500">No brochure available</Text>
                  )}
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
                  <Text fontWeight="bold" color="gray.600">Price (KWD)</Text>
                  <Text>{course.price?.toFixed(3) || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Duration (Weeks)</Text>
                  <Text>{course.duration || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Start Date</Text>
                  <Text>{new Date(course.start_date).toLocaleDateString() || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">End Date</Text>
                  <Text>{new Date(course.end_date).toLocaleDateString() || "Not specified"}</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Benefits */}
          {course.benefits?.length > 0 && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Key Benefits</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
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
                      <Text fontWeight="semibold">{benefit.title || `Benefit ${index + 1}`}</Text>
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
                      <Heading size="sm" mb={2}>
                        {structure.name || `Module ${index + 1}`}
                      </Heading>
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
                      <Text>{structure.text || "No description provided"}</Text>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}

          {/* Tutors Section */}
          {course.course_tutors?.length > 0 && (
            <Card bg={cardBg} mb={6} border="1px solid" borderColor={borderColor}>
              <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Course Tutors</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {course.course_tutors.map((tutor, index) => (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                    >
                      <Flex align="center" mb={3}>
                        {tutor.image ? (
                          <Avatar
                            src={tutor.image}
                            name={tutor.name}
                            size="lg"
                            mr={3}
                          />
                        ) : (
                          <Avatar name={tutor.name} size="lg" mr={3} />
                        )}
                        <Box>
                          <Text fontWeight="bold">{tutor.name || "Unnamed Tutor"}</Text>
                          <Flex mt={1}>
                            <Badge colorScheme="yellow" mr={2}>
                              {tutor.rate || 0} ★
                            </Badge>
                            <Badge colorScheme="blue" mr={2}>
                              {tutor.number_of_courses || 0} Courses
                            </Badge>
                            <Badge colorScheme="green">
                              {tutor.total_students || 0} Students
                            </Badge>
                          </Flex>
                        </Box>
                      </Flex>
                      <Text>{tutor.Description || "No description provided"}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}
        </Box>

        {/* Sidebar Column */}
        <Box>
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
                  <Text fontWeight="bold" color="gray.600">End Date</Text>
                  <Text>{new Date(course.end_date).toLocaleDateString() || "Not specified"}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Duration</Text>
                  <Text>{course.duration} Weeks</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Price</Text>
                  <Text>{course.price?.toFixed(3)} KWD</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.600">Provider</Text>
                  <Text>{course.provider?.title_en || "Not specified"}</Text>
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

          {/* Brochure Download */}
          <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
            <CardHeader bg="gray.50" borderBottom="1px solid" borderColor={borderColor}>
              <Heading size="md">Course Brochure</Heading>
            </CardHeader>
            <CardBody>
              {course.brochure ? (
                <Button
                  as="a"
                  href={course.brochure}
                  target="_blank"
                  colorScheme="blue"
                  w="full"
                  leftIcon={<FiDownload />}
                >
                  Download Brochure
                </Button>
              ) : (
                <Text color="gray.500">No brochure available</Text>
              )}
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ShowShortCourse;