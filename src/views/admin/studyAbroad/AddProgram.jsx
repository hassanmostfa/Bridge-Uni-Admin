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
import AllAboutStep from "./addSteps/AllAboutStep";
import ProofStep from "./addSteps/ProofStep";
import VisaStep from "./addSteps/VisaStep";
import FinancialStep from "./addSteps/FinancialStep";
import SummaryStep from "./addSteps/SummaryStep";
import ReviewStep from "./addSteps/ReviewStep";
import { useAddAbroadCourseMutation } from "api/studyAbroadSlice";

const steps = [
  { title: "Basic Info", description: "Program details" },
  { title: "Media", description: "Images & gallery" },
  { title: "All About", description: "Program overview" },
  { title: "Proof", description: "Evidence section" },
  { title: "Visa Info", description: "Visa details" },
  { title: "Financial", description: "Cost information" },
  { title: "Summary", description: "Final details" },
  { title: "Review", description: "Confirm information" },
];

const AddProgramForm = () => {
  const [addCourse] = useAddAbroadCourseMutation();
  const [formData, setFormData] = useState({
    // Basic Information
    titleEn: "",
    titleAr: "",
    mainImage: null,
    galleryImages: [],
    innerTitle: "",
    sectionTitle:"",
    description: "",
    featured: false,
    
    // All About Section
    allAboutTitle: "",
    numUniversities: 0,
    numMajors: 0,
    topUniversities: [{ image: null, name: "" }],
    popularMajors: [],
    
    // Proof Section
    proofDescription: "",
    proofImages: [],
    requirements: [""],
    
    // Visa Information
    visaDescription: "",
    visaImage: null,
    visaAttributes: [{ name: "", image: null }],
    
    // Financial Information
    programLevel: "",
    programLength: "",
    tuition: "",
    costOfLiving: "",
    fees: "",
    applicationFee: "",
    
    // Summary Section
    summary: "",
    programRequirements: [""]
  });

  const validationSchema = {
    titleEn: { required: true,},
    titleAr: { required: true, },
    mainImage: { required: true },
    galleryImages: { required: true },
    description: { required: true,},
    innerTitle: { required: true,},
    sectionTitle: { required: true,},
    allAboutTitle: { required: true },
    numUniversities: { required: true, min: 1 },
    numMajors: { required: true, min: 1 },
    topUniversities: {
      validate: (universities) => universities.every(u => u.name && u.image)
    },
    popularMajors: {
      validate: (majors) => majors.length > 0
    },
    proofDescription: { required: true },
    proofImages: {
      validate: (images) => images.length > 0
    },
    requirements: {
      validate: (reqs) => reqs.every(r => r.trim().length > 0)
    },
    visaDescription: { required: true },
    visaImage: { required: true },
    visaAttributes: {
      validate: (attrs) => attrs.every(a => a.name && a.image)
    },
    programLevel: { required: true },
    programLength: { required: true },
    tuition: { required: true, min: 0 },
    costOfLiving: { required: true, min: 0 },
    fees: { required: true, min: 0 },
    applicationFee: { required: true, min: 0 },
    summary: { required: true },
    programRequirements: {
      validate: (reqs) => reqs.every(r => r.trim().length > 0)
    }
  };

  const navigate = useNavigate();
  const toast = useToast();
  const [errors, setErrors] = useState({});

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
  
    if (rules.min !== undefined && value < rules.min) {
      return `Must be at least ${rules.min}`;
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
        errors.description = validateField('description', formData.description);
        errors.innerTitle = validateField('innerTitle', formData.innerTitle);
        errors.sectionTitle = validateField('sectionTitle', formData.sectionTitle);
        break;
        
      case 1: // Media
        errors.mainImage = validateField('mainImage', formData.mainImage);
        errors.galleryImages = validateField('galleryImages', formData.mainImage);
        break;
        
      case 2: // All About
        errors.allAboutTitle = validateField('allAboutTitle', formData.allAboutTitle);
        errors.numUniversities = validateField('numUniversities', formData.numUniversities);
        errors.numMajors = validateField('numMajors', formData.numMajors);
        errors.topUniversities = validateField('topUniversities', formData.topUniversities);
        errors.popularMajors = validateField('popularMajors', formData.popularMajors);
        break;
        
      case 3: // Proof
        errors.proofDescription = validateField('proofDescription', formData.proofDescription);
        errors.proofImages = validateField('proofImages', formData.proofImages);
        errors.requirements = validateField('requirements', formData.requirements);
        break;
        
      case 4: // Visa
        errors.visaDescription = validateField('visaDescription', formData.visaDescription);
        errors.visaImage = validateField('visaImage', formData.visaImage);
        errors.visaAttributes = validateField('visaAttributes', formData.visaAttributes);
        break;
        
      case 5: // Financial
        errors.programLevel = validateField('programLevel', formData.programLevel);
        errors.programLength = validateField('programLength', formData.programLength);
        errors.tuition = validateField('tuition', formData.tuition);
        errors.costOfLiving = validateField('costOfLiving', formData.costOfLiving);
        errors.fees = validateField('fees', formData.fees);
        errors.applicationFee = validateField('applicationFee', formData.applicationFee);
        break;
        
      case 6: // Summary
        errors.summary = validateField('summary', formData.summary);
        errors.programRequirements = validateField('programRequirements', formData.programRequirements);
        break;
    }
  
    return Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== null)
    );
  };

  const handleSubmit = async () => {
    let allErrors = {};
    steps.forEach((_, index) => {
      allErrors = { ...allErrors, ...validateStep(index) };
    });
  
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast({
        title: "Validation Error",
        description: "Please fill all required fields before submitting",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // Prepare the data for API submission in the required format
    const programData = {
      title_en: formData.titleEn,
      title_ar: formData.titleAr,
      inner_title: formData.innerTitle,
      featured_course: formData.featured || false,
      coming_soon: formData.soon || false,
      description: formData.description,
      main_image: formData.mainImage,
      section_title: formData.sectionTitle,
      number_of_universities: parseInt(formData.numUniversities) || 0,
      number_of_majors: parseInt(formData.numMajors) || 0,
      proof_description: formData.proofDescription,
      visa_description: formData.visaDescription,
      visa_image: formData.visaImage,
      program_level: formData.programLevel,
      program_length: parseInt(formData.programLength) || 0,
      tuition_fees: parseInt(formData.tuition) || 0,
      cost_of_living: parseInt(formData.costOfLiving) || 0,
      fees: parseInt(formData.fees) || 0,
      application_fee: parseInt(formData.applicationFee) || 0,
      summary_text: formData.summary,
      gallery_images: formData.galleryImages || [],
      proof_images: formData.proofImages || [],
      university: formData.topUniversities?.map(uni => ({
        image: uni.image || '',
        name: uni.name || ''
      })) || [],
      visa_attribute: formData.visaAttributes?.map(attr => ({
        image: attr.image || '',
        name: attr.name || ''
      })) || [],
      proof_requirements: formData.requirements || [],
      program_requirements: formData.programRequirements || [],
      major_id: formData.popularMajors || [],  
    };
  
    console.log("Program Data:", programData);
    
    try {
      await addCourse(programData).unwrap();
      toast({
        title: "Program Created",
        description: "The study abroad program has been successfully created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/study-abroad");
    } catch (error) {
      console.error("Failed to create program:", error);
      toast({
        title: "Error creating program",
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
        return <AllAboutStep {...commonProps} />;
      case 3:
        return <ProofStep {...commonProps} />;
      case 4:
        return <VisaStep {...commonProps} />;
      case 5:
        return <FinancialStep {...commonProps} />;
      case 6:
        return <SummaryStep {...commonProps} />;
      case 7:
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

        <Stepper index={activeStep} mb={8} orientation="horizontal" size="lg" flexWrap="no-wrap" overflow={'auto'}>
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
              onClick={handleSubmit}
            >
              Submit Program
            </Button>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default AddProgramForm;