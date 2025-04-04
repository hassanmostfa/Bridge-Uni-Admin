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

const AddPositions = () => {
  const [enPosition, setEnPosition] = useState("");
  const [arPosition, setArPosition] = useState("");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  const handleCancel = () => {
    setEnPosition("");
    setArPosition("");
  };

  const handleSubmit = () => {
    const positionData = {
      enPosition,
      arPosition,
    };
    console.log("Position Data:", positionData);
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
            Add New Position
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
          {/* English Position Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Position Title (English)
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              type="text"
              placeholder="Enter position title in English"
              value={enPosition}
              onChange={(e) => setEnPosition(e.target.value)}
              required
            />
          </FormControl>

          {/* Arabic Position Field */}
          <FormControl mb={4}>
            <FormLabel color={textColor} fontSize="sm" fontWeight="700">
              Position Title (Arabic)
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              type="text"
              placeholder="أدخل المسمى الوظيفي بالعربية"
              value={arPosition}
              onChange={(e) => setArPosition(e.target.value)}
              dir="rtl"
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

export default AddPositions;