import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useGetShortCourseQuery, useUpdateShortCourseMutation } from "api/shortCourcesSlice";
import BasicInfoStep from "./addShortCourseSteps/BasicInfoStep";
import MediaStep from "./addShortCourseSteps/MediaStep";
import BenefitsStep from "./addShortCourseSteps/BenefitsStep";
import StructureStep from "./addShortCourseSteps/StructureStep";
import TutorsStep from "./addShortCourseSteps/TutorsStep";
import ReviewStep from "./addShortCourseSteps/ReviewStep";
import WhyChooseStep from "./addShortCourseSteps/WhyChooseStep";

const steps = [
  { title: "Basic Info", description: "Course details" },
  { title: "Media", description: "Images & files" },
  { title: "Benefits", description: "Program benefits" },
  { title: "Structure", description: "Course structure" },
  { title: "Tutors", description: "Course instructors" },
  { title: "Review", description: "Confirm details" },
];

const EditShortCourse = () => {
  const { id } = useParams();
  const { data: courseData, isLoading } = useGetShortCourseQuery(id);
  const [updateCourse] = useUpdateShortCourseMutation();
  const navigate = useNavigate();
  const toast = useToast();

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    // Course Basic Information
    titleEn: "",
    titleAr: "",
    provider: 0,
    category: 0,
    price: "",
    duration: "",
    startDate: "",
    endDate: "",
    featured: false,
    soon: false,
    // Course Media
    courseImage: null,
    brochure: null,
    // Benefits of the Program
    benefits: Array(6).fill().map((_, i) => ({ image: null, title: "" })),
    // Course Structure
    structures: [{ name: "", image: null, text: "" }],
    // Course Tutors
    tutors: [{ 
      name: "", 
      image: null, 
      rating: 0, 
      courses: 0, 
      students: 0, 
      description: "" 
    }]
  });

  // Populate form with course data when loaded
  useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;
      setFormData({
        titleEn: course.title_en || "",
        titleAr: course.title_ar || "",
        provider: course.provider_id || 0,
        category: course.category_id || 0,
        price: course.price || "",
        duration: course.duration?.toString() || "",
        startDate: course.start_date ? new Date(course.start_date).toISOString().split('T')[0] : "",
        endDate: course.end_date ? new Date(course.end_date).toISOString().split('T')[0] : "",
        featured: course.featured_course || false,
        soon: course.coming_soon || false,
        courseImage: course.image || null,
        brochure: course.brochure || null,
        benefits: course.benefits?.length > 0 
          ? course.benefits.map(b => ({ image: b.image, title: b.title }))
          : Array(6).fill().map((_, i) => ({ image: null, title: "" })),
        structures: course.course_structures?.length > 0
          ? course.course_structures.map(s => ({ 
              name: s.name, 
              image: s.image, 
              text: s.text 
            }))
          : [{ name: "", image: null, text: "" }],
        tutors: course.course_tutors?.length > 0
          ? course.course_tutors.map(t => ({
              name: t.name,
              image: t.image,
              rating: t.rate,
              courses: t.number_of_courses,
              students: t.total_students,
              description: t.Description
            }))
          : [{ name: "", image: null, rating: 0, courses: 0, students: 0, description: "" }]
      });
    }
  }, [courseData]);

  const validationSchema = {
    titleEn: { required: true, minLength: 3, maxLength: 150 },
    titleAr: { required: true, minLength: 3, maxLength: 150 },
    provider: { required: true },
    category: { required: true },
    price: { required: true },
    duration: { required: true },
    startDate: { required: true },
    endDate: { required: true },
    courseImage: { required: true },
    brochure: { required: true },
    benefits: {
      validate: (benefits) => benefits.every(b => b.title.trim().length > 0 && b.image)
    },
    structures: {
      validate: (structures) => structures.every(s => s.name && s.text)
    },
    tutors: {
      validate: (tutors) => tutors.every(t => 
        t.name && t.image && t.description && t.rating > 0
      )
    }
  };

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
        errors.price = validateField('price', formData.price);
        errors.duration = validateField('duration', formData.duration);
        errors.startDate = validateField('startDate', formData.startDate);
        errors.endDate = validateField('endDate', formData.endDate);
        break;
        
      case 1: // Media
        errors.courseImage = validateField('courseImage', formData.courseImage);
        errors.brochure = validateField('brochure', formData.brochure);
        break;
        
      case 2: // Benefits
        errors.benefits = validateField('benefits', formData.benefits);
        break;
        
      case 3: // Structure
        errors.structures = validateField('structures', formData.structures);
        break;
        
      case 4: // Tutors
        errors.tutors = validateField('tutors', formData.tutors);
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
      provider_id: parseInt(formData.provider),
      category_id: parseInt(formData.category),
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate).toISOString(),
      featured_course: formData.featured,
      coming_soon: formData.soon,
      image: formData.courseImage,
      brochure: formData.brochure,
      benefits: formData.benefits
        .filter(benefit => benefit.title.trim() !== "")
        .map(benefit => ({
          image: benefit.image,
          title: benefit.title
        })),
      course_structure: formData.structures.map(structure => ({
        name: structure.name,
        text: structure.text,
        image: structure.image
      })),
      course_tutors: formData.tutors.map(tutor => ({
        Description: tutor.description,
        total_students: parseInt(tutor.students),
        number_of_courses: parseInt(tutor.courses),
        rate: parseFloat(tutor.rating),
        image: tutor.image,
        name: tutor.name
      }))
    };

    try {
      await updateCourse({ id, data: apiData }).unwrap();
      toast({
        title: "Course Updated",
        description: "The short course has been successfully updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/short-courses");
    } catch (error) {
      console.error("Failed to update course:", error);
      toast({
        title: "Error updating course",
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
        return <WhyChooseStep {...commonProps} />;
      case 3:
        return <StructureStep {...commonProps} />;
      case 4:
        return <TutorsStep {...commonProps} />;
      case 5:
        return <ReviewStep {...commonProps} />;
      default:
        return <BasicInfoStep {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text>Loading course data...</Text>
      </Flex>
    );
  }

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
            Edit Short Course
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
              type="submit"
              onClick={handleSubmit}
            >
              Update Course
            </Button>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default EditShortCourse;