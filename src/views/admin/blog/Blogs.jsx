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
  Image,
  Badge
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
import { EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import { FaTrash } from 'react-icons/fa6';
import { IoIosSend } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useGetBlogsQuery, useDeleteBlogMutation } from '../../../api/blogs';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const Blogs = () => {
  const [page, setPage] = React.useState(0); // Current page (0-indexed)
  const [limit, setLimit] = React.useState(10); // Items per page
  const [searchQuery, setSearchQuery] = React.useState(''); // Search query
  const { data: blogsResponse, refetch, isError, isLoading } = useGetBlogsQuery({ page, limit });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Extract table data and pagination info from API response
  const tableData = blogsResponse?.data?.data || [];
  const pagination = {
    page: blogsResponse?.data?.currentPage || 0,
    limit: limit,
    totalItems: blogsResponse?.data?.totalItems || 0,
    totalPages: blogsResponse?.data?.totalPages || 1,
  };

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return tableData;
    return tableData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [tableData, searchQuery]);

  React.useEffect(() => {
    refetch();
  }, [page, limit]);

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
        await deleteBlog(id).unwrap();
        refetch();
        Swal.fire('Deleted!', 'The blog has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      Swal.fire('Error!', 'Failed to delete the blog.', 'error');
    }
  };

  // Transform API data into table data format
  const transformedData = React.useMemo(() => {
    return filteredData.map((blog, index) => ({
      id: blog.id,
      image: blog.image, // Add image to transformed data
      en_title: blog.title_en || 'N/A',
      ar_title: blog.title_ar || 'N/A',
      en_description: blog.description_en || 'N/A',
      ar_description: blog.description_ar || 'N/A',
      date: blog.date || blog.createdAt || 'N/A',
      blog_tags: blog.blog_tags?.map(tag => tag.name).join(', ') || 'No tags',
    }));
  }, [filteredData]);

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
          Image
        </Text>
      ),
      cell: (info) => (
        <Image
          src={info.getValue()}
          alt="Blog image"
          width="100px"
          objectFit="cover"
          borderRadius="md"
          fallbackSrc="https://via.placeholder.com/50"
        />
      ),
    }),
    columnHelper.accessor('en_title', {
      id: 'en_title',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          EN Title
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('ar_title', {
      id: 'ar_title',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          AR Title
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} dir="rtl">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('date', {
      id: 'date',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Date
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {new Date(info.getValue()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      ),
    }),
    columnHelper.accessor('en_description', {
      id: 'en_description',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          EN Description
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue().length > 30 
            ? `${info.getValue().substring(0, 30)}...` 
            : info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('ar_description', {
      id: 'ar_description',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          AR Description
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} dir="rtl">
          {info.getValue().length > 20 
            ? `${info.getValue().substring(0, 20)}...` 
            : info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('blog_tags', {
      id: 'blog_tags',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Tags
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          <Badge colorScheme="green">{info.getValue()}</Badge>
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
            onClick={() => navigate(`/admin/cms/edit-blog/${info.getValue()}`)}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: transformedData,
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
    if (pagination.page < pagination.totalPages - 1) {
      setPage(pagination.page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 0) {
      setPage(pagination.page - 1);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(0); // Reset to first page when changing limit
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading blogs</Text>;

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
            Blogs
          </Text>
          <div className="search-container d-flex align-items-center gap-2">
            <InputGroup w={{ base: "100", md: "400px" }}>
              <InputLeftElement>
                <IconButton
                  bg="inherit"
                  borderRadius="inherit"
                  _hover="none"
                  _active={{
                    bg: "inherit",
                    transform: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  icon={<SearchIcon w="15px" h="15px" />}
                />
              </InputLeftElement>
              <Input
                variant="search"
                fontSize="sm"
                bg="secondaryGray.300"
                color="gray.700"
                fontWeight="500"
                _placeholder={{ color: "gray.400", fontSize: "14px" }}
                borderRadius="30px"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => navigate('/admin/add-blog')}
            width={'200px'}
          >
            <PlusSquareIcon me="10px" />
            Add Article
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
            Page {pagination.page + 1} of {pagination.totalPages}
          </Text>
          <Flex>
            <Button
              onClick={handlePreviousPage}
              disabled={pagination.page === 0}
              variant="outline"
              size="sm"
              mr="10px"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={pagination.page === pagination.totalPages - 1}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default Blogs;