import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  FormControl,
  Input,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Flex,
  Image,
  Box,
  Icon,
  Badge,
} from "@chakra-ui/react";
import Select from "react-select";
import { FaTrash, FaPlus, FaUpload } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";
import { useGetAllMajorsQuery } from "api/popularMajors";

const AllAboutStep = ({ formData, handleChange, updateNestedState, errors }) => {

  const {data:majorsResponce} = useGetAllMajorsQuery();

  const majorsData = majorsResponce?.data?.data ?? [];
  const availableMajors = ["Engineering", "Medicine", "Business", "Computer Science", "Architecture"];
  const [addFile] = useAddFileMutation();
  
  const addUniversity = () => {
    handleChange("topUniversities", [...formData.topUniversities, { image: null, name: "" }]);
  };

  const removeUniversity = (index) => {
    if (formData.topUniversities.length > 1) {
      const updated = [...formData.topUniversities];
      updated.splice(index, 1);
      handleChange("topUniversities", updated);
    }
  };

  // Convert your majors array to the format react-select expects
  const majorOptions = majorsData?.map(major => ({
    value: major.id,
    label: major.title
  }));

  
  
  // Convert your current values to the same format
  const selectedValues = formData.popularMajors.map(majorId => {
    // Find the major in majorsData that matches this ID
    const foundMajor = majorsData?.find(major => major.id === majorId);
    
    return {
      value: majorId, // Keep the ID as value
      label: foundMajor?.title || majorId // Use the title if found, otherwise fallback to ID
    };
  });
  
  const handleUploadAttribute = async (file,index) => {
    const fileFormData = new FormData();
    fileFormData.append('img', file);
    // Upload file to API and get URL
    const fileUrl = await addFile(fileFormData).unwrap();
    updateNestedState("topUniversities", index, "image", fileUrl?.url)
  }
  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">All About This Program</Text>
      </CardHeader>
      <CardBody>
        <FormControl mb={4} isInvalid={errors.allAboutTitle}>
          <Text fontSize="sm" fontWeight="700">
            Section Title <span className="text-danger">*</span>
          </Text>
          <Input
            value={formData.allAboutTitle}
            onChange={(e) => handleChange("allAboutTitle", e.target.value)}
            placeholder="Enter section title"
            mt={2}
          />
          {errors.allAboutTitle && <Text color="red.500" fontSize="sm">{errors.allAboutTitle}</Text>}
        </FormControl>
        <SimpleGrid columns={2} spacing={4} mb={4}>
          <FormControl isInvalid={errors.numUniversities}>
            <Text fontSize="sm" fontWeight="700">
              Number of Universities <span className="text-danger">*</span>
            </Text>
            <NumberInput
              min={0}
              value={formData.numUniversities}
              onChange={(value) => handleChange("numUniversities", value)}
              mt={2}
            >
              <NumberInputField placeholder="Enter number" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.numUniversities && <Text color="red.500" fontSize="sm">{errors.numUniversities}</Text>}
          </FormControl>
          <FormControl isInvalid={errors.numMajors}>
            <Text fontSize="sm" fontWeight="700">
              Number of Majors <span className="text-danger">*</span>
            </Text>
            <NumberInput
              min={0}
              value={formData.numMajors}
              onChange={(value) => handleChange("numMajors", value)}
              mt={2}
            >
              <NumberInputField placeholder="Enter number" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.numMajors && <Text color="red.500" fontSize="sm">{errors.numMajors}</Text>}
          </FormControl>
        </SimpleGrid>
        
        <Text fontSize="sm" fontWeight="700" mb={2}>
          Top Universities <span className="text-danger">*</span>
        </Text>
        {formData.topUniversities.map((university, index) => (
          <Card key={index} mb={4}>
            <CardHeader>
              <Flex justify="space-between">
                <Text fontWeight="bold">University {index + 1}</Text>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeUniversity(index)}
                  leftIcon={<FaTrash />}
                >
                  Remove
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormControl mb={4} isInvalid={errors.topUniversities && errors.topUniversities[index]?.name}>
                <Text fontSize="sm" fontWeight="700">
                  University Name <span className="text-danger">*</span>
                </Text>
                <Input
                  value={university.name}
                  onChange={(e) => updateNestedState("topUniversities", index, "name", e.target.value)}
                  placeholder="Enter university name"
                  mt={2}
                />
                {errors.topUniversities && errors.topUniversities[index]?.name && (
                  <Text color="red.500" fontSize="sm">{errors.topUniversities[index].name}</Text>
                )}
              </FormControl>
              <FormControl isInvalid={errors.topUniversities && errors.topUniversities[index]?.image}>
                <Text fontSize="sm" fontWeight="700">
                  University Image <span className="text-danger">*</span>
                </Text>
                <Box
                  border="1px dashed"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  backgroundColor="gray.100"
                  cursor="pointer"
                  mt={2}
                  _hover={{ bg: "gray.100" }}
                >
                  {university.image ? (
                    <>
                      <Image
                        src={university.image}
                        alt={`University ${index + 1}`}
                        maxH="100px"
                        maxW="150px"
                        mx="auto"
                        mb={3}
                        borderRadius="md"
                        objectFit="contain"
                      />
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={() => updateNestedState("topUniversities", index, "image", null)}
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
                        onClick={() => document.getElementById(`universityImage-${index}`).click()}
                      >
                        Browse Files
                      </Button>
                      <Input
                        type="file"
                        id={`universityImage-${index}`}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleUploadAttribute(e.target.files[0],index)}
                      />
                    </>
                  )}
                </Box>
                {errors.topUniversities && (
                  <Text color="red.500" fontSize="sm">{errors.topUniversities}</Text>
                )}
              </FormControl>
            </CardBody>
          </Card>
        ))}
        <Button onClick={addUniversity} leftIcon={<FaPlus />} colorScheme="purple" mb={4}>
          Add University
        </Button>

        <FormControl isInvalid={errors.popularMajors}>
          <Text fontSize="sm" fontWeight="700">
            Popular Majors <span className="text-danger">*</span>
          </Text>
          <Select
            isMulti
            name="popularMajors"
            options={majorOptions}
            value={selectedValues}
            onChange={(selectedOptions) => {
              handleChange(
                "popularMajors", 
                selectedOptions.map(option => option.value)
              );
            }}
            placeholder="Select popular majors"
            className="basic-multi-select"
            classNamePrefix="select"
          />
          {errors.popularMajors && <Text color="red.500" fontSize="sm">{errors.popularMajors}</Text>}
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default AllAboutStep;