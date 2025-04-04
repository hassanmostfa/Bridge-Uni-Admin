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

const columnHelper = createColumnHelper();

const StudyAbroad = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      id: 1,
      title_en: "Study in United States",
      title_ar: "الدراسة في الولايات المتحدة",
      universities_count: 150,
      majors_count: 520,
      top_universities: "Harvard, MIT, Stanford",
      featured: true,
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      title_en: "Study in United Kingdom",
      title_ar: "الدراسة في المملكة المتحدة",
      universities_count: 95,
      majors_count: 340,
      top_universities: "Oxford, Cambridge, Imperial",
      featured: true,
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      title_en: "Study in Australia",
      title_ar: "الدراسة في أستراليا",
      universities_count: 43,
      majors_count: 280,
      top_universities: "Melbourne, Sydney, ANU",
      featured: false,
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 4,
      title_en: "Study in Canada",
      title_ar: "الدراسة في كندا",
      universities_count: 57,
      majors_count: 310,
      top_universities: "Toronto, McGill, UBC",
      featured: true,
      image: 'https://images.unsplash.com/photo-1590114538379-38ce627039d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 5,
      title_en: "Study in Germany",
      title_ar: "الدراسة في ألمانيا",
      universities_count: 80,
      majors_count: 270,
      top_universities: "TU Munich, Heidelberg, LMU Munich",
      featured: false,
      image: 'https://images.unsplash.com/photo-1554072675-66db59dba46f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
  ]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // Toggle featured status
  const toggleFeatured = (id) => {
    setData((prevData) =>
      prevData.map((program) =>
        program.id === id ? { ...program, featured: !program.featured } : program
      )
    );
  };

  // Delete program
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((program) => program.id !== id));
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
          alt="Study abroad thumbnail"
        />
      ),
    }),
    columnHelper.accessor("title_en", {
      id: "title_en",
      header: () => <Text color="gray.400">Destination (EN)</Text>,
      cell: (info) => <Text fontWeight="500">{info.getValue()}</Text>,
    }),
    columnHelper.accessor("title_ar", {
      id: "title_ar",
      header: () => <Text color="gray.400">Destination (AR)</Text>,
      cell: (info) => (
        <Text dir="rtl" fontFamily="Tahoma">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("universities_count", {
      id: "universities_count",
      header: () => <Text color="gray.400">Universities</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("majors_count", {
      id: "majors_count",
      header: () => <Text color="gray.400">Majors</Text>,
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("top_universities", {
      id: "top_universities",
      header: () => <Text color="gray.400">Top Universities</Text>,
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
            onClick={() => navigate(`/admin/study-abroad/${info.row.original.id}`)}
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
            onClick={() => navigate("/admin/add-study-abroad")}
            width={"200px"}
          >
            <PlusSquareIcon me="10px" />
            Add Program
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

export default StudyAbroad;