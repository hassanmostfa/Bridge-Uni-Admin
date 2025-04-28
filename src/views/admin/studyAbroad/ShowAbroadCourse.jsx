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
  Button,
  useColorModeValue,
  Tag,
  TagLabel,
  VStack,
  HStack,
  Stack,
  Heading,
  AspectRatio,
  Spinner,
  Icon,
  List,
  ListItem,
  ListIcon,
  Wrap,
  WrapItem,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { FiDownload, FiExternalLink } from "react-icons/fi";
import { StarIcon, TimeIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaUniversity, FaGraduationCap, FaMoneyBillWave, FaGlobeAmericas } from "react-icons/fa";
import { useGetAbroadCourseQuery } from "api/studyAbroadSlice";

const ShowAbroadCourse = () => {
  const { id } = useParams();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useGetAbroadCourseQuery(id);
  const course = data?.data;

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading program",
        description: "Failed to fetch study abroad program details",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError, toast]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!course) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>No program data found</Text>
      </Flex>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" mt={8} style={{ marginTop:"60px" }} p={4}>
      {/* Hero Section */}
      <Card bg={cardBg} mb={6} overflow="hidden" border="1px solid" borderColor={borderColor}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box flex={1} p={6}>
            <Flex justify="space-between" align="flex-start" mb={4}>
              <VStack align="flex-start" spacing={1}>
                <Heading as="h1" size="xl" color={accentColor}>
                  {course.title_en}
                </Heading>
                <Text fontSize="lg" color="gray.500" fontFamily="Tahoma" dir="rtl">
                  {course.title_ar}
                </Text>
              </VStack>
              <Flex>
                {course.coming_soon && (
                  <Badge colorScheme="red" fontSize="md" px={3} py={1} mr={2}>
                    <TimeIcon mr={1} /> Coming Soon
                  </Badge>
                )}
                {course.featured_course && (
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    <StarIcon mr={1} /> Featured
                  </Badge>
                )}
              </Flex>
            </Flex>

            <Text fontSize="lg" mb={6}>{course.description}</Text>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={6} mt={4}>
              <Flex align="center">
                <Icon as={FaUniversity} color={accentColor} mr={2} boxSize={5} />
                <Box>
                  <Text fontSize="sm" color="gray.500">Universities</Text>
                  <Text fontWeight="bold">{course.number_of_universities}</Text>
                </Box>
              </Flex>
              <Flex align="center">
                <Icon as={FaGraduationCap} color={accentColor} mr={2} boxSize={5} />
                <Box>
                  <Text fontSize="sm" color="gray.500">Majors</Text>
                  <Text fontWeight="bold">{course.number_of_majors}</Text>
                </Box>
              </Flex>
              <Flex align="center">
                <Icon as={FaMoneyBillWave} color={accentColor} mr={2} boxSize={5} />
                <Box>
                  <Text fontSize="sm" color="gray.500">Tuition Fees</Text>
                  <Text fontWeight="bold">${course.tuition_fees}</Text>
                </Box>
              </Flex>
              <Flex align="center">
                <Icon as={FaMoneyBillWave} color={accentColor} mr={2} boxSize={5} />
                <Box>
                  <Text fontSize="sm" color="gray.500">Fees</Text>
                  <Text fontWeight="bold">${course.fees}</Text>
                </Box>
              </Flex>
              <Flex align="center">
                <Icon as={FaGlobeAmericas} color={accentColor} mr={2} boxSize={5} />
                <Box>
                  <Text fontSize="sm" color="gray.500">Program Level</Text>
                  <Text fontWeight="bold">{course.program_level}</Text>
                </Box>
              </Flex>
            </SimpleGrid>
          </Box>

          <Box flex={1} maxH="400px" overflow="hidden">
            <Image
              src={course.main_image}
              alt={course.title_en}
              w="100%"
              h="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/600x400?text=No+Image"
            />
          </Box>
        </Flex>
      </Card>

      <Tabs variant="enclosed" colorScheme="blue" mb={6}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Universities</Tab>
          <Tab>Visa Information</Tab>
          <Tab>Proof Requirements</Tab>
          <Tab>Gallery</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Tab */}
          <TabPanel p={0} pt={4}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* Program Details */}
              <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                  <Heading size="md">Program Details</Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={3}>
                    <ListItem>
                      <Flex>
                        <Text fontWeight="bold" minW="180px">Program Length:</Text>
                        <Text>{course.program_length} months</Text>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Text fontWeight="bold" minW="180px">Tuition Fees:</Text>
                        <Text>${course.tuition_fees}</Text>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Text fontWeight="bold" minW="180px">Cost of Living:</Text>
                        <Text>${course.cost_of_living}</Text>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Text fontWeight="bold" minW="180px">Application Fee:</Text>
                        <Text>${course.application_fee}</Text>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Text fontWeight="bold" minW="180px">Section Title:</Text>
                        <Text>{course.section_title}</Text>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Text fontWeight="bold" minW="180px">Inner Title:</Text>
                        <Text>{course.inner_title}</Text>
                      </Flex>
                    </ListItem>
                  </List>
                </CardBody>
              </Card>

              {/* Program Requirements */}
              <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                  <Heading size="md">Program Requirements</Heading>
                </CardHeader>
                <CardBody>
                  {course.program_requirements?.length > 0 ? (
                    <List spacing={3}>
                      {course.program_requirements.map((req, index) => (
                        <ListItem key={index} display="flex" alignItems="center">
                          <ListIcon as={ChevronRightIcon} color={accentColor} />
                          <Text>{req.name}</Text>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text color="gray.500">No requirements specified</Text>
                  )}
                </CardBody>
              </Card>

              {/* Summary */}
              <Card bg={cardBg} border="1px solid" borderColor={borderColor} gridColumn={{ lg: "1 / -1" }}>
                <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                  <Heading size="md">Summary</Heading>
                </CardHeader>
                <CardBody>
                  <Text>{course.summary_text}</Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </TabPanel>

          {/* Universities Tab */}
          <TabPanel p={0} pt={4}>
            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                <Heading size="md">Partner Universities</Heading>
              </CardHeader>
              <CardBody>
                {course.universities?.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {course.universities.map((uni, index) => (
                      <Card key={index} border="1px solid" borderColor={borderColor}>
                        <Image
                          src={uni.image}
                          alt={uni.name}
                          h="120px"
                          objectFit="cover"
                          borderTopRadius="md"
                          fallbackSrc="https://via.placeholder.com/300x120?text=University"
                        />
                        <Box p={4}>
                          <Heading size="md" mb={2}>{uni.name}</Heading>
                        </Box>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text color="gray.500">No universities listed</Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          {/* Visa Information Tab */}
          <TabPanel p={0} pt={4}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                  <Heading size="md">Visa Description</Heading>
                </CardHeader>
                <CardBody>
                  <Text>{course.visa_description}</Text>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                  <Heading size="md">Visa Image</Heading>
                </CardHeader>
                <CardBody>
                  <Image
                    src={course.visa_image}
                    alt="Visa information"
                    maxH="300px"
                    objectFit="contain"
                    fallbackSrc="https://via.placeholder.com/300x200?text=No+Visa+Image"
                  />
                </CardBody>
              </Card>

              {course.visa_attributes?.length > 0 && (
                <Card bg={cardBg} border="1px solid" borderColor={borderColor} gridColumn={{ lg: "1 / -1" }}>
                  <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                    <Heading size="md">Visa Attributes</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {course.visa_attributes.map((attr, index) => (
                        <Flex key={index} align="center" p={4} border="1px solid" borderColor={borderColor} borderRadius="md">
                          {attr.image && (
                            <Image
                              src={attr.image}
                              alt={attr.name}
                              boxSize="60px"
                              objectFit="cover"
                              mr={4}
                              fallbackSrc="https://via.placeholder.com/60x60?text=No+Image"
                            />
                          )}
                          <Text fontWeight="bold">{attr.name}</Text>
                        </Flex>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              )}
            </SimpleGrid>
          </TabPanel>

          {/* Proof Requirements Tab */}
          <TabPanel p={0} pt={4}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                  <Heading size="md">Proof Description</Heading>
                </CardHeader>
                <CardBody>
                  <Text>{course.proof_description}</Text>
                </CardBody>
              </Card>

              {course.proof_images?.length > 0 && (
                <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                  <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                    <Heading size="md">Proof Images</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                      {course.proof_images.map((img, index) => (
                        <Image
                          key={index}
                          src={img.url}
                          alt={`Proof ${index + 1}`}
                          borderRadius="md"
                          maxH="150px"
                          objectFit="contain"
                          fallbackSrc="https://via.placeholder.com/300x150?text=No+Image"
                        />
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              )}

              {course.proof_requirements?.length > 0 && (
                <Card bg={cardBg} border="1px solid" borderColor={borderColor} gridColumn={{ lg: "1 / -1" }}>
                  <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
                    <Heading size="md">Proof Requirements</Heading>
                  </CardHeader>
                  <CardBody>
                    <List spacing={3}>
                      {course.proof_requirements.map((req, index) => (
                        <ListItem key={index} display="flex" alignItems="center">
                          <ListIcon as={ChevronRightIcon} color={accentColor} />
                          <Text>{req.name}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </CardBody>
                </Card>
              )}
            </SimpleGrid>
          </TabPanel>

          {/* Gallery Tab */}
          <TabPanel p={0} pt={4}>
            {course.gallery_images?.length > 0 ? (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
                {course.gallery_images.map((img, index) => (
                  <Box key={index} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                    <Image
                      src={img.url}
                      alt={`Gallery ${index + 1}`}
                      w="100%"
                      h="200px"
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Text color="gray.500">No gallery images available</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ShowAbroadCourse;