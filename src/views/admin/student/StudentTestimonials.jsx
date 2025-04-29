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
  Select,
  Badge,
  Image,
  Spinner,
  useToast,
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
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, PlusSquareIcon, StarIcon } from '@chakra-ui/icons';
import { FaEye, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetAllStudentTestimonialsQuery, useDeleteStudentTestimonialMutation } from "../../../api/studentTestimonials";

const columnHelper = createColumnHelper();

const StudentTestimonials = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // API Calls
  const { 
    data: testimonialsData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAllStudentTestimonialsQuery({ page: page - 1, limit });
  
     // Trigger refetch when component mounts (navigates to)
     React.useEffect(() => {
      // Only trigger refetch if the data is not being loaded
      if (!isLoading) {
        refetch(); // Manually trigger refetch when component is mounted
      }
    }, [refetch, isLoading]); // Dependency array to ensure it only runs on mount
  const [deleteTestimonial] = useDeleteStudentTestimonialMutation();

  // Transform API data to match our table structure
  const testimonials = testimonialsData?.data?.data || [];
  const totalItems = testimonialsData?.data?.totalItems || 0;
  const totalPages = testimonialsData?.data?.totalPages || 1;

  // Handle delete testimonial
  const handleDelete = async (id) => {
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
        const response = await deleteTestimonial(id).unwrap();
        
        if (response.flag) {
          toast({
            title: 'Success',
            description: response.message || 'Testimonial deleted successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          refetch();
        } else {
          throw new Error(response.message || 'Failed to delete testimonial');
        }
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete the testimonial',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ID
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor}>{info.getValue()}</Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('image', {
      id: 'image',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Photo
        </Text>
      ),
      cell: (info) => (
        <Image
          src={info.getValue()}
          alt="Student"
          w={'70px'}
          h={'30px'}
          borderRadius="full"
          objectFit={'cover'}
        />
      ),
    }),
    columnHelper.accessor('student_name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Student Name
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('title', {
      id: 'title',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Title
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('rate', {
      id: 'stars',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Rating
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              color={i < info.getValue() ? 'yellow.400' : 'gray.300'}
              boxSize={4}
              mr={1}
            />
          ))}
          <Badge ml={2} colorScheme="green">
            {info.getValue()}.0
          </Badge>
        </Flex>
      ),
    }),
    columnHelper.accessor('testimonial', {
      id: 'description',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Testimonial
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} noOfLines={2}>
          {info.getValue()}
        </Text>
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
        <Flex align="center">
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDelete(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/cms/edit-student-testimonial/${info.getValue()}`)}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: testimonials,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  // Pagination controls
  const handleNextPage = () => {
    if (page < totalPages) {
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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">Error loading testimonials</Text>
      </Flex>
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
            Student Testimonials
          </Text>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            width={'200px'}
            onClick={() => navigate('/admin/add-testimonial')}
          >
            <PlusSquareIcon me="10px" />
            Add Testimonial
          </Button>
        </Flex>
        <Box>
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
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </Flex>
          <Text color={textColor} fontSize="sm">
            Page {page} of {totalPages}
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
              disabled={page === totalPages}
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

export default StudentTestimonials;