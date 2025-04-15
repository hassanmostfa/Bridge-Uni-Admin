import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
  Input,
  Box,
  Flex,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import './admins.css';
import { useGetRolesQuery } from 'api/roleSlice';
import { useCreateUserMutation } from 'api/userSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';

const AddAdmin = () => {
  const { data: roles, isLoading, isError } = useGetRolesQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const [selectedRole, setSelectedRole] = useState('Select a role');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role_id: '',
    password: '',
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelect = (role) => {
    setSelectedRole(role.name);
    setFormData({ ...formData, role_id: role.id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate role selection
    if (!formData.role_id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a role',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Validate password match
    // if (formData.password !== formData.confirmPassword) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Passwords do not match',
    //     confirmButtonText: 'OK',
    //   });
    //   return;
    // }

    // Validate password strength (optional)
    if (formData.password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password must be at least 8 characters long',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      // Create payload without confirmPassword
      // const { confirmPassword, ...payload } = formData;
      
      const response = await createAdmin(formData).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin added successfully',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/undefined/admins');
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.data?.context.error.errors[0].message || 'Failed to add admin',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Flex justify="center" p="20px" mt={'80px'}>
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <div className="mb-3 d-flex justify-content-between align-items-center">
                 <Text
                   color={textColor}
                   fontSize="22px"
                   fontWeight="700"
                   mb="20px !important"
                   lineHeight="100%"
                 >
                   Add New Admin
                 </Text>
                 <Button
                   type="button"
                   onClick={()=>navigate(-1)}
                   colorScheme="teal"
                   size="sm"
                   leftIcon={<IoMdArrowBack />}
                 >
                   Back
                 </Button>
               </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Name <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="text"
              name="username"
              placeholder="Enter Admin Name"
              value={formData.name}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              required
            />
          </Box>

          {/* Email Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Email <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              required
            />
          </Box>

          {/* Phone Field with Formatting */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Phone Number <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                handleInputChange({
                  target: {
                    name: 'phone',
                    value: rawValue
                  }
                });
              }}
              bg={inputBg}
              color={textColor}
              borderColor={inputBorder}
              required
              maxLength={14}
            />
          </Box>

          {/* Password Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Password <span style={{ color: 'red' }}>*</span>
            </Text>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
              />
              <InputRightElement>
                <Button
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>

         
          {/* Role Dropdown */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Role <span style={{ color: 'red' }}>*</span>
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                width="100%"
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="md"
                _hover={{ bg: 'gray.200' }}
                textAlign="left"
              >
                {selectedRole}
              </MenuButton>
              <MenuList width="100%">
                {isLoading ? (
                  <MenuItem>Loading...</MenuItem>
                ) : isError ? (
                  <MenuItem>Error fetching roles</MenuItem>
                ) : roles?.data?.length === 0 ? (
                  <MenuItem>No roles found</MenuItem>
                ) : (
                  roles.data?.data?.map((role) => (
                    <MenuItem
                      key={role.id}
                      onClick={() => handleSelect(role)}
                      _hover={{ bg: '#38487c', color: 'white' }}
                    >
                      {role.name}
                    </MenuItem>
                  ))
                )}
              </MenuList>
            </Menu>
          </Box>

          {/* Submit Button */}
          <Button
            mt={'20px'}
            variant="solid"
            colorScheme="brandScheme"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            type="submit"
            isLoading={isCreating}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddAdmin;