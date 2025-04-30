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
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
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
  import { EditIcon } from '@chakra-ui/icons';
  import { FaEye, FaTrash } from 'react-icons/fa6';
  import { useNavigate } from 'react-router-dom';
  import {
    useGetOnlineCourseInquiriesQuery,
    useGetShortCourseInquiriesQuery,
    useGetStudyAbroadInquiriesQuery,
    useDeleteOnlineCourseInquiryMutation,
    useDeleteShortCourseInquiryMutation,
    useDeleteStudyAbroadInquiryMutation,
  } from '../../../api/coursesInquires';
  import Swal from 'sweetalert2';
  
  const columnHelper = createColumnHelper();
  
  const CoursesInquires = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const [tableData, setTableData] = React.useState([]);
    
    // Queries for each type of inquiry
    const { 
      data: onlineInquiries, 
      isLoading: isLoadingOnline, 
      error: onlineError, 
      refetch: refetchOnline 
    } = useGetOnlineCourseInquiriesQuery();
    
    const { 
      data: shortCourseInquiries, 
      isLoading: isLoadingShort, 
      error: shortError, 
      refetch: refetchShort 
    } = useGetShortCourseInquiriesQuery();
    
    const { 
      data: studyAbroadInquiries, 
      isLoading: isLoadingStudy, 
      error: studyError, 
      refetch: refetchStudy 
    } = useGetStudyAbroadInquiriesQuery();
    
    // Delete mutations for each type
    const [deleteOnlineInquiry] = useDeleteOnlineCourseInquiryMutation();
    const [deleteShortCourseInquiry] = useDeleteShortCourseInquiryMutation();
    const [deleteStudyAbroadInquiry] = useDeleteStudyAbroadInquiryMutation();
    
    const navigate = useNavigate();
    const [sorting, setSorting] = React.useState([]);
    const toast = useToast();
  
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
    // Function to transform data for the table
    const transformData = (data) => {
      if (!data?.flag || !data?.data?.data) return [];
      
      return data.data.data.map(item => ({
        id: item.id,
        full_name: item.full_name,
        email: item.email,
        phone: item.phone,
        nationality: item.nationality,
        country_of_residence: item.country_of_residence,
        course_title: item.online_course?.title_en || item.short_course?.title_en || item.study_abroad?.title_en || 'N/A',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    };
  
    // Update table data when tab or data changes
    React.useEffect(() => {
      let newData = [];
      switch(activeTab) {
        case 0:
          newData = transformData(onlineInquiries);
          break;
        case 1:
          newData = transformData(shortCourseInquiries);
          break;
        case 2:
          newData = transformData(studyAbroadInquiries);
          break;
        default:
          break;
      }
      setTableData(newData);
    }, [activeTab, onlineInquiries, shortCourseInquiries, studyAbroadInquiries]);
  
    // Handle delete based on active tab
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
          let response;
          switch(activeTab) {
            case 0:
              response = await deleteOnlineInquiry(id).unwrap();
              break;
            case 1:
              response = await deleteShortCourseInquiry(id).unwrap();
              break;
            case 2:
              response = await deleteStudyAbroadInquiry(id).unwrap();
              break;
            default:
              break;
          }
  
          if (response?.flag) {
            await Swal.fire('Deleted!', 'Inquiry has been deleted.', 'success');
            // Refetch the current tab's data
            switch(activeTab) {
              case 0: refetchOnline(); break;
              case 1: refetchShort(); break;
              case 2: refetchStudy(); break;
              default: break;
            }
          } else {
            toast({
              title: 'Error',
              description: response?.message || 'Failed to delete inquiry.',
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
      columnHelper.accessor('full_name', {
        id: 'full_name',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Full Name
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('email', {
        id: 'email',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Email
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('phone', {
        id: 'phone',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Phone
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('nationality', {
        id: 'nationality',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Nationality
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('country_of_residence', {
        id: 'country_of_residence',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Residence
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('course_title', {
        id: 'course_title',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Course
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
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
              title="Delete Inquiry"
              onClick={() => handleDelete(info.row.original.id)}
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
  
    // Loading state
    const isLoading = isLoadingOnline || isLoadingShort || isLoadingStudy;
    const error = onlineError || shortError || studyError;
  
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
          Error: {error.message || 'Failed to load inquiries'}
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
              Course Inquiries
            </Text>
          </Flex>
  
          <Tabs variant="soft-rounded" my={"20px"} colorScheme="brand" onChange={(index) => setActiveTab(index)}>
            <TabList px="25px">
              <Tab>Online Degrees</Tab>
              <Tab>Short Courses</Tab>
              <Tab>Study Abroad</Tab>
            </TabList>
  
            <TabPanels>
              <TabPanel>
                {tableData.length === 0 ? (
                  <Text textAlign="center" mt={4} color={textColor}>
                    No inquiries found for this category.
                  </Text>
                ) : (
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
                )}
              </TabPanel>
              <TabPanel>
                {tableData.length === 0 ? (
                  <Text textAlign="center" mt={4} color={textColor}>
                    No inquiries found for this category.
                  </Text>
                ) : (
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
                )}
              </TabPanel>
              <TabPanel>
                {tableData.length === 0 ? (
                  <Text textAlign="center" mt={4} color={textColor}>
                    No inquiries found for this category.
                  </Text>
                ) : (
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
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Box>
    );
  };
  
  export default CoursesInquires;