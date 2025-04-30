import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
  Flex,
  Box,
  Input,
  Avatar,
  Badge,
  Divider,
  Skeleton,
  Stack,
  useToast,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronLeftIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useGetRolesQuery } from 'api/roleSlice';
import { useGetAdminsQuery, useUpdateUserMutation } from 'api/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue("white", "navy.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  // Fetch data
  const { data: adminsResponse, isLoading: isAdminsLoading,refetch } = useGetAdminsQuery();
  const { data: rolesResponse, isLoading: isRolesLoading } = useGetRolesQuery();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  },[]);
  
  // State management
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    role_id: null,
    password: '',
  });
  const [selectedRoleName, setSelectedRoleName] = useState('Select Role');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  // Find the admin from the fetched admins list
  const admin = adminsResponse?.data?.data?.find(a => a.id === parseInt(id));
  
  // Initialize form data when admin data is available
  useEffect(() => {
    if (admin && rolesResponse?.data) {
      // Find the primary role (assuming first permission is primary)
      const primaryRoleId = admin.admin_permissions?.[0]?.admin_role_id;
      const primaryRole = rolesResponse.data.data.find(r => r.id === primaryRoleId);

      setFormData({
        username: admin.username || '',
        phone: admin.phone || '',
        email: admin.email || '',
        role_id: primaryRoleId || null,
        password: '',
      });

      setSelectedRoleName(primaryRole?.name || 'Select Role');
    }
  }, [admin, rolesResponse]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role_id: role.id }));
    setSelectedRoleName(role.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.email || !formData.role_id) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill all required fields',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      // Prepare the data to send (only include password if it's not empty)
      const dataToSend = {
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        role_id: formData.role_id,
      };

      if (formData.password) {
        dataToSend.password = formData.password;
      }

      const response = await updateAdmin({ 
        id, 
        user: dataToSend 
      }).unwrap();

      toast({
        title: 'Success',
        description: 'Admin updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/admin/undefined/admins');
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'Failed to update admin';
      
      if (error.data?.context?.error?.errors[0]?.message) {
        errorMessage = error.data.context.error.errors[0].message;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
    }
  };

  if (isAdminsLoading || isRolesLoading) {
    return (
      <Flex justify="center" p="20px" mt="80px">
        <Stack spacing={4} w="100%">
          <Skeleton height="40px" />
          <Skeleton height="300px" />
        </Stack>
      </Flex>
    );
  }

  if (!admin) {
    return (
      <Flex justify="center" p="20px" mt="80px">
        <Text color="red.500">Admin not found</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" p="20px" mt="80px">
      <Flex align="center" mb="20px">
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)}
          mr="20px"
          aria-label="Go back"
        />
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Edit Admin
        </Text>
      </Flex>

      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Flex align="center" mb="6">
          <Avatar
            size="xl"
            name={admin.username}
            src={admin.avatar}
            mr="4"
          />
          <Box>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              {admin.username}
            </Text>
            <Badge
              colorScheme={admin.isBlocked === 'true' ? 'red' : 'green'}
              fontSize="sm"
              borderRadius="full"
              px="3"
              py="1"
            >
              {admin.isBlocked === 'true' ? 'Blocked' : 'Active'}
            </Badge>
          </Box>
        </Flex>

        <Divider mb="6" />

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Username <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="username"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </Box>

          {/* Email Field */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Email <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              type="email"
              name="email"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Box>

          {/* Phone Field */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Phone Number
            </Text>
            <Input
              name="phone"
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Box>

          {/* Password Field with show/hide toggle */}
          <Box mb="4">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Password
            </Text>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                placeholder="Enter new password (leave blank to keep current)"
                value={formData.password}
                onChange={handleInputChange}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          {/* Role Selection */}
          <Box mb="6">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Role <span style={{ color: "red" }}>*</span>
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                width="100%"
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="md"
                textAlign="left"
                _hover={{ bg: inputBg }}
                _active={{ bg: inputBg }}
              >
                {selectedRoleName}
              </MenuButton>
              <MenuList width="100%">
                {rolesResponse?.data?.data?.map((role) => (
                  <MenuItem 
                    key={role.id} 
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isUpdating}
            loadingText="Updating..."
            width="full"
          >
            Update Admin
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default EditAdmin;