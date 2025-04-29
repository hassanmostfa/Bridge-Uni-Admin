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
  SimpleGrid,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { 
  FaInstagram, 
  FaFacebook, 
  FaLinkedin, 
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaSnapchatGhost,
  FaTiktok,
  FaPhone,
  FaGooglePlay,
  FaAppStore
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useGetAllSocialQuery, useAddSocialMutation } from "../../../api/socials";

const SocialMedia = () => {
  const [socialData, setSocialData] = useState({
    facebook: "",
    instagram: "",
    linked_in: "",
    twitter: "",
    whatsapp: "",
    telegram: "",
    snapchat: "",
    tiktok: "",
    call_us: "",
    play_store: "",
    app_store: ""
  });
  
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  // Fetch existing social media links
  const { 
    data: responseData, 
    isLoading, 
    isError,
    refetch
  } = useGetAllSocialQuery();
  
  const [addSocial, { isLoading: isSaving }] = useAddSocialMutation();

  // Set initial values from API response
  useEffect(() => {
    if (responseData?.flag && responseData.data) {
      setSocialData({
        facebook: responseData.data.facebook || "",
        instagram: responseData.data.instagram || "",
        linked_in: responseData.data.linked_in || "",
        twitter: responseData.data.twitter || "",
      });
    }
  }, [responseData]);

  const handleChange = (field, value) => {
    setSocialData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await addSocial(socialData).unwrap();
      Swal.fire("Success!", "Social media links saved successfully.", "success");
      refetch();
      navigate("/admin/undefined/cms/socials");
    } catch (error) {
      console.error("Failed to save social media links:", error);
      Swal.fire("Error!", "Failed to save social media links.", "error");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading social media data</div>;

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
            Social Media Links
          </Text>
        </div>
        <form>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
            {/* Facebook */}
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
                value={socialData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
              />
            </FormControl>

            {/* Instagram */}
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
                value={socialData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
              />
            </FormControl>

            {/* LinkedIn */}
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
                value={socialData.linked_in}
                onChange={(e) => handleChange('linked_in', e.target.value)}
              />
            </FormControl>

            {/* Twitter */}
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
                value={socialData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

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
              isLoading={isSaving}
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default SocialMedia;