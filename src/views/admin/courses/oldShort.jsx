import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  Select,
  Textarea,
  Switch,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  FormControl,
  FormLabel,
  Badge,
  Image,
  Grid,
  GridItem,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaPlus, FaMinus } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddShortCourse = () => {
  // Course Basic Information
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [featured, setFeatured] = useState(false);
  
  // Course Media
  const [courseImage, setCourseImage] = useState(null);
  const [brochure, setBrochure] = useState(null);
  
  // Benefits of the Program
  const [benefits, setBenefits] = useState(
    Array(6).fill().map((_, i) => ({ image: null, title: "" }))
  );
  
  // Course Structure
  const [structures, setStructures] = useState([
    { name: "", image: null, text: "" }
  ]);
  
  // Course Tutors
  const [tutors, setTutors] = useState([
    { 
      name: "", 
      image: null, 
      rating: 0, 
      courses: 0, 
      students: 0, 
      description: "" 
    }
  ]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();
  const toast = useToast();

  // Mock data for dropdowns
  const providers = ["Coursera", "Udemy", "EdX", "Skillshare", "LinkedIn Learning"];
  const categories = ["Technology", "Business", "Design", "Health", "Education"];

  // Handle file uploads
  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  // Benefits Management
  const updateBenefit = (index, field, value) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits(updated);
  };

  // Course Structure Management
  const addStructure = () => {
    setStructures([...structures, { name: "", image: null, text: "" }]);
  };

  const removeStructure = (index) => {
    if (structures.length > 1) {
      const updated = [...structures];
      updated.splice(index, 1);
      setStructures(updated);
    }
  };

  const updateStructure = (index, field, value) => {
    const updated = [...structures];
    updated[index] = { ...updated[index], [field]: value };
    setStructures(updated);
  };

  // Tutors Management
  const addTutor = () => {
    setTutors([...tutors, { 
      name: "", 
      image: null, 
      rating: 0, 
      courses: 0, 
      students: 0, 
      description: "" 
    }]);
  };

  const removeTutor = (index) => {
    if (tutors.length > 1) {
      const updated = [...tutors];
      updated.splice(index, 1);
      setTutors(updated);
    }
  };

  const updateTutor = (index, field, value) => {
    const updated = [...tutors];
    updated[index] = { ...updated[index], [field]: value };
    setTutors(updated);
  };

  // Form Submission
  const handleSubmit = () => {
    const courseData = {
      titleEn,
      titleAr,
      provider,
      category,
      price,
      duration,
      startDate,
      endDate,
      brochure,
      benefits,
      structures,
      tutors,
      featured,
      image: courseImage
    };

    console.log("Course Data:", courseData);
    toast({
      title: "Course Created",
      description: "The course has been successfully created",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate("/admin/courses");
  };

  // File Upload Component
  const FileUploadField = ({ label, file, setFile, accept, isRequired = false }) => (
    <FormControl>
      <Text color={textColor} fontSize="sm" fontWeight="700" mb="2">
        {label} {isRequired && <span className="text-danger">*</span>}
      </Text>
      <Box
        border="1px dashed"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        textAlign="center"
        backgroundColor={useColorModeValue("gray.50", "gray.700")}
        cursor="pointer"
        _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
      >
        {file ? (
          <>
            {accept.includes("image") ? (
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                maxH="100px"
                maxW="150px"
                mx="auto"
                mb={3}
                borderRadius="md"
                objectFit="contain"
              />
            ) : (
              <Text>{file.name}</Text>
            )}
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              onClick={() => setFile(null)}
              leftIcon={<FaTrash />}
            >
              Remove
            </Button>
          </>
        ) : (
          <>
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Files Here
            </Text>
            <Text color="gray.500" mb={2}>
              or
            </Text>
            <Button
              variant="outline"
              color="#422afb"
              border="none"
              onClick={() => document.getElementById(label).click()}
            >
              Browse Files
            </Button>
            <Input
              type="file"
              id={label}
              hidden
              accept={accept}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </>
        )}
      </Box>
    </FormControl>
  );

  return (
    <div className="container add-admin-container w-100">
      <div className="add-admin-card shadow p-4 bg-white w-100">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            mb="20px !important"
            lineHeight="100%"
          >
            Add New Short Course
          </Text>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            colorScheme="teal"
            size="sm"
            leftIcon={<IoMdArrowBack />}
          >
            Back
          </Button>
        </div>

        {/* Basic Information Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Basic Information</Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Course Title (English) <span className="text-danger">*</span>
                </Text>
                <Input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Enter course title in English"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Course Title (Arabic) <span className="text-danger">*</span>
                </Text>
                <Input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="أدخل عنوان الدورة بالعربية"
                  dir="rtl"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Provider <span className="text-danger">*</span>
                </Text>
                <Select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Select provider"
                  mt={2}
                >
                  {providers.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Category <span className="text-danger">*</span>
                </Text>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select category"
                  mt={2}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Price (KWD) <span className="text-danger">*</span>
                </Text>
                <NumberInput precision={3} step={0.100} min={0} mt={2}>
                  <NumberInputField
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Duration <span className="text-danger">*</span>
                </Text>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 8 Weeks"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Start Date <span className="text-danger">*</span>
                </Text>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  End Date <span className="text-danger">*</span>
                </Text>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Flex align="center" mt={6}>
                  <Text color={textColor} fontSize="sm" fontWeight="700" mr={2}>
                    Featured Course
                  </Text>
                  <Switch
                    isChecked={featured}
                    onChange={() => setFeatured(!featured)}
                    colorScheme="teal"
                  />
                </Flex>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Media Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Media</Text>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <FileUploadField
                label="Course Image"
                file={courseImage}
                setFile={setCourseImage}
                accept="image/*"
                isRequired
              />
              <FileUploadField
                label="Brochure (PDF)"
                file={brochure}
                setFile={setBrochure}
                accept=".pdf"
              />
            </Grid>
          </CardBody>
        </Card>

        {/* Benefits Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Benefits of the Program</Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Text fontWeight="bold">Benefit {index + 1}</Text>
                  </CardHeader>
                  <CardBody>
                    <FormControl mb={4}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Image <span className="text-danger">*</span>
                      </Text>
                      <Box
                        border="1px dashed"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={4}
                        textAlign="center"
                        backgroundColor={"gray.100"}
                        cursor="pointer"
                        mt={2}
                        _hover={{ bg:"gray.100"}}
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
                              onClick={() => updateBenefit(index, "image", null)}
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
                              onChange={(e) => updateBenefit(index, "image", e.target.files[0])}
                            />
                          </>
                        )}
                      </Box>
                    </FormControl>
                    <FormControl>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Title <span className="text-danger">*</span>
                      </Text>
                      <Input
                        value={benefit.title}
                        onChange={(e) => updateBenefit(index, "title", e.target.value)}
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

        {/* Course Structure Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Course Structure</Text>
          </CardHeader>
          <CardBody>
            {structures.map((structure, index) => (
              <Card key={index} mb={4}>
                <CardHeader>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Structure {index + 1}</Text>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeStructure(index)}
                      leftIcon={<FaTrash />}
                    >
                      Remove
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <FormControl mb={4}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Structure Name <span className="text-danger">*</span>
                    </Text>
                    <Input
                      value={structure.name}
                      onChange={(e) => updateStructure(index, "name", e.target.value)}
                      placeholder="Enter structure name"
                      mt={2}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Image (Optional)
                    </Text>
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
                      {structure.image ? (
                        <>
                          <Image
                            src={URL.createObjectURL(structure.image)}
                            alt={`Structure ${index + 1}`}
                            maxH="120px"
                            maxW="180px"
                            mx="auto"
                            mb={3}
                            borderRadius="md"
                            objectFit="contain"
                          />
                          <Flex justify="center" gap={2}>
                            <Button
                              as="label"
                              htmlFor={`structureImage-${index}`}
                              variant="outline"
                              colorScheme="blue"
                              size="sm"
                            >
                              Change Image
                            </Button>
                            <Button
                              variant="outline"
                              colorScheme="red"
                              size="sm"
                              onClick={() => updateStructure(index, "image", null)}
                              leftIcon={<FaTrash />}
                            >
                              Remove
                            </Button>
                          </Flex>
                          <Input
                            type="file"
                            id={`structureImage-${index}`}
                            hidden
                            accept="image/*"
                            onChange={(e) => updateStructure(index, "image", e.target.files[0])}
                          />
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
                            onClick={() => document.getElementById(`structureImage-${index}`).click()}
                          >
                            Browse Files
                          </Button>
                          <Input
                            type="file"
                            id={`structureImage-${index}`}
                            hidden
                            accept="image/*"
                            onChange={(e) => updateStructure(index, "image", e.target.files[0])}
                          />
                        </>
                      )}
                    </Box>
                  </FormControl>
                  <FormControl>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Text <span className="text-danger">*</span>
                    </Text>
                    <Textarea
                      value={structure.text}
                      onChange={(e) => updateStructure(index, "text", e.target.value)}
                      placeholder="Enter structure details"
                      rows={4}
                      mt={2}
                    />
                  </FormControl>
                </CardBody>
              </Card>
            ))}
            <Button 
              onClick={addStructure} 
              leftIcon={<FaPlus />} 
              mt={2}
              colorScheme="purple"
            >
              Add Structure
            </Button>
          </CardBody>
        </Card>

        {/* Tutors Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Course Tutors</Text>
          </CardHeader>
          <CardBody>
            {tutors.map((tutor, index) => (
              <Card key={index} mb={4}>
                <CardHeader>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Tutor {index + 1}</Text>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeTutor(index)}
                      leftIcon={<FaTrash />}
                    >
                      Remove
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl mb={4}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Tutor Name <span className="text-danger">*</span>
                      </Text>
                      <Input
                        value={tutor.name}
                        onChange={(e) => updateTutor(index, "name", e.target.value)}
                        placeholder="Enter tutor name"
                        mt={2}
                      />
                    </FormControl>
                    <FormControl mb={4}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Tutor Image <span className="text-danger">*</span>
                      </Text>
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
                        {tutor.image ? (
                          <>
                            <Image
                              src={URL.createObjectURL(tutor.image)}
                              alt={`Tutor ${index + 1}`}
                              maxH="80px"
                              maxW="80px"
                              mx="auto"
                              mb={3}
                              borderRadius="full"
                              objectFit="cover"
                            />
                            <Button
                              variant="outline"
                              colorScheme="red"
                              size="sm"
                              onClick={() => updateTutor(index, "image", null)}
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
                              onClick={() => document.getElementById(`tutorImage-${index}`).click()}
                            >
                              Browse Files
                            </Button>
                            <Input
                              type="file"
                              id={`tutorImage-${index}`}
                              hidden
                              accept="image/*"
                              onChange={(e) => updateTutor(index, "image", e.target.files[0])}
                            />
                          </>
                        )}
                      </Box>
                    </FormControl>
                    <FormControl mb={4}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Instructor Rating (1-5) <span className="text-danger">*</span>
                      </Text>
                      <NumberInput 
                        min={1} 
                        max={5} 
                        step={0.1} 
                        precision={1}
                        value={tutor.rating}
                        onChange={(value) => updateTutor(index, "rating", value)}
                        mt={2}
                      >
                        <NumberInputField placeholder="Enter rating" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl mb={4}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Number of Courses <span className="text-danger">*</span>
                      </Text>
                      <NumberInput 
                        min={0}
                        value={tutor.courses}
                        onChange={(value) => updateTutor(index, "courses", value)}
                        mt={2}
                      >
                        <NumberInputField placeholder="Enter number" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl mb={4}>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Total Students <span className="text-danger">*</span>
                      </Text>
                      <NumberInput 
                        min={0}
                        value={tutor.students}
                        onChange={(value) => updateTutor(index, "students", value)}
                        mt={2}
                      >
                        <NumberInputField placeholder="Enter number" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>
                  <FormControl>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Description <span className="text-danger">*</span>
                    </Text>
                    <Textarea
                      value={tutor.description}
                      onChange={(e) => updateTutor(index, "description", e.target.value)}
                      placeholder="Enter tutor description"
                      rows={3}
                      mt={2}
                    />
                  </FormControl>
                </CardBody>
              </Card>
            ))}
            <Button 
              onClick={addTutor} 
              leftIcon={<FaPlus />} 
              mt={2}
              colorScheme="purple"
            >
              Add Tutor
            </Button>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <Flex justify="center" mt={6}>
          <Button
            variant="outline"
            colorScheme="red"
            mr={4}
            onClick={() => navigate("/admin/courses")}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
          >
            Create Course
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default AddShortCourse;
