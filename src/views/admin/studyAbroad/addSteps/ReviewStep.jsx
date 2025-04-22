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
  Icon,
  List,
  ListItem,
  ListIcon,
  Flex,
  Heading,
  Divider,
  Tag,
  TagLabel,
  Stack,
  useColorModeValue,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaUniversity,
  FaGraduationCap,
  FaMoneyBillWave,
  FaFileAlt,
  FaGlobeAmericas,
  FaImages,
  FaInfoCircle,
} from "react-icons/fa";

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

  const renderImagePreview = (image, alt) => {
    if (!image) return <Text color="gray.500">No image uploaded</Text>;
    
    if (typeof image === 'string') {
      return (
        <Image
          src={image}
          alt={alt}
          maxH="120px"
          mt={2}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
        />
      );
    }
    
    return (
      <Text color="gray.500">Image ready for upload</Text>
    );
  };

  return (
    <Card bg={cardBg} border="1px solid" borderColor={borderColor} mb={6}>
      <CardHeader bg={highlightBg} borderBottom="1px solid" borderColor={borderColor}>
        <Heading size="md">Review Program Information</Heading>
      </CardHeader>
      <CardBody>
        {/* Basic Information */}
        <SectionHeader icon={FaInfoCircle} title="Basic Information" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
          <Box>
            <Text fontWeight="bold" color="gray.500">English Title</Text>
            <Text fontSize="lg">{formData.titleEn || <Text color="gray.500">Not provided</Text>}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Arabic Title</Text>
            <Text fontSize="lg" fontFamily="Tahoma" dir="rtl">
              {formData.titleAr || <Text color="gray.500">Not provided</Text>}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Featured</Text>
            <Tag colorScheme={formData.featured ? "green" : "gray"} size="lg">
              <TagLabel>{formData.featured ? "Yes" : "No"}</TagLabel>
            </Tag>
          </Box>
          <Box>
            <Text fontWeight="bold" color="gray.500">Inner Title</Text>
            <Text>{formData.innerTitle || <Text color="gray.500">Not provided</Text>}</Text>
          </Box>
        </SimpleGrid>

        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Main Image</Text>
          {renderImagePreview(formData.mainImage, "Main Program Image")}
        </Box>

        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Description</Text>
          <Text>{formData.description || <Text color="gray.500">Not provided</Text>}</Text>
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Gallery Images</Text>
          {formData.galleryImages.length > 0 ? (
            <Wrap spacing={4} mt={2}>
              {formData.galleryImages.map((img, index) => (
                <WrapItem key={index}>
                  {renderImagePreview(img, `Gallery Image ${index + 1}`)}
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <Text color="gray.500">No gallery images uploaded</Text>
          )}
        </Box>

        <Divider my={6} />

        {/* All About Section */}
        <SectionHeader icon={FaUniversity} title="All About Section" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
          <Box>
            <Text fontWeight="bold" color="gray.500">Section Title</Text>
            <Text>{formData.allAboutTitle || <Text color="gray.500">Not provided</Text>}</Text>
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
          {formData.topUniversities.length > 0 ? (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mt={2}>
              {formData.topUniversities.map((uni, index) => (
                <GridItem key={index} p={3} border="1px solid" borderColor={borderColor} borderRadius="md">
                  <Text fontWeight="semibold">{uni.name || <Text color="gray.500">No name</Text>}</Text>
                  <Box mt={2}>
                    <Text fontWeight="bold" color="gray.500" fontSize="sm">University Image:</Text>
                    {renderImagePreview(uni.image, `University ${index + 1}`)}
                  </Box>
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Text color="gray.500">No universities added</Text>
          )}
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Popular Majors</Text>
          {formData.popularMajors.length > 0 ? (
            <Wrap spacing={2} mt={2}>
              {formData.popularMajors.map((major, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="purple" size="md">
                    <TagLabel>{major}</TagLabel>
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <Text color="gray.500">No popular majors added</Text>
          )}
        </Box>

        <Divider my={6} />

        {/* Proof Section */}
        <SectionHeader icon={FaFileAlt} title="Proof Section" />
        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Description</Text>
          <Text>{formData.proofDescription || <Text color="gray.500">Not provided</Text>}</Text>
        </Box>

        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Proof Images</Text>
          {formData.proofImages.length > 0 ? (
            <Wrap spacing={4} mt={2}>
              {formData.proofImages.map((img, index) => (
                <WrapItem key={index}>
                  {renderImagePreview(img, `Proof Image ${index + 1}`)}
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <Text color="gray.500">No proof images uploaded</Text>
          )}
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Requirements</Text>
          {formData.requirements.length > 0 ? (
            <List spacing={2} mt={2}>
              {formData.requirements.map((req, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={FaCheck} color="green.500" />
                  <Text>{req || <Text color="gray.500">Empty requirement</Text>}</Text>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text color="gray.500">No requirements added</Text>
          )}
        </Box>

        <Divider my={6} />

        {/* Visa Information */}
        <SectionHeader icon={FaGlobeAmericas} title="Visa Information" />
        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Description</Text>
          <Text>{formData.visaDescription || <Text color="gray.500">Not provided</Text>}</Text>
        </Box>

        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Visa Image</Text>
          {renderImagePreview(formData.visaImage, "Visa Image")}
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold" color="gray.500">Visa Attributes</Text>
          {formData.visaAttributes.length > 0 ? (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mt={2}>
              {formData.visaAttributes.map((attr, index) => (
                <GridItem key={index} p={3} border="1px solid" borderColor={borderColor} borderRadius="md">
                  <Text fontWeight="semibold">{attr.name || <Text color="gray.500">No name</Text>}</Text>
                  <Box mt={2}>
                    <Text fontWeight="bold" color="gray.500" fontSize="sm">Attribute Image:</Text>
                    {renderImagePreview(attr.image, `Visa Attribute ${index + 1}`)}
                  </Box>
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Text color="gray.500">No visa attributes added</Text>
          )}
        </Box>

        <Divider my={6} />

        {/* Financial Information */}
        <SectionHeader icon={FaMoneyBillWave} title="Financial Information" />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
          <Stack spacing={3}>
            <Box>
              <Text fontWeight="bold" color="gray.500">Program Level</Text>
              <Text>{formData.programLevel || <Text color="gray.500">Not provided</Text>}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.500">Program Length</Text>
              <Text>{formData.programLength || <Text color="gray.500">Not provided</Text>}</Text>
            </Box>
          </Stack>
          <Stack spacing={3}>
            <Box>
              <Text fontWeight="bold" color="gray.500">Tuition Fees</Text>
              <Text>{formData.tuition ? `$${formData.tuition}` : <Text color="gray.500">Not provided</Text>}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.500">Cost of Living</Text>
              <Text>{formData.costOfLiving ? `$${formData.costOfLiving}` : <Text color="gray.500">Not provided</Text>}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.500">Application Fee</Text>
              <Text>{formData.applicationFee ? `$${formData.applicationFee}` : <Text color="gray.500">Not provided</Text>}</Text>
            </Box>
          </Stack>
        </SimpleGrid>

        <Divider my={6} />

        {/* Summary Section */}
        <SectionHeader icon={FaFileAlt} title="Summary Section" />
        <Box mb={4}>
          <Text fontWeight="bold" color="gray.500">Summary Text</Text>
          <Text>{formData.summary || <Text color="gray.500">Not provided</Text>}</Text>
        </Box>
        
        <Box>
          <Text fontWeight="bold" color="gray.500">Program Requirements</Text>
          {formData.programRequirements.length > 0 ? (
            <List spacing={2} mt={2}>
              {formData.programRequirements.map((req, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={FaCheck} color="green.500" />
                  <Text>{req || <Text color="gray.500">Empty requirement</Text>}</Text>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text color="gray.500">No program requirements added</Text>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default ReviewStep;