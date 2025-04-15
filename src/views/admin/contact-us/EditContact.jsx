import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Icon,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import "./blog.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { MdEmail, MdSupportAgent } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";
import { useGetAllContactsQuery, useUpdateContactMutation } from "api/contactSlice";

const EditContact = () => {
  const { id } = useParams();
  const { data: contacts, isLoading, isError } = useGetAllContactsQuery();
  const [updateContact] = useUpdateContactMutation();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    chat_support_email: "",
    email: "",
    phone: "",
    whatsapp: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Find and set the contact data when component mounts or contacts data changes
  useEffect(() => {
    if (contacts && id) {
      const contactToEdit = contacts?.data?.data.find(contact => contact.id.toString() === id.toString());
      if (contactToEdit) {
        setFormData({
          chat_support_email: contactToEdit.chat_support_email || "",
          email: contactToEdit.email || "",
          phone: contactToEdit.phone || "",
          whatsapp: contactToEdit.whatsapp || ""
        });
      }
    }
  }, [contacts, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate("/admin/undefined/contacts");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updateContact({
        id,
        data:{...formData}
      }).unwrap();
      
      toast({
        title: "Contact updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      navigate("/admin/undefined/contacts");
    } catch (err) {
      console.error("Failed to update contact:", err);
      
      toast({
        title: "Error updating contact",
        description: err.data?.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text color="red.500">Error loading contact data</Text>
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
            Edit Contact Information
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
        <form onSubmit={handleSubmit}>
          {/* Chat Support Email Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700" display="flex" alignItems="center" gap={2}>
              <Icon as={MdSupportAgent} color="blue.500" />
              Chat Support Email
              <Text as="span" color="red.500" ml={1}>*</Text>
            </FormLabel>
            <Input
              name="chat_support_email"
              type="email"
              placeholder="support@example.com"
              value={formData.chat_support_email}
              onChange={handleChange}
              required
            />
          </FormControl>

          {/* Email Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700" display="flex" alignItems="center" gap={2}>
              <Icon as={MdEmail} color="red.500" />
              Email Address
              <Text as="span" color="red.500" ml={1}>*</Text>
            </FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="contact@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormControl>

          {/* Phone Number Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700" display="flex" alignItems="center" gap={2}>
              <Icon as={BsTelephoneFill} color="green.500" />
              Phone Number
              <Text as="span" color="red.500" ml={1}>*</Text>
            </FormLabel>
            <Input
              name="phone"
              type="tel"
              placeholder="+201234567890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormControl>

          {/* WhatsApp Number Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700" display="flex" alignItems="center" gap={2}>
              <Icon as={FaWhatsapp} color="green.500" />
              WhatsApp Number
              <Text as="span" color="red.500" ml={1}>*</Text>
            </FormLabel>
            <Input
              name="whatsapp"
              type="tel"
              placeholder="+201234567890"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </FormControl>

          {/* Action Buttons */}
          <Flex justify="flex-end" mt={6} gap={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={handleCancel}
              width="120px"
              type="button"
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
              width="120px"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Update
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default EditContact;