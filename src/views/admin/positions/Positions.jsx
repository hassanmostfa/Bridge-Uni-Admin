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
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Select,
  Skeleton,
  Stack,
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
import { useGetAllPositionsQuery, useDeletePositionMutation } from 'api/positionSlice';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Positions = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Fetch positions data with pagination and search
  const { data: positionsResponse, isLoading, isError, refetch } = useGetAllPositionsQuery({
    page,
    limit,
    search: searchQuery,
  });

  const [deletePosition, { isLoading: isDeleting }] = useDeletePositionMutation();

  // Extract positions and pagination info from response
  const positions = positionsResponse?.data?.data || [];
  const pagination = positionsResponse?.data || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  };

  const handleDeletePosition = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Position',
        text: 'Are you sure you want to delete this position?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await deletePosition(id).unwrap();
        await refetch();
        toast({
          title: 'Success',
          description: 'Position deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to delete position',
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

  React.useEffect(() => {
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
    }),
    columnHelper.accessor('title_en', {
      id: 'title_en',
      header: () => (
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          Position (English)
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('title_ar', {
      id: 'title_ar',
      header: () => (
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          Position (Arabic)
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} dir="">
          {info.getValue()}
        </Text>
      ),
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
            aria-label="View position"
            icon={<FaEye size={14} />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate(`/admin/cms/view-position/${info.getValue()}`)}
          /> */}
          <IconButton
            aria-label="Edit position"
            icon={<EditIcon size={14} />}
            size="sm"
            variant="ghost"
            colorScheme="green"
            onClick={() => navigate(`/admin/cms/edit-position/${info.getValue()}`)}
          />
          <IconButton
            aria-label="Delete position"
            icon={<FaTrash size={14} />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeletePosition(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: positions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        Error loading positions
      </Box>
    );
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
            Positions Management
          </Text>
          <Flex gap={3}>
            {/* <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search positions..."
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
              onClick={() => navigate('/admin/cms/add-position')}
              leftIcon={<PlusSquareIcon />}
            >
              Add Position
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

        <Flex
          justifyContent="space-between"
          alignItems="center"
          px="25px"
          py="10px"
        >
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
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </Flex>
          <Text color={textColor} fontSize="sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          <Flex>
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1}
              variant="outline"
              size="sm"
              mr="10px"
              leftIcon={<ChevronLeftIcon />}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={page === pagination.totalPages}
              variant="outline"
              size="sm"
              rightIcon={<ChevronRightIcon />}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default Positions;