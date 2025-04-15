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
  Spinner,
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
import { useNavigate } from 'react-router-dom';
import { useGetAllPartnersQuery, useDeletePartnerMutation } from "../../../api/partners";
import Swal from "sweetalert2";

const columnHelper = createColumnHelper();

const Partners = () => {
  const { data: apiResponse, isLoading, error, refetch } = useGetAllPartnersQuery();
  const [deletePartner, { isLoading: isLoadingDelete }] = useDeletePartnerMutation();
  const [tableData, setTableData] = React.useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  React.useEffect(() => {
    if (apiResponse?.flag && apiResponse?.data?.data) {
      const transformedData = apiResponse.data.data.map(item => ({
        id: item.id,
        logo: item.image,
      }));
      setTableData(transformedData);
    }
  }, [apiResponse]);

   // Trigger refetch when component mounts (navigates to)
   React.useEffect(() => {
    // Only trigger refetch if the data is not being loaded
    if (!isLoading) {
      refetch(); // Manually trigger refetch when component is mounted
    }
  }, [refetch, isLoading]); // Dependency array to ensure it only runs on mount
  
  const handleDelete = async (id) => {
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
      try {
        const response = await deletePartner(id).unwrap();
        
        if (response.flag) {
          await Swal.fire(
            'Deleted!',
            'Partner has been deleted.',
            'success'
          );
          refetch();
        } else {
          toast({
            title: 'Error',
            description: response.message || 'Failed to delete partner.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error?.data?.message || 'An unexpected error occurred.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
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
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('logo', {
      id: 'logo',
      header: () => (
        <Text
          justifyContent="space-between"
          align="start"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
          w={'450px'}
        >
          Partner Logo
        </Text>
      ),
      cell: (info) => (
        <Box maxW="150px">
          <img 
            src={info.getValue()} 
            alt="Partner Logo" 
            style={{ 
              borderRadius: '8px',
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '60px'
            }} 
          />
        </Box>
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
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            title="Edit Partner"
            onClick={() => navigate(`/admin/cms/update-partner/${info.row.original.id}`)}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="red.500"
            as={FaTrash}
            cursor="pointer"
            title="Delete Partner"
            onClick={() => handleDelete(info.row.original.id)}
            disabled={isLoadingDelete}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
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
      <Flex justify="center" align="center" h="100px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red.500" textAlign="center" mt={4}>
        Error: {error.message || 'Failed to load partners'}
      </Text>
    );
  }

  return (
    <Box className="container">
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
            Partners
          </Text>
          <Button
            variant='darkBrand'
            color='white'
            fontSize='sm'
            fontWeight='500'
            borderRadius='70px'
            px='24px'
            py='5px'
            onClick={() => navigate('/admin/add-partner')}
            minW="200px"
            leftIcon={<PlusSquareIcon />}
          >
            Add New Partner
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
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
};

export default Partners;