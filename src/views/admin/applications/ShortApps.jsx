import {
  Box,
  Flex,
  Icon,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import Card from 'components/card/Card';
import { FaEye, FaTrash } from 'react-icons/fa';
import { IoMdPrint } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useGetAllRequestsQuery, useDeleteRequestMutation } from 'api/requestSlice';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const ShortApps = () => {
  const { data: shortApps, refetch, isLoading } = useGetAllRequestsQuery('shortCourse');
  const [deleteRequest] = useDeleteRequestMutation();
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    if (shortApps?.data?.data) {
      const formattedData = shortApps.data.data.map(app => ({
        id: app.id,
        fullName: app.full_name,
        email: app.email,
        status: app.status,
        courseId: app.short_course_id,
        courseName: app.short_course.title_en
      }));
      setTableData(formattedData);
    }
  }, [shortApps]);

  const handleCheckboxChange = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((itemId) => itemId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

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
        await deleteRequest({ type: 'shortCourse', id }).unwrap();
        Swal.fire(
          'Deleted!',
          'The request has been deleted.',
          'success'
        );
        refetch();
      } catch (err) {
        Swal.fire(
          'Error!',
          'Failed to delete the request.',
          'error'
        );
      }
    }
  };

  const handlePrintSelectedOrders = () => {
    const ordersToPrint = tableData.filter((order) => selectedOrders.includes(order.id));
  
    if (ordersToPrint.length === 0) {
      Swal.fire('Info', 'No orders selected for printing.', 'info');
      return;
    }
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Short Courses Requests</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; font-family: Arial; }
              .invoice { 
                page-break-after: always; 
                padding: 20px; 
                margin: 0 auto;
                max-width: 800px;
              }
              .invoice:last-child { page-break-after: auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { display: grid; grid-template-columns: 150px 1fr; gap: 10px; }
              .detail-label { font-weight: bold; }
              .footer { margin-top: 30px; text-align: right; font-style: italic; }
              .badge {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 12px;
              }
              .pending { background: #bee3f8; color: #2b6cb0; }
              .completed { background: #c6f6d5; color: #276749; }
              .shipped { background: #feebc8; color: #9c4221; }
              @page { size: A4; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          ${ordersToPrint.map(order => `
            <div class="invoice">
              <div class="header">
                <h1>Short Course Request</h1>
                <p>Date: ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="details">
                <div class="detail-label">Request ID:</div>
                <div>${order.id}</div>
                <div class="detail-label">Customer:</div>
                <div>${order.fullName}</div>
                <div class="detail-label">Email:</div>
                <div>${order.email}</div>
                <div class="detail-label">Course:</div>
                <div>${order.courseName}</div>
              
              </div>
              <div class="footer">
                <p>Thank you for your business!</p>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 200);
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const columns = [
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => (
        <Checkbox
          isChecked={selectedOrders.includes(info.getValue())}
          onChange={() => handleCheckboxChange(info.getValue())}
          colorScheme="brandScheme"
        />
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Request ID',
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('courseName', {
      header: 'Course Name',
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge
          colorScheme={
            info.getValue() === 'pending'
              ? 'blue'
              : info.getValue() === 'completed'
              ? 'green'
              : 'orange'
          }
          px="10px"
          py="2px"
          borderRadius="full"
          fontSize="12px"
          textTransform="capitalize"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <IconButton
          icon={<FaTrash />}
          colorScheme="red"
          size="sm"
          onClick={() => handleDelete(info.getValue())}
          aria-label="Delete request"
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            All Short Course Requests
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
            onClick={handlePrintSelectedOrders}
          >
            <Icon as={IoMdPrint} me="10px" />
            Print Selected
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px" minWidth="1000px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  ))}
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

export default ShortApps;