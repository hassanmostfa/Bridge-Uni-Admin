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
  Button,
  Checkbox,
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
import { FaTrash } from 'react-icons/fa';
import { IoMdPrint } from 'react-icons/io';
import { useGetAllRequestsQuery, useDeleteRequestMutation } from 'api/requestSlice';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const OnlineApps = () => {
  const { data: onlineApps, refetch, isLoading } = useGetAllRequestsQuery('onlineCourse');
  const [deleteRequest] = useDeleteRequestMutation();
  const [tableData, setTableData] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (onlineApps?.data?.data) {
      const formattedData = onlineApps.data.data.map(app => ({
        id: app.id,
        fullName: app.full_name,
        email: app.email,
        phone: app.phone,
        courseId: app.online_course_id,
        courseName: app.online_course.title_en
      }));
      setTableData(formattedData);
    }
  }, [onlineApps]);

  const handleCheckboxChange = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((itemId) => itemId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(tableData.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(selectedOrders.length === tableData.length && tableData.length > 0);
  }, [selectedOrders, tableData]);

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
        await deleteRequest({ type: 'onlineCourse', id }).unwrap();
        Swal.fire('Deleted!', 'The request has been deleted.', 'success');
        refetch();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete the request.', 'error');
      }
    }
  };

  const handlePrintSelectedOrders = () => {
    const ordersToPrint = tableData.filter((order) => selectedOrders.includes(order.id));
  
    if (ordersToPrint.length === 0) {
      Swal.fire('Info', 'No orders selected for printing.', 'info');
      return;
    }
  
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0px';
    printFrame.style.height = '0px';
    printFrame.style.left = '-600px';
    printFrame.style.top = '0px';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
  
    printFrame.onload = function() {
      const printDocument = printFrame.contentWindow.document;
      
      printDocument.write(`
        <html>
          <head>
            <title>Online Degree Application</title>
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
                @page { size: A4; margin: 10mm; }
              }
            </style>
          </head>
          <body>
            ${ordersToPrint.map(order => `
              <div class="invoice">
                <div class="header">
                  <h1>Online Degree Application</h1>
                  <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="details">
                  <div class="detail-label">Request ID:</div>
                  <div>${order.id}</div>
                  <div class="detail-label">Customer:</div>
                  <div>${order.fullName}</div>
                  <div class="detail-label">Email:</div>
                  <div>${order.email}</div>
                  <div class="detail-label">Phone:</div>
                  <div>${order.phone}</div>
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
      printDocument.close();
  
      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        document.body.removeChild(printFrame);
      }, 500);
    };
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const columns = [
    columnHelper.accessor('id', {
      header: () => (
        <Checkbox
          isChecked={selectAll}
          onChange={handleSelectAllChange}
          colorScheme="brandScheme"
        />
      ),
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
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('courseName', {
      header: 'Course Name',
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
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
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text>Loading applications...</Text>
      </Flex>
    );
  }

  return (
    <Box className="container">
      <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            Online Degrees Applications ({tableData.length})
          </Text>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={handlePrintSelectedOrders}
            isDisabled={selectedOrders.length === 0}
            leftIcon={<IoMdPrint />}
          >
            Print Selected ({selectedOrders.length})
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                    >
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
    </Box>
  );
};

export default OnlineApps;