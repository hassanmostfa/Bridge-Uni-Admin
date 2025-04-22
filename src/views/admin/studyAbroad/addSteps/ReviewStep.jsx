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
  Icon,
  Flex,
  Heading,
  Divider,
  Tag,
  TagLabel,
  Stack,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FaCheck, FaUniversity, FaGraduationCap, FaMoneyBillWave, FaFileAlt, FaGlobeAmericas } from "react-icons/fa";

const ReviewStep = ({ formData }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  const SectionHeader = ({ icon, title }) => (
    <Flex align="center" mb={4} mt={6}>
      <Icon as={icon} color={accentColor} mr={2} boxSize={5} />
      <Heading size="md">{title}</Heading>
    </Flex>
  );

  return (
    <Card bg={cardBg} border="1px solid" borderColor={borderColor} mb={6}>
      <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
        <Heading size="md">Review Program Information</Heading>
      </CardHeader>
      <CardBody>
        {/* Basic Information */}
        <SectionHeader icon={FaFileAlt} title="Basic Information" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
          <Box>
            <Text fontWeight="bold" color="gray.500">English Title</Text>
            <Text fontSize="lg">{formData.titleEn}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Arabic Title</Text>
            <Text fontSize="lg" fontFamily="Tahoma" dir="rtl">{formData.titleAr}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Featured</Text>
            <Tag colorScheme={formData.featured ? "green" : "gray"} size="lg">
              <TagLabel>{formData.featured ? "Featured" : "Not Featured"}</TagLabel>
            </Tag>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Main Image</Text>
            {formData.mainImage && (
              <Image
                src={formData.mainImage}
                alt="Main Program"
                maxH="120px"
                mt={2}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
              />
            )}
          </Box>
        </SimpleGrid>

        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Description</Text>
          <Text>{formData.description}</Text>
        </Box>

        <Divider my={6} />

        {/* All About Section */}
        <SectionHeader icon={FaUniversity} title="All About Section" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
          <Box>
            <Text fontWeight="bold" color="gray.500">Section Title</Text>
            <Text>{formData.allAboutTitle}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Number of Universities</Text>
            <Text>{formData.numUniversities}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Number of Majors</Text>
            <Text>{formData.numMajors}</Text>
          </Box>
        </SimpleGrid>

        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Top Universities</Text>
          <Wrap spacing={2} mt={2}>
            {formData.topUniversities.map((uni, index) => (
              <WrapItem key={index}>
                <Tag colorScheme="blue" size="md">
                  <TagLabel>{uni.name}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Popular Majors</Text>
          <Wrap spacing={2} mt={2}>
            {formData.popularMajors.map((major, index) => (
              <WrapItem key={index}>
                <Tag colorScheme="purple" size="md">
                  <TagLabel>{major}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        <Divider my={6} />

        {/* Proof Section */}
        <SectionHeader icon={FaFileAlt} title="Proof Section" />
        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Description</Text>
          <Text>{formData.proofDescription}</Text>
          
          <Text fontWeight="bold" color="gray.500" mt={4}>Requirements</Text>
          <List spacing={2} mt={2}>
            {formData.requirements.map((req, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <ListIcon as={FaCheck} color="green.500" />
                <Text>{req}</Text>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider my={6} />

        {/* Visa Information */}
        <SectionHeader icon={FaGlobeAmericas} title="Visa Information" />
        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Description</Text>
          <Text>{formData.visaDescription}</Text>
          
          <Text fontWeight="bold" color="gray.500" mt={4}>Visa Attributes</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={2}>
            {formData.visaAttributes.map((attr, index) => (
              <Box key={index} p={3} border="1px solid" borderColor={borderColor} borderRadius="md">
                <Text fontWeight="semibold">{attr.name}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Divider my={6} />

        {/* Financial Information */}
        <SectionHeader icon={FaMoneyBillWave} title="Financial Information" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
          <Stack spacing={3}>
            <Box>
              <Text fontWeight="bold" color="gray.500">Program Level</Text>
              <Text>{formData.programLevel}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.500">Program Length (months)</Text>
              <Text>{formData.programLength}</Text>
            </Box>
          </Stack>
          <Stack spacing={3}>
            <Box>
              <Text fontWeight="bold" color="gray.500">Tuition Fees</Text>
              <Text>${formData.tuition}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.500">Cost of Living</Text>
              <Text>${formData.costOfLiving}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.500">Application Fee</Text>
              <Text>${formData.applicationFee}</Text>
            </Box>
          </Stack>
        </SimpleGrid>

        <Divider my={6} />

        {/* Summary Section */}
        <SectionHeader icon={FaFileAlt} title="Summary" />
        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Summary Text</Text>
          <Text>{formData.summary}</Text>
        </Box>
        
        <Box>
          <Text fontWeight="bold" color="gray.500">Program Requirements</Text>
          <List spacing={2} mt={2}>
            {formData.programRequirements.map((req, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <ListIcon as={FaCheck} color="green.500" />
                <Text>{req}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </CardBody>
    </Card>
  );
};

export default ReviewStep;