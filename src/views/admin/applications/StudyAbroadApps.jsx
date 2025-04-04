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
  } from '@chakra-ui/react';
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  import React, { useState } from 'react';
  import Card from 'components/card/Card';
  import { FaEye } from 'react-icons/fa6';
  import { IoMdPrint } from 'react-icons/io';
  import { useNavigate } from 'react-router-dom';
  
  const columnHelper = createColumnHelper();
  
  const StudyAbroadApps = () => {
    const [data, setData] = useState([
      {
        invoiceId: 'INV12347',
        fullName: 'Maria Smith',
        email: 'maria.smith@example.com',
        phoneNumber: '+96599123457',
        status: 'Completed',
        courseName: 'Course 1',
      },
      {
        invoiceId: 'INV12346',
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+96599123457',
        status: 'Completed',
        courseName: 'Course 2',
      },
    ]);
  
    const navigate = useNavigate();
    const [sorting, setSorting] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
  
    const handleCheckboxChange = (invoiceId) => {
      if (selectedOrders.includes(invoiceId)) {
        setSelectedOrders(selectedOrders.filter((id) => id !== invoiceId));
      } else {
        setSelectedOrders([...selectedOrders, invoiceId]);
      }
    };
  
    const handlePrintSelectedOrders = () => {
      const ordersToPrint = data.filter((order) => selectedOrders.includes(order.invoiceId));
    
      if (ordersToPrint.length === 0) {
        alert('No orders selected for printing.');
        return;
      }
    
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Study Abroad Requests</title>
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
                  <h1>Order Invoice</h1>
                  <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="details">
                  <div class="detail-label">Invoice ID:</div>
                  <div>${order.invoiceId}</div>
                  <div class="detail-label">Customer:</div>
                  <div>${order.fullName}</div>
                  <div class="detail-label">Email:</div>
                  <div>${order.email}</div>
                  <div class="detail-label">Phone:</div>
                  <div>${order.phoneNumber}</div>
                  <div class="detail-label">Course:</div>
                  <div>${order.courseName}</div>
                  <div class="detail-label">Status:</div>
                  <div>
                    <span class="badge ${order.status.toLowerCase()}">${order.status}</span>
                  </div>
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
      columnHelper.accessor('invoiceId', {
        header: '',
        cell: (info) => (
          <Checkbox
            isChecked={selectedOrders.includes(info.getValue())}
            onChange={() => handleCheckboxChange(info.getValue())}
            colorScheme="brandScheme"
          />
        ),
      }),
      columnHelper.accessor('invoiceId', {
        header: 'Invoice ID',
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
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
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
              info.getValue() === 'Pending'
                ? 'blue'
                : info.getValue() === 'Completed'
                ? 'green'
                : 'orange'
            }
            px="10px"
            py="2px"
            borderRadius="full"
            fontSize="12px"
          >
            {info.getValue()}
          </Badge>
        ),
      }),
    ];
  
    const table = useReactTable({
      data,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
  
    return (
      <div className="container">
        <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
          <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
            <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
              All Requests
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
              Print
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
  
  export default StudyAbroadApps;