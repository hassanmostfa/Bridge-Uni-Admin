import React, { useState } from "react";
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
} from "@chakra-ui/react";
import "./blog.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdSupportAgent } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";
import { useAddContactMutation } from "api/contactSlice";

const AddContact = () => {
  const [addContact] = useAddContactMutation();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setFormData({
      chat_support_email: "",
      email: "",
      phone: "",
      whatsapp: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await addContact(formData).unwrap();
      
      toast({
        title: "Contact added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      navigate("/admin/undefined/contacts");
    } catch (err) {
      console.error("Failed to add contact:", err);
      
      toast({
        title: "Error adding contact",
        description: err.data?.message || "Please try again",
        status: "error",
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
            Add Contact Information
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
          <FormControl mb={4} >
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={MdSupportAgent} color="blue.500" />
                <span>Chat Support Email <span style={{ color: "red" }}>*</span></span>
              </Flex>
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
          <FormControl mb={4} >
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={MdEmail} color="red.500" />
                <span>Email Address <span style={{ color: "red" }}>*</span></span>
              </Flex>
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
          <FormControl mb={4} >
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={BsTelephoneFill} color="green.500" />
                <span>Phone Number <span style={{ color: "red" }}>*</span></span>
              </Flex>
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
          <FormControl mb={4} >
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={FaWhatsapp} color="green.500" />
                <span>WhatsApp Number <span style={{ color: "red" }}>*</span></span>
              </Flex>
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
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddContact;