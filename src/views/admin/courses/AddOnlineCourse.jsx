import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "./addSteps/BasicInfoStep";
import MediaStep from "./addSteps/MediaStep";
import OverviewStep from "./addSteps/OverviewStep";
import WhyChooseStep from "./addSteps/WhyChooseStep";
import StructureStep from "./addSteps/StructureStep";
import VideosStep from "./addSteps/VideosStep";
import ReviewStep from "./addSteps/ReviewStep";
import { useAddCourseMutation } from "api/onlineCourseSlice";


const steps = [
  { title: "Basic Info", description: "Course details" },
  { title: "Media", description: "Images & files" },
  { title: "Overview", description: "Course specifications" },
  { title: "Why Choose", description: "Benefits & features" },
  { title: "Structure", description: "Course modules" },
  { title: "Videos", description: "Course videos" },
  { title: "Review", description: "Confirm details" },
];

const AddCourseForm = () => {
  const [addOnlineCource] = useAddCourseMutation();
  const [formData, setFormData] = useState({
    // Course Basic Information
    titleEn: "",
    titleAr: "",
    provider: 0,
    category: 0,
    featured: false,
    soon: false,
    
    // Course Media
    courseImage: null,
    courseBanner: null,
    studyGuide: null,
    
    // Course Overview
    location: "",
    modeOfStudy: "",
    qualification: "",
    studyDuration: "",
    startDate: "",
    awardingBody: "",
    deliveredBy: "",
    
    // Why Choose Section
    whyChooseTitles: [""],
    benefits: Array(6).fill().map((_, i) => ({ image: null, title: "" })),
    
    // Course Structure
    structures: [{ name: "", image: null, text: "" }],
    
    // Course Videos
    videos: [{ url: "", year: "" }]
  });
  const validationSchema = {
    titleEn: { required: true, minLength: 3, maxLength: 150 },
    titleAr: { required: true, minLength: 3, maxLength: 150 },
    provider: { required: true },
    category: { required: true },
    courseImage: { required: true },
    courseBanner: { required: true },
    studyGuide: { required: true },
    whyChooseTitles: { 
      validate: (titles) => titles.some(title => title.trim().length > 0) 
    },
    location: { required: true,},
    modeOfStudy: { required: true,  },
    qualification: { required: true, },
    studyDuration: { required: true, },
    startDate: { required: true },
    awardingBody: { required: true, },
    deliveredBy: { required: true,  },
    benefits: {
      validate: (benefits) => benefits.every(b => b.title.trim().length > 0 && b.image)
    },
    structures: {
      validate: (structures) => structures.every(s => s.name && s.text)
    },
    videos: {
      validate: (videos) => videos.every(v => v.url && v.year)
    }
  };

  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedState = (parentField, index, field, value) => {
    setFormData(prev => {
      const updatedArray = [...prev[parentField]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      return {
        ...prev,
        [parentField]: updatedArray
      };
    });
  };

  const validateField = (fieldName, value) => {
    const rules = validationSchema[fieldName];
    if (!rules) return true;
  
    if (rules.required && !value) {
      return `${fieldName} is required`;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
  
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Cannot exceed ${rules.maxLength} characters`;
    }
  
    if (rules.validate && !rules.validate(value)) {
      return `Invalid ${fieldName} value`;
    }
  
    return null;
  };
  
  const validateStep = (stepIndex) => {
    const errors = {};
    
    switch(stepIndex) {
      case 0: // Basic Info
        errors.titleEn = validateField('titleEn', formData.titleEn);
        errors.titleAr = validateField('titleAr', formData.titleAr);
        errors.provider = validateField('provider', formData.provider);
        errors.category = validateField('category', formData.category);
        break;
        
      case 1: // Media
        errors.courseImage = validateField('courseImage', formData.courseImage);
        errors.courseBanner = validateField('courseBanner', formData.courseBanner);
        errors.studyGuide = validateField('studyGuide', formData.studyGuide);
        break;
      case 2: // overview 
        errors.location = validateField('location', formData.location);
        errors.modeOfStudy = validateField('modeOfStudy', formData.modeOfStudy);
        errors.qualification = validateField('qualification', formData.qualification);
        errors.studyDuration = validateField('studyDuration', formData.studyDuration);
        errors.startDate = validateField('startDate', formData.startDate);
        errors.awardingBody = validateField('awardingBody', formData.awardingBody);
        errors.deliveredBy = validateField('deliveredBy', formData.deliveredBy);
        break;
        
      case 3: // Why Choose
        errors.whyChooseTitles = validateField('whyChooseTitles', formData.whyChooseTitles);
        errors.benefits = validateField('benefits', formData.benefits);
        break;
        
      case 4: // Structure
        errors.structures = validateField('structures', formData.structures);
        break;
        
      case 5: // Videos
        errors.videos = validateField('videos', formData.videos);
        break;
    }
  
    return Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== null)
    );
  };

  const handleSubmit = async() => {
    let allErrors = {};
    steps.forEach((_, index) => {
      allErrors = { ...allErrors, ...validateStep(index) };
    });
  
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast({
        title: "Validation Error",
        description: "Please fill all Required Fields before submitting",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    const apiData = {
      title_en: formData.titleEn,
      title_ar: formData.titleAr,
      provider_id: parseInt(formData.provider), // Assuming provider is an ID
      category_id: parseInt(formData.category), // Assuming category is an ID
      featured_course: formData.featured,
      coming_soon: formData.soon,
      image: formData.courseImage,
      banner: formData.courseBanner,
      study_guide: formData.studyGuide,
      location: formData.location,
      mode_of_study: formData.modeOfStudy,
      qualification: formData.qualification,
      study_duration: formData.studyDuration,
      start_date: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      awarding_body: formData.awardingBody,
      delivered_by: formData.deliveredBy,
      titles: formData.whyChooseTitles.filter(title => title.trim() !== ""),
      benefits: formData.benefits
        .filter(benefit => benefit.title.trim() !== "")
        .map(benefit => ({
          image: benefit.image,
          title: benefit.title
        })),
      course_structure: formData.structures.map(structure => {
        const result = {};
        if (structure.name) {
          result.name = structure.name;
        }
        if (structure.text) {
          result.text = structure.text;
        }
        if (structure.image) {
          result.image = structure.image;
        }
        return result;
      }),
      course_videos: formData.videos
        .filter(video => video.url.trim() !== "")
        .map(video => ({
          video: video.url,
          year: video.year ? new Date(video.year).toISOString() : null
        }))
    };

    console.log("API Data:", apiData);
    console.log("Course Data:", formData);
    try {
      await addOnlineCource(apiData).unwrap();
      toast({
        title: "Course Created",
        description: "The course has been successfully created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/online-courses");
    } catch (error) {
      console.error("Failed to create course:", error);
      toast({
        title: "Error creating course",
        description: error.data?.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const [errors, setErrors] = useState({});

  const nextStep = () => {
    const stepErrors = validateStep(activeStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      handleChange,
      updateNestedState,
      errors
    };

    switch (activeStep) {
      case 0:
        return <BasicInfoStep {...commonProps} />;
      case 1:
        return <MediaStep {...commonProps} />;
      case 2:
        return <OverviewStep {...commonProps} />;
      case 3:
        return <WhyChooseStep {...commonProps} />;
      case 4:
        return <StructureStep {...commonProps} />;
      case 5:
        return <VideosStep {...commonProps} />;
      case 6:
        return <ReviewStep {...commonProps} />;
      default:
        return <BasicInfoStep {...commonProps} />;
    }
  };

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

        <Stepper index={activeStep} mb={8} orientation="horizontal" size="lg" flexWrap="no-wrap">
          {steps.map((step, index) => (
            <Step key={index} flex="1" minW={{ base: "100px", sm: "120px", md: "150px" }}>
              <VStack spacing={2} textAlign="center">
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box>
                  <StepTitle fontSize="sm">{step.title}</StepTitle>
                  <StepDescription fontSize="xs">{step.description}</StepDescription>
                </Box>
              </VStack>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {renderStep()}

        <Flex justify="space-between" mt={6}>
          <Button
            onClick={prevStep}
            isDisabled={activeStep === 0}
            leftIcon={<IoMdArrowBack />}
          >
            Previous
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              colorScheme="blue"
              onClick={nextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              colorScheme="green"
              type="submit"
              onClick={()=> handleSubmit()}
            >
              Submit Course
            </Button>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default AddCourseForm;