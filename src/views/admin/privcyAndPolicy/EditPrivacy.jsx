import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Textarea,
  Text,
  useColorModeValue,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";
import { useGetPrivacyQuery } from "api/privacySlice";
import { useUpdatePrivacyMutation } from "api/privacySlice";

const EditPrivacy = () => {
  const { id } = useParams();
  const [updatePrivacy] = useUpdatePrivacyMutation();
  const { data: privacyData, isLoading, isError, refetch } = useGetPrivacyQuery(id);
  const [englishTitle, setEnglishTitle] = useState("");
  const [arabicTitle, setArabicTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Load existing data when component mounts or data changes
  useEffect(() => {
    if (privacyData?.data) {
      setEnglishTitle(privacyData.data.title_en || "");
      setArabicTitle(privacyData.data.title_ar || "");
    }
  }, [privacyData]);

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

      const response = await updatePrivacy({id,data:privacyData}).unwrap();

      if (response.flag) {
        await Swal.fire({
          title: 'Success!',
          text: response.message || 'Privacy policy updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        refetch();
        navigate('/admin/undefined/cms/privacy-and-policy');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update privacy policy',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {

      
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update privacy policy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">Error loading privacy policy data</Text>
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
            Edit Privacy & Policy
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
              loadingText="Updating..."
            >
              Update
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditPrivacy;