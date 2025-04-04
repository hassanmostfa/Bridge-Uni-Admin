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
  Link,
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
import { FaCheck, FaTimes, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper();

const JoinUsRequests = () => {
  const [data, setData] = React.useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      positionApplied: 'Frontend Developer',
      jobTitle: 'Senior Developer',
      cv: 'john_doe_cv.pdf',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      positionApplied: 'Backend Developer',
      jobTitle: 'Team Lead',
      cv: 'jane_smith_cv.pdf',
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      positionApplied: 'UX Designer',
      jobTitle: 'Design Manager',
      cv: 'michael_johnson_cv.pdf',
    },
  ]);

  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const columns = [
    columnHelper.accessor('firstName', {
      id: 'firstName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          First Name
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('lastName', {
      id: 'lastName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Last Name
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('positionApplied', {
      id: 'positionApplied',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Position Applied
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('jobTitle', {
      id: 'jobTitle',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Current Job Title
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('cv', {
      id: 'cv',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          CV
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Icon as={FaFilePdf} color="red.500" mr={2} />
          <Link 
            href={`/path/to/cvs/${info.getValue()}`} 
            color="blue.500"
            isExternal
            _hover={{ textDecoration: 'underline' }}
          >
            View CV
          </Link>
        </Flex>
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
        <Flex align="center" gap="15px">
          <Flex border={`1px solid #01b574`} borderRadius={"5px"} padding={"5px"} align="center" gap="5px" cursor="pointer" onClick={() => handleApprove(info.row.original.id)}>
            <Icon w="18px" h="18px" color="green.500" as={FaCheck} />
            <Text fontSize="sm" color="green.500" fontWeight="bold">
              Approve
            </Text>
          </Flex>
    
          <Flex w={"90px"} border={`1px solid #ee5d50`} justifyContent={"center"} borderRadius={"5px"} padding={"5px"} align="center" gap="5px" cursor="pointer" onClick={() => handleReject(info.row.original.id)}>
            <Icon w="18px" h="18px" color="red.500" as={FaTimes} />
            <Text fontSize="sm" color="red.500" fontWeight="bold">
              Reject
            </Text>
          </Flex>
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

  // Handle approve action
  const handleApprove = (id) => {
    console.log(`Approved application with ID: ${id}`);
    // Add your approve logic here
  };

  // Handle reject action
  const handleReject = (id) => {
    console.log(`Rejected application with ID: ${id}`);
    // Add your reject logic here
  };

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
            Join Us Requests
          </Text>
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
                .rows.map((row) => {
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

export default JoinUsRequests;