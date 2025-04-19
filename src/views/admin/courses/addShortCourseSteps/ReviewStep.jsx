import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Box,
  Image,
  Badge,
  Stack,
  Avatar,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useGetProviderQuery } from "api/providerSlice";
import { useGetCategoriesQuery } from "api/categorySlice";

const ReviewStep = ({ formData }) => {
  const { data: provider } = useGetProviderQuery(formData.provider);
  const { data: categories } = useGetCategoriesQuery();
  const category = categories?.data?.data?.find(
    (category) => category.id == formData.category
  );

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold" fontSize="xl">
          Review Your Course
        </Text>
      </CardHeader>
      <CardBody>
        {/* Basic Information Section */}
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Basic Information
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              English Title:
            </Text>
            <Text>{formData.titleEn || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Arabic Title:
            </Text>
            <Text fontFamily="Tahoma" dir="rtl">
              {formData.titleAr || "Not provided"}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Provider:
            </Text>
            <Text>{provider?.data?.title_en || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Category:
            </Text>
            <Text>{category?.title_en || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Price:
            </Text>
            <Text>{formData.price || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Duration (weeks):
            </Text>
            <Text>{formData.duration || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Start Date:
            </Text>
            <Text>{formData.startDate || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              End Date:
            </Text>
            <Text>{formData.endDate || "Not provided"}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Featured:
            </Text>
            <Badge colorScheme={formData.featured ? "green" : "gray"}>
              {formData.featured ? "Yes" : "No"}
            </Badge>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Coming Soon:
            </Text>
            <Badge colorScheme={formData.soon ? "orange" : "gray"}>
              {formData.soon ? "Yes" : "No"}
            </Badge>
          </Box>
        </SimpleGrid>

        {/* Media Section */}
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Media
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={6}>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Course Image:
            </Text>
            {formData.courseImage ? (
              <Image
                src={formData.courseImage}
                alt="Course Preview"
                maxH="150px"
                mt={2}
                borderRadius="md"
                objectFit="cover"
              />
            ) : (
              <Text color="gray.500">Not provided</Text>
            )}
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Brochure:
            </Text>
            {formData.brochure ? (
              <Link
                href={formData.brochure}
                isExternal
                color="blue.500"
                mt={2}
                display="inline-block"
              >
                View Brochure (PDF)
              </Link>
            ) : (
              <Text color="gray.500">Not provided</Text>
            )}
          </Box>
        </SimpleGrid>

        {/* Benefits Section */}
        {formData.benefits.some((b) => b.title || b.image) && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Benefits of the Program
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={6}>
              {formData.benefits.map(
                (benefit, index) =>
                  (benefit.title || benefit.image) && (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                    >
                      <Text fontWeight="semibold" mb={2}>
                        Benefit {index + 1}
                      </Text>
                      {benefit.image && (
                        <Image
                          src={benefit.image}
                          alt={`Benefit ${index + 1}`}
                          maxH="120px"
                          mb={3}
                          borderRadius="md"
                          objectFit="cover"
                        />
                      )}
                      <Text>{benefit.title || "No description"}</Text>
                    </Box>
                  )
              )}
            </SimpleGrid>
          </>
        )}

        {/* Course Structure Section */}
        {formData.structures.some((s) => s.name || s.text || s.image) && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Course Structure
            </Text>
            <Stack spacing={4} mb={6}>
              {formData.structures.map(
                (structure, index) =>
                  (structure.name || structure.text || structure.image) && (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                    >
                      <Text fontWeight="bold" mb={2}>
                        {structure.name || `Module ${index + 1}`}
                      </Text>
                      {structure.image && (
                        <Image
                          src={structure.image}
                          alt={`Structure ${index + 1}`}
                          maxH="150px"
                          mb={3}
                          borderRadius="md"
                          objectFit="cover"
                        />
                      )}
                      <Text>{structure.text || "No description provided"}</Text>
                    </Box>
                  )
              )}
            </Stack>
          </>
        )}

        {/* Tutors Section */}
        {formData.tutors.some(
          (t) => t.name || t.image || t.description
        ) && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Course Tutors
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
              {formData.tutors.map(
                (tutor, index) =>
                  (tutor.name || tutor.image || tutor.description) && (
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
                              {tutor.rating || 0} ★
                            </Badge>
                            <Badge colorScheme="blue" mr={2}>
                              {tutor.courses || 0} Courses
                            </Badge>
                            <Badge colorScheme="green">
                              {tutor.students || 0} Students
                            </Badge>
                          </Flex>
                        </Box>
                      </Flex>
                      <Text>{tutor.description || "No description provided"}</Text>
                    </Box>
                  )
              )}
            </SimpleGrid>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ReviewStep;