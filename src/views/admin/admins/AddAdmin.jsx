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
} from '@chakra-ui/react';
import { ChevronDownIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import './admins.css';
import { useGetRolesQuery } from 'api/roleSlice';
import { useCreateUserMutation } from 'api/userSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
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
    setFormData({ ...formData, roleId: role.id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate role selection
    if (!formData.roleId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a role',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await createAdmin(formData).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin added successfully',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/undefined/admins'); // Redirect to the admins page after successful submission
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.data?.message || 'Failed to add admin',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Flex justify="center" p="20px" mt={'80px'}>
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          Add New Admin
        </Text>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Box mb="3">
            <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
              Name <span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              type="text"
              name="name"
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
              maxLength={14} // For formatted number like (123) 456-7890
            />
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
                  roles.data?.map((role) => (
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