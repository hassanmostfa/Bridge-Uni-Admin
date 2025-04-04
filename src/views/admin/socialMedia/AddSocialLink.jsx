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
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import Swal from "sweetalert2";

const AddSocialLink = () => {
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!instagram && !facebook && !linkedin && !twitter) {
      Swal.fire("Error!", "Please add at least one social media link.", "error");
      return;
    }

    const socialData = {
      instagram,
      facebook,
      linkedin,
      twitter
    };

    try {
      // Here you would call your API to save the social media links
      console.log("Social Media Data:", socialData);
      Swal.fire("Success!", "Social media links saved successfully.", "success");
      navigate("/admin/social-media"); // Redirect to social media page
    } catch (error) {
      console.error("Failed to save social media links:", error);
      Swal.fire("Error!", "Failed to save social media links.", "error");
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
            Add Social Media Links
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
          {/* Instagram Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={FaInstagram} color="#E1306C" />
                Instagram URL
              </Flex>
            </FormLabel>
            <Input
              type="url"
              placeholder="https://instagram.com/username"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </FormControl>

          {/* Facebook Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={FaFacebook} color="#4267B2" />
                Facebook URL
              </Flex>
            </FormLabel>
            <Input
              type="url"
              placeholder="https://facebook.com/username"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </FormControl>

          {/* LinkedIn Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={FaLinkedin} color="#0077B5" />
                LinkedIn URL
              </Flex>
            </FormLabel>
            <Input
              type="url"
              placeholder="https://linkedin.com/username"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </FormControl>

          {/* Twitter Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              <Flex align="center" gap={2}>
                <Icon as={FaTwitter} color="#1DA1F2" />
                Twitter URL
              </Flex>
            </FormLabel>
            <Input
              type="url"
              placeholder="https://twitter.com/username"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </FormControl>

          {/* Action Buttons */}
          <Flex justify="flex-end" mt={6} gap={4}>
            <Button 
              variant="outline" 
              colorScheme="red" 
              onClick={() => navigate(-1)}
              width="120px"
            >
              Cancel
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
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

export default AddSocialLink;