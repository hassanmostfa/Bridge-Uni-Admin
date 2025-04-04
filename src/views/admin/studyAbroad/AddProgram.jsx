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
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddProgram = () => {
  // Main Program Information
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [innerTitle, setInnerTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  // All About Section
  const [allAboutTitle, setAllAboutTitle] = useState("");
  const [numUniversities, setNumUniversities] = useState(0);
  const [numMajors, setNumMajors] = useState(0);
  const [topUniversities, setTopUniversities] = useState([
    { image: null, name: "" }
  ]);
  const [popularMajors, setPopularMajors] = useState([]);
  const availableMajors = ["Engineering", "Medicine", "Business", "Computer Science", "Architecture"];

  // Proof Section
  const [proofDescription, setProofDescription] = useState("");
  const [proofImages, setProofImages] = useState([]);
  const [requirements, setRequirements] = useState([""]);

  // Visa Information
  const [visaDescription, setVisaDescription] = useState("");
  const [visaImage, setVisaImage] = useState(null);
  const [visaAttributes, setVisaAttributes] = useState([
    { name: "", image: null }
  ]);

  // Financial Information
  const [programLevel, setProgramLevel] = useState("");
  const [programLength, setProgramLength] = useState("");
  const [tuition, setTuition] = useState("");
  const [costOfLiving, setCostOfLiving] = useState("");
  const [applicationFee, setApplicationFee] = useState("");

  // Summary Section
  const [summary, setSummary] = useState("");
  const [programRequirements, setProgramRequirements] = useState([""]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();
  const toast = useToast();

  // Handle file uploads
  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const handleMultipleFileUpload = (e, setFiles) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) setFiles(prev => [...prev, ...files]);
  };

  // Dynamic Sections Management
  const addUniversity = () => {
    setTopUniversities([...topUniversities, { image: null, name: "" }]);
  };

  const removeUniversity = (index) => {
    if (topUniversities.length > 1) {
      const updated = [...topUniversities];
      updated.splice(index, 1);
      setTopUniversities(updated);
    }
  };

  const updateUniversity = (index, field, value) => {
    const updated = [...topUniversities];
    updated[index] = { ...updated[index], [field]: value };
    setTopUniversities(updated);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      const updated = [...requirements];
      updated.splice(index, 1);
      setRequirements(updated);
    }
  };

  const updateRequirement = (index, value) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const addVisaAttribute = () => {
    setVisaAttributes([...visaAttributes, { name: "", image: null }]);
  };

  const removeVisaAttribute = (index) => {
    if (visaAttributes.length > 1) {
      const updated = [...visaAttributes];
      updated.splice(index, 1);
      setVisaAttributes(updated);
    }
  };

  const updateVisaAttribute = (index, field, value) => {
    const updated = [...visaAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setVisaAttributes(updated);
  };

  const addProgramRequirement = () => {
    setProgramRequirements([...programRequirements, ""]);
  };

  const removeProgramRequirement = (index) => {
    if (programRequirements.length > 1) {
      const updated = [...programRequirements];
      updated.splice(index, 1);
      setProgramRequirements(updated);
    }
  };

  const updateProgramRequirement = (index, value) => {
    const updated = [...programRequirements];
    updated[index] = value;
    setProgramRequirements(updated);
  };

  // Form Submission
  const handleSubmit = () => {
    const programData = {
      titleEn,
      titleAr,
      mainImage,
      galleryImages,
      innerTitle,
      description,
      featured,
      allAbout: {
        title: allAboutTitle,
        numUniversities,
        numMajors,
        topUniversities,
        popularMajors
      },
      proof: {
        description: proofDescription,
        images: proofImages,
        requirements
      },
      visa: {
        description: visaDescription,
        image: visaImage,
        attributes: visaAttributes
      },
      financials: {
        programLevel,
        programLength,
        tuition,
        costOfLiving,
        applicationFee
      },
      summary: {
        text: summary,
        requirements: programRequirements
      }
    };

    console.log("Program Data:", programData);
    toast({
      title: "Program Created",
      description: "The study abroad program has been successfully created",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate("/admin/programs");
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

  const MultipleFileUploadField = ({ label, files, setFiles, accept, isRequired = false }) => (
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
        onClick={() => document.getElementById(`${label}-multiple`).click()}
      >
        <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
        <Text color="gray.500" mb={2}>
          Click to upload multiple files
        </Text>
        <Input
          type="file"
          id={`${label}-multiple`}
          hidden
          accept={accept}
          multiple
          onChange={(e) => handleMultipleFileUpload(e, setFiles)}
        />
      </Box>
      {files.length > 0 && (
        <Box mt={4}>
          <Text fontSize="sm" mb={2}>Selected files:</Text>
          <List spacing={2}>
            {files.map((file, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <ListIcon as={FaCheck} color="green.500" />
                {file.name}
                <IconButton
                  icon={<FaTrash />}
                  size="xs"
                  ml={2}
                  colorScheme="red"
                  onClick={() => {
                    const updated = [...files];
                    updated.splice(index, 1);
                    setFiles(updated);
                  }}
                  aria-label="Remove file"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
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
            Add New Study Abroad Program
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
                  Program Title (English) <span className="text-danger">*</span>
                </Text>
                <Input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Enter program title in English"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Program Title (Arabic) <span className="text-danger">*</span>
                </Text>
                <Input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="أدخل عنوان البرنامج بالعربية"
                  dir="rtl"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Inner Title
                </Text>
                <Input
                  value={innerTitle}
                  onChange={(e) => setInnerTitle(e.target.value)}
                  placeholder="Enter inner title"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Flex align="center" mt={6}>
                  <Text color={textColor} fontSize="sm" fontWeight="700" mr={2}>
                    Featured Program
                  </Text>
                  <Switch
                    isChecked={featured}
                    onChange={() => setFeatured(!featured)}
                    colorScheme="teal"
                  />
                </Flex>
              </FormControl>
            </SimpleGrid>
            <FormControl mt={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description <span className="text-danger">*</span>
              </Text>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter program description"
                rows={4}
                mt={2}
              />
            </FormControl>
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
                label="Main Image"
                file={mainImage}
                setFile={setMainImage}
                accept="image/*"
                isRequired
              />
              <MultipleFileUploadField
                label="Gallery Images"
                files={galleryImages}
                setFiles={setGalleryImages}
                accept="image/*"
              />
            </Grid>
          </CardBody>
        </Card>

        {/* All About Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">All About This Program</Text>
          </CardHeader>
          <CardBody>
            <FormControl mb={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Section Title <span className="text-danger">*</span>
              </Text>
              <Input
                value={allAboutTitle}
                onChange={(e) => setAllAboutTitle(e.target.value)}
                placeholder="Enter section title"
                mt={2}
              />
            </FormControl>
            <SimpleGrid columns={2} spacing={4} mb={4}>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Number of Universities <span className="text-danger">*</span>
                </Text>
                <NumberInput
                  min={0}
                  value={numUniversities}
                  onChange={(value) => setNumUniversities(value)}
                  mt={2}
                >
                  <NumberInputField placeholder="Enter number" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Number of Majors <span className="text-danger">*</span>
                </Text>
                <NumberInput
                  min={0}
                  value={numMajors}
                  onChange={(value) => setNumMajors(value)}
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
            
            <Text color={textColor} fontSize="sm" fontWeight="700" mb={2}>
              Top Universities <span className="text-danger">*</span>
            </Text>
            {topUniversities.map((university, index) => (
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
                  <FormControl mb={4}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      University Name <span className="text-danger">*</span>
                    </Text>
                    <Input
                      value={university.name}
                      onChange={(e) => updateUniversity(index, "name", e.target.value)}
                      placeholder="Enter university name"
                      mt={2}
                    />
                  </FormControl>
                  <FormControl>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      University Image <span className="text-danger">*</span>
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
                      {university.image ? (
                        <>
                          <Image
                            src={URL.createObjectURL(university.image)}
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
                            onClick={() => updateUniversity(index, "image", null)}
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
                            onChange={(e) => updateUniversity(index, "image", e.target.files[0])}
                          />
                        </>
                      )}
                    </Box>
                  </FormControl>
                </CardBody>
              </Card>
            ))}
            <Button  onClick={addUniversity} leftIcon={<FaPlus />} colorScheme="purple" mb={4}>
              Add University
            </Button>

            <FormControl>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Popular Majors <span className="text-danger">*</span>
              </Text>
              <Select
                placeholder="Select popular majors"
                value={popularMajors}
                onChange={(e) => setPopularMajors(Array.from(e.target.selectedOptions, option => option.value))}
                mt={2}
              >
                {availableMajors.map((major) => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </Select>
            </FormControl>
          </CardBody>
        </Card>

        {/* Proof Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Proof Section</Text>
          </CardHeader>
          <CardBody>
            <FormControl mb={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description <span className="text-danger">*</span>
              </Text>
              <Textarea
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                placeholder="Enter proof description"
                rows={4}
                mt={2}
              />
            </FormControl>
            <MultipleFileUploadField
              label="Proof Images"
              files={proofImages}
              setFiles={setProofImages}
              accept="image/*"
            />
            <FormControl mt={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Requirements <span className="text-danger">*</span>
              </Text>
              {requirements.map((requirement, index) => (
                <Flex key={index} mb={2} mt={2}>
                  <Input
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="Enter requirement"
                  />
                  <Button
                    ml={2}
                    colorScheme="red"
                    onClick={() => removeRequirement(index)}
                  >
                    <FaMinus />
                  </Button>
                </Flex>
              ))}
              <Button onClick={addRequirement} leftIcon={<FaPlus />} colorScheme="purple">
                Add Requirement
              </Button>
            </FormControl>
          </CardBody>
        </Card>

        {/* Visa Information */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Visa Information</Text>
          </CardHeader>
          <CardBody>
            <FormControl mb={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description <span className="text-danger">*</span>
              </Text>
              <Textarea
                value={visaDescription}
                onChange={(e) => setVisaDescription(e.target.value)}
                placeholder="Enter visa description"
                rows={4}
                mt={2}
              />
            </FormControl>
            <FileUploadField
              label="Visa Image"
              file={visaImage}
              setFile={setVisaImage}
              accept="image/*"
            />
            <Text color={textColor} fontSize="sm" fontWeight="700" mt={4} mb={2}>
              Visa Attributes <span className="text-danger">*</span>
            </Text>
            {visaAttributes.map((attribute, index) => (
              <Card key={index} mb={4}>
                <CardHeader>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Attribute {index + 1}</Text>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeVisaAttribute(index)}
                      leftIcon={<FaTrash />}
                    >
                      Remove
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <FormControl mb={4}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Attribute Name <span className="text-danger">*</span>
                    </Text>
                    <Input
                      value={attribute.name}
                      onChange={(e) => updateVisaAttribute(index, "name", e.target.value)}
                      placeholder="Enter attribute name"
                      mt={2}
                    />
                  </FormControl>
                  <FormControl>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Attribute Image <span className="text-danger">*</span>
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
                      _hover={{ bg:"gray.100" }}
                    >
                      {attribute.image ? (
                        <>
                          <Image
                            src={URL.createObjectURL(attribute.image)}
                            alt={`Attribute ${index + 1}`}
                            maxH="80px"
                            maxW="80px"
                            mx="auto"
                            mb={3}
                            borderRadius="md"
                            objectFit="contain"
                          />
                          <Button
                            variant="outline"
                            colorScheme="red"
                            size="sm"
                            onClick={() => updateVisaAttribute(index, "image", null)}
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
                            onClick={() => document.getElementById(`attributeImage-${index}`).click()}
                          >
                            Browse Files
                          </Button>
                          <Input
                            type="file"
                            id={`attributeImage-${index}`}
                            hidden
                            accept="image/*"
                            onChange={(e) => updateVisaAttribute(index, "image", e.target.files[0])}
                          />
                        </>
                      )}
                    </Box>
                  </FormControl>
                </CardBody>
              </Card>
            ))}
            <Button onClick={addVisaAttribute} leftIcon={<FaPlus />} colorScheme="purple">
              Add Visa Attribute
            </Button>
          </CardBody>
        </Card>

        {/* Financial Information */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Financial Information</Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Program Level <span className="text-danger">*</span>
                </Text>
                <Select
                  value={programLevel}
                  onChange={(e) => setProgramLevel(e.target.value)}
                  placeholder="Select program level"
                  mt={2}
                >
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </Select>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Program Length <span className="text-danger">*</span>
                </Text>
                <Input
                  value={programLength}
                  onChange={(e) => setProgramLength(e.target.value)}
                  placeholder="e.g. 4 Years"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Tuition Fees <span className="text-danger">*</span>
                </Text>
                <NumberInput precision={2} min={0} mt={2}>
                  <NumberInputField
                    value={tuition}
                    onChange={(e) => setTuition(e.target.value)}
                    placeholder="Enter tuition fees"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Cost of Living <span className="text-danger">*</span>
                </Text>
                <NumberInput precision={2} min={0} mt={2}>
                  <NumberInputField
                    value={costOfLiving}
                    onChange={(e) => setCostOfLiving(e.target.value)}
                    placeholder="Enter cost of living"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Application Fee <span className="text-danger">*</span>
                </Text>
                <NumberInput precision={2} min={0} mt={2}>
                  <NumberInputField
                    value={applicationFee}
                    onChange={(e) => setApplicationFee(e.target.value)}
                    placeholder="Enter application fee"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Summary Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Summary</Text>
          </CardHeader>
          <CardBody>
            <FormControl mb={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Summary Text <span className="text-danger">*</span>
              </Text>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter program summary"
                rows={4}
                mt={2}
              />
            </FormControl>
            <FormControl>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Program Requirements <span className="text-danger">*</span>
              </Text>
              {programRequirements.map((requirement, index) => (
                <Flex key={index} mb={2} mt={2}>
                  <Input
                    value={requirement}
                    onChange={(e) => updateProgramRequirement(index, e.target.value)}
                    placeholder="Enter requirement"
                  />
                  <Button
                    ml={2}
                    colorScheme="red"
                    onClick={() => removeProgramRequirement(index)}
                  >
                    <FaMinus />
                  </Button>
                </Flex>
              ))}
              <Button onClick={addProgramRequirement} leftIcon={<FaPlus />} colorScheme="purple">
                Add Requirement
              </Button>
            </FormControl>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <Flex justify="center" mt={6}>
          <Button
            variant="outline"
            colorScheme="red"
            mr={4}
            onClick={() => navigate("/admin/programs")}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
          >
            Create Program
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default AddProgram;