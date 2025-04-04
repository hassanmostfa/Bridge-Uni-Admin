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
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper();

const SocialMedia = () => {
  const [data, setData] = React.useState([
    {
      id: 1,
      instagram: 'instagram.com/company',
      facebook: 'facebook.com/company',
      linkedin: 'linkedin.com/company',
      twitter: 'twitter.com/company',
    },
    {
      id: 2,
      instagram: 'instagram.com/business',
      facebook: 'facebook.com/business',
      linkedin: 'linkedin.com/business',
      twitter: 'twitter.com/business',
    },
  ]);

  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const handleDelete = async (id) => {
    try {
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
        setData(data.filter(item => item.id !== id));
        Swal.fire('Deleted!', 'The social media link has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      Swal.fire('Error!', 'Failed to delete the social media link.', 'error');
    }
  };

  const shortenLink = (link) => {
    if (link.length > 20) {
      return link.substring(0, 17) + '...';
    }
    return link;
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
          <Text color={textColor}>{info.getValue()}</Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('instagram', {
      id: 'instagram',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Instagram
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" gap={2}>
          <Icon as={FaInstagram} color="#E1306C" />
          <Text color={textColor} title={info.getValue()}>
            {shortenLink(info.getValue())}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('facebook', {
      id: 'facebook',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Facebook
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" gap={2}>
          <Icon as={FaFacebook} color="#4267B2" />
          <Text color={textColor} title={info.getValue()}>
            {shortenLink(info.getValue())}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('linkedin', {
      id: 'linkedin',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          LinkedIn
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" gap={2}>
          <Icon as={FaLinkedin} color="#0077B5" />
          <Text color={textColor} title={info.getValue()}>
            {shortenLink(info.getValue())}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('twitter', {
      id: 'twitter',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Twitter
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" gap={2}>
          <Icon as={FaTwitter} color="#1DA1F2" />
          <Text color={textColor} title={info.getValue()}>
            {shortenLink(info.getValue())}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('id', {
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
            onClick={() => handleDelete(info.getValue())}
          />
          <Icon
            w="18px"
            h="18px"
            me="10px"
            color="green.500"
            as={EditIcon}
            cursor="pointer"
            onClick={() => navigate(`/admin/edit-social-media/${info.getValue()}`)}
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
            Social Media Links
          </Text>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => navigate('/admin/add-social-link')}
            width={'200px'}
          >
            <PlusSquareIcon me="10px" />
            Add New Links
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

export default SocialMedia;