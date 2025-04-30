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
  useToast,
  Tooltip,
  Skeleton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaEye, FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { useNavigate } from "react-router-dom";
import { useGetAllAbroadCourcesQuery } from "api/studyAbroadSlice";
import { useDeleteAbroadCourseMutation } from "api/studyAbroadSlice";
import Swal from "sweetalert2";

const columnHelper = createColumnHelper();

const StudyAbroad = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetAllAbroadCourcesQuery();
  // const [updateFeatured] = useUpdateCourseFeaturedMutation();
  const [deleteCourse] = useDeleteAbroadCourseMutation();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const hoverColor = useColorModeValue("gray.100", "whiteAlpha.200");

  // Toggle featured status
  const toggleFeatured = async (id, currentStatus) => {
    try {
      // await updateFeatured({ id, featured: !currentStatus }).unwrap();
      // refetch();
      // toast({
      //   title: "Status Updated",
      //   description: "Program featured status has been updated",
      //   status: "success",
      //   duration: 3000,
      //   isClosable: true,
      // });
    } catch (err) {
      console.error("Failed to update featured status:", err);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Delete program
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await deleteCourse(id).unwrap();
        refetch();
        Swal.fire(
          'Deleted!',
          'The study abroad program has been deleted.',
          'success'
        );
      } catch (err) {
        console.error("Failed to delete program:", err);
        Swal.fire(
          'Error!',
          'Failed to delete program',
          'error'
        );
      }
    }
  };

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => <Text color="gray.400">ID</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      size: 80,
    }),
    columnHelper.accessor("main_image", {
      id: "image",
      header: () => <Text color="gray.400">Image</Text>,
      cell: (info) => (
        <Image
          src={info.getValue()}
          w="80px"
          h="45px"
          borderRadius="md"
          objectFit="cover"
          alt="Study abroad thumbnail"
          fallbackSrc="https://via.placeholder.com/80x45"
        />
      ),
      size: 100,
    }),
    columnHelper.accessor("title_en", {
      id: "title_en",
      header: () => <Text color="gray.400">Destination (EN)</Text>,
      cell: (info) => (
        <Text fontWeight="500" noOfLines={1}>
          {info.getValue()}
        </Text>
      ),
      size: 150,
    }),
    columnHelper.accessor("title_ar", {
      id: "title_ar",
      header: () => <Text color="gray.400">Destination (AR)</Text>,
      cell: (info) => (
        <Text dir="rtl" fontFamily="Tahoma" noOfLines={1}>
          {info.getValue()}
        </Text>
      ),
      size: 150,
    }),
    columnHelper.accessor("number_of_universities", {
      id: "universities",
      header: () => <Text color="gray.400">Universities</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      size: 100,
    }),
    columnHelper.accessor("number_of_majors", {
      id: "majors",
      header: () => <Text color="gray.400">Majors</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
      size: 100,
    }),
    columnHelper.accessor("universities", {
      id: "top_universities",
      header: () => <Text color="gray.400">Top Universities</Text>,
      cell: (info) => (
        <Tooltip 
          label={info.getValue()?.map(u => u.name).join(", ")} 
          placement="top"
          hasArrow
        >
          <Badge colorScheme="purple" px="2" py="1" borderRadius="6px" maxW="150px" isTruncated>
            {info.getValue()?.slice(0, 2).map(u => u.name).join(", ")}
            {info.getValue()?.length > 2 && "..."}
          </Badge>
        </Tooltip>
      ),
      size: 200,
    }),
    columnHelper.accessor("featured_course", {
      id: "featured",
      header: () => <Text color="gray.400">Featured</Text>,
      cell: (info) => (
        <Switch
          colorScheme="teal"
          isChecked={info.getValue()}
          onChange={() => toggleFeatured(info.row.original.id, info.getValue())}
        />
      ),
      size: 100,
    }),
    columnHelper.accessor("coming_soon", {
      id: "coming_soon",
      header: () => <Text color="gray.400">Comming Soon</Text>,
      cell: (info) => (
        <Switch
          colorScheme="teal"
          isChecked={info.getValue()}
          onChange={() => toggleFeatured(info.row.original.id, info.getValue())}
        />
      ),
      size: 100,
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
               onClick={() => navigate(`/admin/show-study-abroad/${info.row.original.id}`)}
             />
             <Icon
               w="18px"
               h="18px"
               me="10px"
               color="green.500"
               as={EditIcon}
               cursor="pointer"
               onClick={() => navigate(`/admin/edit-study-abroad/${info.row.original.id}`)}
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
      size: 80,
    }),
  ];

  const table = useReactTable({
    data: data?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <Card p="6" >
        <Skeleton height="20px" mb="4" />
        <Skeleton height="40px" mb="4" />
        <Skeleton height="300px" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card p="6" textAlign="center" style={{ marginTop:"60px" }}>
        <Text color="red.500" fontSize="lg" mb="4">
          Failed to load study abroad programs
        </Text>
        <Button colorScheme="blue" onClick={refetch}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Box className="container">
      <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Study Abroad Programs
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
            onClick={() => navigate("/admin/add-study-abroad")}
          >
            Add Program
          </Button>
        </Flex>
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th 
                      key={header.id} 
                      borderColor={borderColor}
                      width={header.getSize()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id} _hover={{ bg: hoverColor }}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} borderColor="transparent">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center" py="8">
                    <Text color="gray.500">No study abroad programs found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
};

export default StudyAbroad;