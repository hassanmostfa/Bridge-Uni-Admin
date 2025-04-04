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
} from "@chakra-ui/react";
import "./blog.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdSupportAgent } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";

const AddContact = () => {
  const [chatSupportEmail, setChatSupportEmail] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  const handleCancel = () => {
    setChatSupportEmail("");
    setEmail("");
    setPhoneNumber("");
    setWhatsappNumber("");
  };

  const handleSubmit = () => {
    const contactData = {
      chatSupportEmail,
      email,
      phoneNumber,
      whatsappNumber,
    };
    console.log("Contact Data:", contactData);
    // You can send this data to an API or perform other actions
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
        <form>
          {/* Chat Support Email Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={MdSupportAgent} color="blue.500" />
                Chat Support Email
                <span style={{ color: "red" }}>*</span>
              </Flex>
            </FormLabel>
            <Input
              type="email"
              placeholder="support@example.com"
              value={chatSupportEmail}
              onChange={(e) => setChatSupportEmail(e.target.value)}
              required
            />
          </FormControl>

          {/* Email Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={MdEmail} color="red.500" />
                Email Address
                <span style={{ color: "red" }}>*</span>
              </Flex>
            </FormLabel>
            <Input
              type="email"
              placeholder="contact@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          {/* Phone Number Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={BsTelephoneFill} color="green.500" />
                Phone Number
                <span style={{ color: "red" }}>*</span>
              </Flex>
            </FormLabel>
            <Input
              type="tel"
              placeholder="+201234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </FormControl>

          {/* WhatsApp Number Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={FaWhatsapp} color="green.500" />
                WhatsApp Number
                <span style={{ color: "red" }}>*</span>
              </Flex>
            </FormLabel>
            <Input
              type="tel"
              placeholder="+201234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
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
              onClick={handleSubmit}
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