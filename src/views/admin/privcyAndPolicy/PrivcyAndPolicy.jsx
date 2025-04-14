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
import { FaEye, FaTrash } from 'react-icons/fa6';
import { IoIosSend } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useGetAllPrivacyQuery } from 'api/privacySlice';
import { useDeletePrivacyMutation } from 'api/privacySlice';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const PrivcyAndPolicy = () => {
  const { data: privacyData, isLoading, isError, refetch } = useGetAllPrivacyQuery();
  const [deletePrivacy] = useDeletePrivacyMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Transform the API data to match our table structure
  const data = React.useMemo(() => {
    if (!privacyData?.data?.data) return [];
    return privacyData.data.data.map(item => ({
      id: item.id,
      en_description: item.title_en || 'No English content',
      ar_description: item.title_ar || 'No Arabic content',
    }));
  }, [privacyData]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePrivacy(id).unwrap();
        if (response.flag) {
          Swal.fire(
            'Deleted!',
            response.message || 'Privacy policy has been deleted.',
            'success'
          );
          refetch();
        } else {
          toast({
            title: 'Error',
            description: response.message || 'Failed to delete privacy policy',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.data?.message || 'Failed to delete privacy policy',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/cms/edit-privcy/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/cms/edit-privcy/${id}`);
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
          <Text color={textColor}>
            {info.getValue()}
          </Text>
        </Flex>
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
          EN Privacy Content
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue().slice(0, 20) + (info.getValue().length > 20 ? '...' : '')}
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
          AR Privacy Content
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue().slice(0, 15) + (info.getValue().length > 15 ? '...' : '')}
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
            onClick={() => handleDelete(info.row.original.id)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => handleEdit(info.row.original.id)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="blue.500"
            as={FaEye}
            cursor="pointer"
            title="View Details"
            onClick={() => handleView(info.row.original.id)}
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
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
            Privacies & Policies
          </Text>
          <Button
            variant='darkBrand'
            color='white'
            fontSize='sm'
            fontWeight='500'
            borderRadius='70px'
            px='24px'
            py='5px'
            onClick={() => navigate('/admin/cms/add-privcy')}
            width={'200px'}
          >
            <PlusSquareIcon me="10px" />
            Add New Field
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
              {table
                .getRowModel()
                .rows.slice(0, 11)
                .map((row) => {
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

export default PrivcyAndPolicy;