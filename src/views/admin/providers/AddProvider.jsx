import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Textarea,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaUpload, FaTrash } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddProvider = () => {
  const [providerNameAr, setProviderNameAr] = useState("");
  const [providerNameEn, setProviderNameEn] = useState("");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const navigate = useNavigate();

  const handleCancel = () => {
    setProviderNameAr("");
    setProviderNameEn("");
  };

  const handleSend = () => {
    const providerData = {
      provider_name_ar: providerNameAr,
      provider_name_en: providerNameEn,
    };
    console.log("Provider Data:", providerData);
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
            Add New Provider
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
          {/* Grid Layout for Inputs */}
          <Grid templateColumns="repeat(1, 1fr)" gap={6}>
            {/* Provider Name (Arabic) Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Provider Name (Arabic)
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="provider_name_ar"
                placeholder="Enter Provider Name in Arabic"
                value={providerNameAr}
                onChange={(e) => setProviderNameAr(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Provider Name (English) Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Provider Name (English)
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="provider_name_en"
                placeholder="Enter Provider Name in English"
                value={providerNameEn}
                onChange={(e) => setProviderNameEn(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="red" onClick={handleCancel} mr={2}>
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
              onClick={handleSend}
            >
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddProvider;