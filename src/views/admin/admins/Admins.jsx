import {
  Box,
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Select,
  Avatar,
  Badge,
  Stack,
  Skeleton,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import Card from 'components/card/Card';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetAdminsQuery, useDeleteUserMutation } from 'api/userSlice';

const columnHelper = createColumnHelper();

const Admins = () => {
  const [page, setPage] = React.useState(1); // Current page
  const [limit, setLimit] = React.useState(10); // Items per page
  const [searchQuery, setSearchQuery] = React.useState(''); // Search query
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
  // Fetch admins data from API with pagination
  const { data: adminsResponse, isLoading, isError, refetch } = useGetAdminsQuery({
    page,
    limit,
    search: searchQuery,
  });
  
  const [deleteAdmin] = useDeleteUserMutation();

  // Extract admins data from response
  const admins = adminsResponse?.data?.data || [];
  const pagination = adminsResponse?.data || {
    totalItems: 0,
    totalPage: 0,
    currentPage: 0,
  };

  // Columns definition
  const columns = [
    columnHelper.accessor('username', {
      id: 'username',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Username
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" gap="2">
          <Avatar 
            size="sm" 
            name={info.getValue()} 
            src={info.row.original.avatar} 
          />
          <Text color={textColor} fontWeight="500">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Email
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('phone', {
      id: 'phone',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Phone
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue() || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor('admin_permissions', {
      id: 'role',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Role
        </Text>
      ),
      cell: (info) => {
        const roles = info.getValue();
        const primaryRole = roles[0]?.admin_role?.name || 'No Role';
        return (
          <Text color={textColor}>
            {primaryRole}
            {roles.length > 1 && ` +${roles.length - 1}`}
          </Text>
        );
      },
    }),
    columnHelper.accessor('isBlocked', {
      id: 'status',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Status
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme={info.getValue() === 'true' ? 'red' : 'green'} 
          fontSize="sm" 
          borderRadius="full"
          px="3"
          py="1"
        >
          {info.getValue() === 'true' ? 'Blocked' : 'Active'}
        </Badge>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'actions',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Actions
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" gap="2">
          <IconButton
            aria-label="View admin"
            icon={<FaEye />}
            size="lg"
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate(`/admin/admin/details/${info.getValue()}`)}
          />
          <IconButton
            aria-label="Edit admin"
            icon={<EditIcon />}
            size="lg"
            variant="ghost"
            colorScheme="green"
            onClick={() => navigate(`/admin/edit-admin/${info.getValue()}`)}
          />
          <IconButton
            aria-label="Delete admin"
            icon={<FaTrash />}
            size="lg"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeleteAdmin(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  // Table instance
  const table = useReactTable({
    data: admins,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  // Delete function
  const handleDeleteAdmin = async (id) => {
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
        await refetch();
        Swal.fire('Deleted!', 'The admin has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
      Swal.fire('Error!', error.data?.message || 'Failed to delete the admin.', 'error');
    }
  };

  // Pagination controls
  const handleNextPage = () => {
    if (page < pagination.totalPage) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to the first page when changing the limit
  };

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page when searching
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (isLoading) {
    return (
         <Flex justify="center" p="20px" mt="80px">
           <Stack spacing={4} w="100%">
             <Skeleton height="40px" />
             <Skeleton height="300px" />
           </Stack>
         </Flex>
       );
  }

  if (isError) {
    return <div>Error loading admins</div>;
  }

  return (
    <div className="container">
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Admins Management
          </Text>
          <Flex gap="4" align="center">
            <InputGroup w={{ base: "100%", md: "300px" }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="full"
              />
            </InputGroup>
            <Button
              variant='darkBrand'
              color='white'
              fontSize='sm'
              fontWeight='500'
              borderRadius='70px'
              px='24px'
              py='5px'
              onClick={() => navigate('/admin/add-admin')}
              leftIcon={<PlusSquareIcon />}
            >
              Add Admin
            </Button>
          </Flex>
        </Flex>
        
        <Box overflowX="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: '14px' }}
                          minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination Controls */}
        <Flex justifyContent="space-between" alignItems="center" px="25px" py="10px">
          <Flex alignItems="center">
            <Text color={textColor} fontSize="sm" mr="10px">
              Rows per page:
            </Text>
            <Select
              value={limit}
              onChange={handleLimitChange}
              width="100px"
              size="sm"
              variant="outline"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
              _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </Flex>
          <Text color={textColor} fontSize="sm">
            Page {pagination.currentPage} of {pagination.totalPage}
          </Text>
          <Flex>
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1}
              variant="outline"
              size="sm"
              mr="10px"
            >
              <Icon as={ChevronLeftIcon} mr="5px" />
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={page === pagination.totalPage}
              variant="outline"
              size="sm"
            >
              Next
              <Icon as={ChevronRightIcon} ml="5px" />
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default Admins;