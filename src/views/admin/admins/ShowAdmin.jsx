import React, { useState, useEffect } from "react";
import {
  Text,
  useColorModeValue,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Avatar,
  Badge,
  Heading,
  Divider,
  Skeleton,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAdminsQuery } from "api/userSlice";
import { useGetRolesQuery } from "api/roleSlice";
import { ChevronLeftIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Swal from "sweetalert2";
import { useDeleteUserMutation } from "api/userSlice";

const ShowAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteAdmin] = useDeleteUserMutation();

  // Fetch all admins and filter by ID
  const { data: adminsResponse, isLoading, isError, refetch } = useGetAdminsQuery();
  const { data: rolesResponse } = useGetRolesQuery();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const tableBg = useColorModeValue("white", "navy.700");
  const tableTextColor = useColorModeValue("gray.700", "white");

  // Find the specific admin from the list
  const admin = adminsResponse?.data?.data?.find(admin => admin.id === parseInt(id));

  // Handle delete action
  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteAdmin(id).unwrap();
        Swal.fire('Deleted!', 'The admin has been deleted.', 'success');
        navigate('/admin/undefined/admins');
      }
    } catch (error) {
      Swal.fire('Error!', error.data?.message || 'Failed to delete admin.', 'error');
    }
  };

  if (isLoading) {
    return (
      <Box p="20px" mt="80px">
        <Stack spacing={4}>
          <Skeleton height="40px" />
          <Skeleton height="300px" />
        </Stack>
      </Box>
    );
  }

  if (isError || !admin) {
    return (
      <Box textAlign="center" p="20px" mt="80px" color="red.500">
        Error loading admin data or admin not found
      </Box>
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
        <Heading size="lg" color={textColor}>
          Admin Details
        </Heading>
      </Flex>

      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Flex justify="space-between" align="center" mb="6">
          <Flex align="center">
            <Avatar
              size="xl"
              name={admin.username}
              src={admin.avatar}
              mr="4"
            />
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
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
          <Flex>
            <IconButton
              icon={<EditIcon />}
              onClick={() => navigate(`/admin/edit-admin/${admin.id}`)}
              colorScheme="blue"
              aria-label="Edit admin"
              mr="2"
            />
            <IconButton
              icon={<DeleteIcon />} // Replace with delete icon if available
              onClick={handleDelete}
              colorScheme="red"
              aria-label="Delete admin"
            />
          </Flex>
        </Flex>

        <Divider mb="6" />

        <Table variant="simple" mb="6">
          <Tbody>
            <Tr>
              <Th w="30%">Email</Th>
              <Td>{admin.email || 'N/A'}</Td>
            </Tr>
            <Tr>
              <Th w="30%">Phone</Th>
              <Td>{admin.phone || 'N/A'}</Td>
            </Tr>
            <Tr>
              <Th w="30%">Roles</Th>
              <Td>
                {admin.admin_permissions?.length > 0 ? (
                  admin.admin_permissions.map((perm, index) => (
                    <Badge key={index} mr="2" colorScheme="purple">
                      {perm.admin_role?.name}
                    </Badge>
                  ))
                ) : (
                  'No roles assigned'
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default ShowAdmin;