import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUpload, FaTrash } from "react-icons/fa6";

const BenefitsStep = ({ formData, updateNestedState, errors }) => {
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Benefits of the Program</Text>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {formData.benefits.map((benefit, index) => (
            <Card key={index}>
              <CardHeader>
                <Text fontWeight="bold">Benefit {index + 1}</Text>
              </CardHeader>
              <CardBody>
                <FormControl mb={4} isInvalid={errors.benefits}>
                  <FormLabel>Image <span className="text-danger">*</span></FormLabel>
                  <Box
                    border="1px dashed"
                    borderColor={borderColor}
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    backgroundColor={"gray.100"}
                    cursor="pointer"
                    mt={2}
                    _hover={{ bg: "gray.100" }}
                  >
                    {benefit.image ? (
                      <>
                        <Image
                          src={URL.createObjectURL(benefit.image)}
                          alt={`Benefit ${index + 1}`}
                          maxH="80px"
                          maxW="120px"
                          mx="auto"
                          mb={3}
                          borderRadius="md"
                          objectFit="contain"
                        />
                        <Button
                          variant="outline"
                          colorScheme="red"
                          size="sm"
                          onClick={() => updateNestedState("benefits", index, "image", null)}
                          leftIcon={<FaTrash />}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
                        <Text color="gray.500" mb={2}>
                          Drag & Drop Image Here
                        </Text>
                        <Text color="gray.500" mb={2}>
                          or
                        </Text>
                        <Button
                          variant="outline"
                          color="#422afb"
                          border="none"
                          onClick={() => document.getElementById(`benefitImage-${index}`).click()}
                        >
                          Browse Files
                        </Button>
                        <Input
                          type="file"
                          id={`benefitImage-${index}`}
                          hidden
                          accept="image/*"
                          onChange={(e) => updateNestedState("benefits", index, "image", e.target.files[0])}
                        />
                      </>
                    )}
                  </Box>
                </FormControl>
                <FormControl isInvalid={errors.benefits}>
                  <FormLabel>Title <span className="text-danger">*</span></FormLabel>
                  <Input
                    value={benefit.title}
                    onChange={(e) => updateNestedState("benefits", index, "title", e.target.value)}
                    placeholder="Enter benefit title"
                    mt={2}
                  />
                </FormControl>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default BenefitsStep;