import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Textarea,
  Text,
  useColorModeValue,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAddPrivacyMutation } from "api/privacySlice";
import Swal from "sweetalert2";

const AddPrivcy = () => {
  const [addPrivacy] = useAddPrivacyMutation();
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all unsaved changes!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard changes!'
    }).then((result) => {
      if (result.isConfirmed) {
        setEnglishTitle("");
        setArabicTitle("");
        navigate(-1);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    if (!englishTitle.trim() || !arabicTitle.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Both English and Arabic content are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const privacyData = {
        title_en: englishTitle,
        title_ar: arabicTitle,
      };

      const response = await addPrivacy(privacyData).unwrap();

      if (response.flag) {
        await Swal.fire({
          title: 'Success!',
          text: response.message || 'Privacy policy created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        navigate('/admin/undefined/cms/privacy-and-policy');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to create privacy policy',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to create privacy policy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
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
            Add New Privacy & Policy
          </Text>
          <Button
            type="button"
            onClick={handleCancel}
            colorScheme="teal"
            size="sm"
            leftIcon={<IoMdArrowBack />}
          >
            Back
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* English Description and Arabic Description Fields */}
          <div className="row col-md-12">
            <div className="mb-3 col-md-6">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                English Privacy Content
                <span className="text-danger mx-1">*</span>
              </Text> 
              <Textarea
                rows={10}
                id="englishTitle"
                placeholder="Enter English Privacy Content Here ..."
                value={englishTitle}
                onChange={(e) => setEnglishTitle(e.target.value)}
                required
                mt={"8px"}
                isDisabled={isSubmitting}
              />
            </div>
            <div className="mb-3 col-md-6 pr-0">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Arabic Privacy Content
                <span className="text-danger mx-1">*</span>
              </Text> 
              <Textarea
                rows={10}
                id="arabicTitle"
                placeholder="اكتب المحتو هنا ..."
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                dir="rtl"
                required
                mt={"8px"}
                isDisabled={isSubmitting}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <Flex justify="center" mt={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={handleCancel} 
              mr={2}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant='darkBrand' 
              color='white' 
              fontSize='sm' 
              fontWeight='500' 
              borderRadius='70px' 
              px='24px' 
              py='5px' 
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddPrivcy;