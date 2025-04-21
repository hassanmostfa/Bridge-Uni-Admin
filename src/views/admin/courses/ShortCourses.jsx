import React, { useState } from "react";
import {
  Box,
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
  Switch,
  Button,
  Badge,
  Image,
  Spinner,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaEye, FaTrash } from "react-icons/fa6";
import { EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { useNavigate } from "react-router-dom";
import { useGetAllShortCourcesQuery } from "api/shortCourcesSlice";
import { useDeleteShortCourseMutation } from "api/shortCourcesSlice";
import Swal from "sweetalert2";

const columnHelper = createColumnHelper();

const ShortCourses = () => {
  const navigate = useNavigate();
  const { data: apiData,refetch, isLoading } = useGetAllShortCourcesQuery();
  const [deleteCourse] = useDeleteShortCourseMutation();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // React.useEffect(() => {
  //   refetch();
  // }, []);
  // Transform API data to match our table structure
  const transformData = (apiData) => {
    if (!apiData?.data?.data) return [];
    
    return apiData.data.data.map(course => ({
      id: course.id,
      title_en: course.title_en,
      title_ar: course.title_ar,
      provider: course.provider?.title_en || "N/A",
      category: course.category?.title_en || "N/A",
      price: course.price,
      duration: `${course.duration} Weeks`,
      start_date: new Date(course.start_date).toLocaleDateString(),
      end_date: new Date(course.end_date).toLocaleDateString(),
      brochure: course.brochure,
      featured: course.featured_course,
      image: course.image,
      originalData: course // Keep original data for reference
    }));
  };

  // Toggle featured status - you'll need to implement API call here
  const toggleFeatured = async (id) => {
    // Implement API call to update featured status
    console.log("Toggle featured for course:", id);
  };

  // Delete course - you'll need to implement API call here
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
           await deleteCourse(id).unwrap();
           refetch();
           Swal.fire('Deleted!', 'The Short Course has been deleted.', 'success');
         }
       } catch (error) {
         console.error('Failed to delete category:', error);
         Swal.fire('Error!', 'Failed to delete the Short Course.', 'error');
       }
  };

  const columns =  React.useMemo(() => [
    columnHelper.accessor("id", {
      id: "id",
      header: () => <Text color="gray.400">ID</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("image", {
      id: "image",
      header: () => <Text color="gray.400">Image</Text>,
      cell: (info) => (
        <Image
          src={info.getValue()}
          w="80px"
          h="45px"
          borderRadius="md"
          objectFit="cover"
          alt="Course thumbnail"
        />
      ),
    }),
    columnHelper.accessor("title_en", {
      id: "title_en",
      header: () => <Text color="gray.400">Course (EN)</Text>,
      cell: (info) => <Text fontWeight="500">{info.getValue()}</Text>,
    }),
    columnHelper.accessor("title_ar", {
      id: "title_ar",
      header: () => <Text color="gray.400">Course (AR)</Text>,
      cell: (info) => (
        <Text dir="rtl" fontFamily="Tahoma">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("provider", {
      id: "provider",
      header: () => <Text color="gray.400">Provider</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("category", {
      id: "category",
      header: () => <Text color="gray.400">Category</Text>,
      cell: (info) => (
        <Badge colorScheme="purple" px="2" py="1" borderRadius="6px">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("price", {
      id: "price",
      header: () => <Text color="gray.400">Price (KWD)</Text>,
      cell: (info) => <Text>{info.getValue().toFixed(3)}</Text>,
    }),
    columnHelper.accessor("duration", {
      id: "duration",
      header: () => <Text color="gray.400">Duration</Text>,
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("start_date", {
      id: "start_date",
      header: () => <Text color="gray.400">Start Date</Text>,
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("featured", {
      id: "featured",
      header: () => <Text color="gray.400">Featured</Text>,
      cell: (info) => (
        <Switch
          colorScheme="teal"
          isChecked={info.getValue()}
          onChange={() => toggleFeatured(info.row.original.id)}
        />
      ),
    }),
    columnHelper.accessor("coming_soon", {
      id: "coming_soon",
      header: () => <Text color="gray.400">Comming Soon</Text>,
      cell: (info) => (
        <Switch
          colorScheme="teal"
          isChecked={info.getValue()}
          // onChange={() => toggleFeatured(info.row.original.id, info.getValue())}
        />
      ),
    }),
    columnHelper.accessor("actions", {
      id: "actions",
      header: () => <Text color="gray.400">Actions</Text>,
      cell: (info) => (
        <Flex>
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            onClick={() => navigate(`/admin/show-short-course/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-short-course/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={() => handleDelete(info.row.original.id)}
          />
        </Flex>
      ),
    }),
  ], [textColor]);

  const tableData = React.useMemo(() => transformData(apiData), [apiData]);
  
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <div className="container">
      <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Short Courses
          </Text>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => navigate("/admin/add-short-course")}
            width={"200px"}
          >
            <PlusSquareIcon me="10px" />
            Add Course
          </Button>
        </Flex>
        <Box>
          {tableData.length === 0 ? (
            <Text textAlign="center" py={10}>No courses found</Text>
          ) : (
            <Table variant="simple" color="gray.500" mb="24px" mt="12px">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id} borderColor={borderColor}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} borderColor="transparent">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default ShortCourses;