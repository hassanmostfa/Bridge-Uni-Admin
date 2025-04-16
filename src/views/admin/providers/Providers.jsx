import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  Select
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AddIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetAllProviderQuery, useDeleteProviderMutation } from 'api/providerSlice';
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

const Providers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'navy.700');
  const tableBg = useColorModeValue('gray.50', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const { 
    data: providersResponse, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAllProviderQuery({ 
    page, 
    limit, 
    search: searchQuery 
  });
  useEffect(()=>{
    refetch();
  },[]);
  const [deleteProvider, { isLoading: isDeleting }] = useDeleteProviderMutation();

  const providers = providersResponse?.data?.data || [];
  const pagination = providersResponse?.data || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  };

  const handleDeleteProvider = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Provider',
        text: 'Are you sure you want to delete this provider?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        await deleteProvider(id).unwrap();
        await refetch();
        
        toast({
          title: 'Success',
          description: 'Provider deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to delete provider',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
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
    setPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          ID
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontWeight="500">
          {info.getValue()}
        </Text>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('title_ar', {
      id: 'provider_name_ar',
      header: () => (
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          Provider (Arabic)
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} >
          {info.getValue()}
        </Text>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('title_en', {
      id: 'provider_name_en',
      header: () => (
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          Provider (English)
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('id', {
      id: 'actions',
      header: () => (
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          Actions
        </Text>
      ),
      cell: (info) => (
        <Flex gap="2">
          {/* <IconButton
            aria-label="View provider"
            icon={<FaEye size={14} />}
            size="sm"
            // variant="outline"
            colorScheme="blue"
            onClick={() => navigate(`/admin/providers/${info.getValue()}`)}
          /> */}
          <IconButton
            aria-label="Edit provider"
            icon={<EditIcon size={14} />}
            size="lg"
            // variant="outline"
            color="green"
            onClick={() => navigate(`/admin/edit-provider/${info.getValue()}`)}
          />
          <IconButton
            aria-label="Delete provider"
            icon={<FaTrash size={14} />}
            size="lg"
            // variant="outline"
            color="red"
            onClick={() => handleDeleteProvider(info.getValue())}
            isLoading={isDeleting}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: providers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  if (isLoading) {
    return (
      <Box p="20px">
        <Stack spacing={4}>
          <Skeleton height="40px" />
          <Skeleton height="300px" />
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" p="20px" color="red.500">
        Error loading providers
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} className='container'>
      <Card bg={cardBg} borderRadius="lg" boxShadow="sm" overflow="hidden">
        <Flex
          p={4}
          borderBottomWidth="1px"
          align="center"
          justify="space-between"
          flexWrap="wrap"
          gap={4}
        >
          <Heading size="md" color={textColor}>
            Providers Management
          </Heading>
          
          <Flex gap={3} flexWrap="wrap">
            {/* <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="md"
              />
            </InputGroup> */}
            
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              width={'200px'}
              onClick={() => navigate('/admin/add-provider')}
            >
              Add Provider
            </Button>
          </Flex>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px" >
            <Thead >
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      py={3}
                      px={4}
                      borderColor={borderColor}
                      cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex align="center" gap={1}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} py={3} px={4}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {providers.length === 0 && !isLoading && (
          <Box p={6} textAlign="center">
            <Text color="gray.500">No providers found</Text>
            {searchQuery && (
              <Button
                mt={2}
                variant="link"
                colorScheme="blue"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </Box>
        )}

        <Flex
          p={4}
          borderTopWidth="1px"
          align="center"
          justify="space-between"
          flexWrap="wrap"
          gap={4}
        >
          <Flex align="center">
            <Text fontSize="sm" color="gray.500" mr={2}>
              Rows per page:
            </Text>
            <Select
              value={limit}
              onChange={handleLimitChange}
              size="sm"
              width="100px"
              borderRadius="md"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </Flex>
          
          <Text fontSize="sm" color="gray.500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          
          <Flex gap={2}>
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1}
              leftIcon={<ChevronLeftIcon />}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={page === pagination.totalPages || pagination.totalPages === 0}
              rightIcon={<ChevronRightIcon />}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};

export default Providers;