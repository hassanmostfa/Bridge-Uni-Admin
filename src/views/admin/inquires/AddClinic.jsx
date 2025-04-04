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
import { FaUpload, FaTrash } from "react-icons/fa6"; // Import the trash icon
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AddClinic = () => {
  const [name, setName] = useState("");
  const [ar_name, setArName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locations, setLocations] = useState([{ en: "", ar: "" }]); // Updated to store en and ar locations
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [image, setImage] = useState(null);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const navigate = useNavigate();

  const handleCancel = () => {
    setName("");
    setArName("");
    setEmail("");
    setPassword("");
    setLocations([{ en: "", ar: "" }]); // Reset locations
    setFrom("");
    setTo("");
    setImage(null);
  };

  const handleSend = () => {
    const clinicData = {
      name,
      ar_name,
      email,
      password,
      locations,
      from,
      to,
      image,
    };
    console.log("Clinic Data:", clinicData);
    // You can send this data to an API or perform other actions
  };

  const handleAddLocation = () => {
    setLocations([...locations, { en: "", ar: "" }]); // Add a new location object
  };

  const handleLocationChange = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value; // Update the specific field (en or ar)
    setLocations(newLocations);
  };

  const handleDeleteLocation = (index) => {
    const newLocations = locations.filter((_, i) => i !== index); // Remove the location at the specified index
    setLocations(newLocations); // Update the state
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
            Add New Clinic
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
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* En Name Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                En-Name
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="name"
                placeholder="Enter Clinic Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>
            {/* Ar Name Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Ar-Name
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="text"
                id="name"
                placeholder="Enter Clinic Name"
                value={ar_name}
                onChange={(e) => setArName(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Email Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Email
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Password
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* From Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Opens From
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="time"
                id="from"
                placeholder="Enter Opening Time"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* To Field */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Opens To
                <span className="text-danger mx-1">*</span>
              </Text>
              <Input
                type="time"
                id="to"
                placeholder="Enter Closing Time"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                mt={"8px"}
              />
            </Box>

            {/* Locations Field */}
            <Box gridColumn="1 / -1">
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Locations
                <span className="text-danger mx-1">*</span>
              </Text>
              {locations.map((location, index) => (
                <Box key={index} mt={"8px"} mb={index < locations.length - 1 ? "8px" : "0"}>
                  <Flex align="center" gap={2}>
                    <Input
                      type="text"
                      placeholder={`Enter English Location ${index + 1}`}
                      value={location.en}
                      onChange={(e) => handleLocationChange(index, "en", e.target.value)}
                      required
                      flex="1"
                    />
                    <Input
                      type="text"
                      placeholder={`ادخل العنوان ${index + 1}`}
                      value={location.ar}
                      onChange={(e) => handleLocationChange(index, "ar", e.target.value)}
                      required
                      flex="1"
                    />
                    <Icon
                      as={FaTrash} // Use the trash icon from react-icons
                      w="30px"
                      h="35px"
                      color="red.500"
                      cursor="pointer"
                      onClick={() => handleDeleteLocation(index)} // Handle delete action
                      border={"1px solid #ddd"}
                      padding={"5px"}
                      borderRadius={"5px"}
                    />
                  </Flex>
                </Box>
              ))}
              <Button
                variant="outline"
                colorScheme="teal"
                size="sm"
                mt={2}
                onClick={handleAddLocation}
              >
                Add Another Location
              </Button>
            </Box>
          </Grid>
          {/* Action Buttons */}
          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="red" onClick={handleCancel} mr={2}>
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

export default AddClinic;