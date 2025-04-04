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
import { EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { FaTrash } from 'react-icons/fa6';
import { IoIosSend } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper();

const Blogs = () => {
  const [data, setData] = React.useState([
    {
      id: 1,
      image: 'https://www.example.com/image1.jpg',
      ar_title: 'مقالة جديدة',
      en_title: 'New Blog Post',
      ar_description: 'هذه وصف لمقالة جديدة',
      en_description: 'This is a description of a new blog post',
      date: '2023-11-01',
    },
    {
      id: 2,
      image: 'https://www.example.com/image2.jpg',
      ar_title: 'مقالة قديمة',
      en_title: 'Old Blog Post',
      ar_description: 'هذه وصف لمقالة قديمة',
      en_description: 'This is a description of an old blog post',
      date: '2023-10-15',
    },
    {
      id: 3,
      image: 'https://www.example.com/image3.jpg',
      ar_title: 'مقالة مميزة',
      en_title: 'Featured Blog Post',
      ar_description: 'هذه وصف لمقالة مميزة',
      en_description: 'This is a description of a featured blog post',
      date: '2023-09-25',
    },
  ]);

  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

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
    columnHelper.accessor('actions', {
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
            onClick={() => console.log('Delete', info.row.original.id)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-blog/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={IoIosSend}
            cursor="pointer"
            title="Send Notification"
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

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
      </Card>
    </div>
  );
};

export default Blogs;