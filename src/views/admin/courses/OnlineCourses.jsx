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

const columnHelper = createColumnHelper();

const OnlineCourses = () => {
  const {data:cources} = useGetAllOnlineCourcesQuery();
  console.log(cources);
  
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      id: 1,
      title_en: "Data Science Fundamentals",
      title_ar: "أساسيات علم البيانات",
      provider: "Coursera",
      category: "Technology",
      featured: true,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      title_en: "Business Administration",
      title_ar: "إدارة الأعمال",
      provider: "Udemy",
      category: "Business",
      featured: false,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      title_en: "Graphic Design Masterclass",
      title_ar: "دورة متقدمة في التصميم الجرافيكي",
      provider: "Skillshare",
      category: "Design",
      featured: true,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
  ]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // Toggle featured status
  const toggleFeatured = (id) => {
    setData((prevData) =>
      prevData.map((course) =>
        course.id === id ? { ...course, featured: !course.featured } : course
      )
    );
  };

  // Delete course
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((course) => course.id !== id));
  };

  const columns = [
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
            onClick={() => navigate(`/admin/courses/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-course/${info.row.original.id}`)}
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
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        </Box>
      </Card>
    </div>
  );
};

export default OnlineCourses;