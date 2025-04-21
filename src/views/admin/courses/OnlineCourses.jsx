import React, { useCallback, useEffect, useState } from "react";
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
  useToast,
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
import { useGetAllOnlineCourcesQuery } from "api/onlineCourseSlice";
import { useDeleteCourseMutation } from "api/onlineCourseSlice";
import Swal from "sweetalert2";

const columnHelper = createColumnHelper();

const OnlineCourses = () => {
  const { data: coursesData, isLoading, isError, refetch } = useGetAllOnlineCourcesQuery();
  // const [updateFeatured] = useUpdateCourseFeaturedMutation();
  // useEffect(() => {
  //   refetch();
  // },[]);
  const [deleteCourse] = useDeleteCourseMutation();
  const navigate = useNavigate();
  const toast = useToast();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [deletingId, setDeletingId] = useState(null); // Add this line

  // Delete course - properly memoized
  const handleDelete = async (id) => {
    // try {
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
        setDeletingId(id); // Set deleting state
        await deleteCourse(id).unwrap();
        refetch(); // Wait for refetch to complete
        Swal.fire('Deleted!', 'The Delete non done Yet!.', 'success');
      }
    // } catch (error) {
    //   console.error('Failed to delete Course:', error);
    //   Swal.fire('Error!', 'Failed to delete the Course.', 'error');
    // } finally {
    //   setDeletingId(null); // Reset deleting state
    // }
  // }, [deleteCourse, refetch]);
  };


// Memoized format function
const formatTableData = (coursesData) => {
  if (!coursesData?.data?.data) return [];
  
  return coursesData.data.data.map(course => ({
    id: course.id,
    title_en: course.title_en,
    title_ar: course.title_ar,
    provider: course.provider?.title_en || 'N/A',
    category: course.category?.title_en || 'N/A',
    featured: course.featured_course,
    coming_soon: course.coming_soon,
    image: course.image,
    originalData: course
  }));
};

const columns = React.useMemo(() => [
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
          // fallbackSrc="https://via.placeholder.com/80x45"
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
    columnHelper.accessor("featured", {
      id: "featured",
      header: () => <Text color="gray.400">Featured</Text>,
      cell: (info) => (
        <Switch
          colorScheme="teal"
          isChecked={info.getValue()}
          // onChange={() => toggleFeatured(info.row.original.id, info.getValue())}
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
            onClick={() => navigate(`/admin/show-online-course/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-online-course/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            onClick={
              deletingId === info.row.original.id 
                ? undefined 
                : () => handleDelete(info.row.original.id)
            }
          />
        </Flex>
      ),
    }),
  ], [textColor]);

  const tableData = React.useMemo(() => formatTableData(coursesData), [coursesData]);
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="container">
        <Card flexDirection="column" w="100%" px="0px">
          <Flex align="center" justify="center" py="10">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text fontWeight="500" fontSize="20px" ml="3">
              Loading courses...
            </Text>
          </Flex>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <Card flexDirection="column" w="100%" px="0px">
          <Text color="red.500">Error loading courses</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Online Courses
          </Text>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => navigate("/admin/add-online-course")}
            width={"200px"}
          >
            <PlusSquareIcon me="10px" />
            Add Course
          </Button>
        </Flex>
        <Box>
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} borderColor="transparent">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center">
                    No courses found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </div>
  );
};

export default OnlineCourses;