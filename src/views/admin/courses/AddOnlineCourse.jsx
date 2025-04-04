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
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaPlus, FaMinus } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddOnlineCourse = () => {
  // Course Basic Information
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  
  // Course Media
  const [courseImage, setCourseImage] = useState(null);
  const [courseBanner, setCourseBanner] = useState(null);
  const [studyGuide, setStudyGuide] = useState(null);
  
  // Course Overview
  const [location, setLocation] = useState("");
  const [modeOfStudy, setModeOfStudy] = useState("");
  const [qualification, setQualification] = useState("");
  const [studyDuration, setStudyDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [awardingBody, setAwardingBody] = useState("");
  const [deliveredBy, setDeliveredBy] = useState("");
  
  // Why Choose Section
  const [whyChooseTitles, setWhyChooseTitles] = useState([""]);
  const [benefits, setBenefits] = useState(
    Array(6).fill().map((_, i) => ({ image: null, title: `Benefit ${i+1}` }))
  );
  
  // Course Structure
  const [structures, setStructures] = useState([
    { name: "", image: null, text: "" }
  ]);
  
  // Course Videos
  const [videos, setVideos] = useState([{ url: "", year: "" }]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();
  const toast = useToast();

  // Mock data for dropdowns
  const providers = ["Coursera", "Udemy", "EdX", "Skillshare", "LinkedIn Learning"];
  const categories = ["Technology", "Business", "Design", "Health", "Education"];

  // Handle file uploads with consistent styling
  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  // Why Choose Title Management
  const addWhyChooseTitle = () => {
    setWhyChooseTitles([...whyChooseTitles, ""]);
  };

  const removeWhyChooseTitle = (index) => {
    if (whyChooseTitles.length > 1) {
      const updated = [...whyChooseTitles];
      updated.splice(index, 1);
      setWhyChooseTitles(updated);
    }
  };

  const updateWhyChooseTitle = (index, value) => {
    const updated = [...whyChooseTitles];
    updated[index] = value;
    setWhyChooseTitles(updated);
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

  // Videos Management
  const addVideo = () => {
    setVideos([...videos, { url: "", year: "" }]);
  };

  const removeVideo = (index) => {
    if (videos.length > 1) {
      const updated = [...videos];
      updated.splice(index, 1);
      setVideos(updated);
    }
  };

  const updateVideo = (index, field, value) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    setVideos(updated);
  };

  // Form Submission
  const handleSubmit = () => {
    const courseData = {
      titleEn,
      titleAr,
      provider,
      category,
      featured,
      courseImage,
      courseBanner,
      studyGuide,
      overview: {
        location,
        modeOfStudy,
        qualification,
        studyDuration,
        startDate,
        awardingBody,
        deliveredBy
      },
      whyChoose: {
        titles: whyChooseTitles,
        benefits
      },
      structures,
      videos
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

  // Consistent file upload component
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
        backgroundColor="gray.100"
        cursor="pointer"
      >
        {file ? (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {accept.includes("image") ? (
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                width="80px"
                height="80px"
                borderRadius="8px"
                objectFit="cover"
              />
            ) : (
              <Text>{file.name}</Text>
            )}
          </Box>
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
              Upload Files
              <Input
                type="file"
                id={label}
                hidden
                accept={accept}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
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
            Add New Course
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
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <FileUploadField
                label="Course Image"
                file={courseImage}
                setFile={setCourseImage}
                accept="image/*"
                isRequired
              />
              <FileUploadField
                label="Course Banner"
                file={courseBanner}
                setFile={setCourseBanner}
                accept="image/*"
              />
              <FileUploadField
                label="Study Guide (PDF)"
                file={studyGuide}
                setFile={setStudyGuide}
                accept=".pdf"
              />
            </Grid>
          </CardBody>
        </Card>

        {/* Course Overview Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Course Overview</Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Location
                </Text>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Mode of Study
                </Text>
                <Input
                  value={modeOfStudy}
                  onChange={(e) => setModeOfStudy(e.target.value)}
                  placeholder="Enter mode of study"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Qualification
                </Text>
                <Input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Enter qualification"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Study Duration
                </Text>
                <Input
                  value={studyDuration}
                  onChange={(e) => setStudyDuration(e.target.value)}
                  placeholder="Enter study duration"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Start Date
                </Text>
                <Input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Enter start date"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Awarding Body
                </Text>
                <Input
                  value={awardingBody}
                  onChange={(e) => setAwardingBody(e.target.value)}
                  placeholder="Enter awarding body"
                  mt={2}
                />
              </FormControl>
              <FormControl>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Delivered By
                </Text>
                <Input
                  value={deliveredBy}
                  onChange={(e) => setDeliveredBy(e.target.value)}
                  placeholder="Enter delivered by"
                  mt={2}
                />
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Why Choose Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Why Choose This Course</Text>
          </CardHeader>
          <CardBody>
            <FormControl mb={4}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Titles
              </Text>
              {whyChooseTitles.map((title, index) => (
                <Flex key={index} mb={2} mt={2}>
                  <Input
                    value={title}
                    onChange={(e) => updateWhyChooseTitle(index, e.target.value)}
                    placeholder="Enter title"
                  />
                  <Button
                    ml={2}
                    colorScheme="red"
                    onClick={() => removeWhyChooseTitle(index)}
                  >
                    <FaMinus />
                  </Button>
                </Flex>
              ))}
              <Button colorScheme="purple" onClick={addWhyChooseTitle} leftIcon={<FaPlus />} mt={2}>
                Add Title
              </Button>
            </FormControl>

            <FormControl>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Benefits
              </Text>
              <SimpleGrid columns={2} spacing={4} mt={2}>
                {benefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Text fontWeight="bold">Benefit {index + 1}</Text>
                    </CardHeader>
                    <CardBody>
                      <Box mb={2}>
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          Image
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
                          _hover={{backgroundColor: "gray.100"}}
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
                                objectFit="cover"
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
                      </Box>
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        Title
                      </Text>
                      <Input
                        value={benefit.title}
                        onChange={(e) => updateBenefit(index, "title", e.target.value)}
                        placeholder="Enter benefit title"
                        mt={2}
                      />
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </FormControl>
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
                      Structure Name
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
                      _hover={{ bg:"gray.100" }}
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
                      Text *
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
              Add New Structure
            </Button>
          </CardBody>
        </Card>

        {/* Videos Section */}
        <Card mb={4}>
          <CardHeader bg="gray.100" p={3}>
            <Text fontWeight="bold">Course Videos</Text>
          </CardHeader>
          <CardBody>
            {videos.map((video, index) => (
              <Card key={index} mb={4}>
                <CardHeader>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Video {index + 1}</Text>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeVideo(index)}
                    >
                      <FaTrash />
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <FormControl mb={2}>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Video URL
                    </Text>
                    <Input
                      value={video.url}
                      onChange={(e) => updateVideo(index, "url", e.target.value)}
                      placeholder="Enter video URL"
                      mt={2}
                    />
                  </FormControl>
                  <FormControl>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      Video Year
                    </Text>
                    <Input
                      value={video.year}
                      onChange={(e) => updateVideo(index, "year", e.target.value)}
                      placeholder="Enter video year"
                      mt={2}
                      type="date"
                    />
                  </FormControl>
                </CardBody>
              </Card>
            ))}
            <Button colorScheme="purple" onClick={addVideo} leftIcon={<FaPlus />} mt={2}>
              Add Video
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

export default AddOnlineCourse;