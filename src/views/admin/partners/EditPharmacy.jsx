import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Textarea,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa6';
import {
  useGetPharmacyQuery,
  useUpdatePharmacyMutation,
} from 'api/pharmacySlice';

const EditPharmacy = () => {
  const { id } = useParams(); // Get the pharmacy ID from the URL
  const navigate = useNavigate();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  // Fetch pharmacy data by ID
  const {
    data,
    isLoading: isFetching,
    refetch,
    error: fetchError,
  } = useGetPharmacyQuery(id);
  const pharmacy = data?.data;

  // Mutation for updating a pharmacy
  const [updatePharmacy, { isLoading: isUpdating }] =
    useUpdatePharmacyMutation();

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    imageKey: '',
    description: '',
    whatsappNumber: '',
    numOfBranches: 0,
    email: '',
    password: '',
    workingHours: '',
    revenueShare: 0,
    fixedFees: 0,
    feesStartDate: '',
    feesEndDate: '',
    isActive: true,
    translations: [
      {
        languageId: 'ar',
        name: '',
        description: '',
      },
      {
        languageId: 'en',
        name: '',
        description: '',
      },
    ],
    branches: [],
  });

  const [numberOfBranches, setNumberOfBranches] = useState(0);
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    refetch();
  }, []);
  // Pre-fill form data when pharmacy data is fetched
  useEffect(() => {
    if (pharmacy) {
      setFormData({
        ...pharmacy,
        translations: [
          {
            languageId: 'ar',
            name: pharmacy.name,
            description: pharmacy.description,
          },
          {
            languageId: 'en',
            name: pharmacy.name,
            description: pharmacy.description,
          },
        ],
        branches: pharmacy.branches?.map((branch) => ({
          ...branch,
          translations: [
            {
              languageId: 'ar',
              name: branch.name,
              address: branch.address,
            },
            {
              languageId: 'en',
              name: branch.name,
              address: branch.address,
            },
          ],
        })),
      });
      setNumberOfBranches(pharmacy.numOfBranches);
    }
  }, [pharmacy]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle translation changes
  const handleTranslationChange = (languageId, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      translations: prevData.translations?.map((translation) =>
        translation.languageId === languageId
          ? { ...translation, [field]: value }
          : translation,
      ),
    }));
  };

  // Handle branch translation changes
    const handleBranchTranslationChange = (index, languageId, field, value) => {
      setFormData((prevData) => ({
        ...prevData,
        branches: prevData.branches?.map((branch, i) =>
          i === index
            ? {
                ...branch,
                name: branch.translations.find((t) => t.languageId === 'en').name,
                address: branch.translations.find((t) => t.languageId === 'en').address,
                translations: branch.translations?.map((translation) =>
                  translation.languageId === languageId
                    ? { ...translation, [field]: value }
                    : translation
                ),
              }
            : branch
        ),
      }));
    };

  // Handle image upload
  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setImage(files[0]);
      setFormData((prevData) => ({
        ...prevData,
        imageKey: files[0].name, // Update with the actual image key logic
      }));
    }
  };

  // Handle drag-and-drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  // Handle number of branches change
  const handleNumberOfBranchesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfBranches(value >= 0 ? value : 0);

    // Initialize branches array with empty objects
    setFormData((prevData) => ({
      ...prevData,
      numOfBranches: value,
      branches: Array.from({ length: value })?.map((_, index) => ({
        name: '',
        address: '',
        locationLink: '',
        isActive: true,
        translations: [
          {
            languageId: 'ar',
            name: '',
            address: '',
          },
          {
            languageId: 'en',
            name: '',
            address: '',
          },
        ],
      })),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Filter out unnecessary fields from branches
      const filteredBranches = formData.branches?.map((branch) => {
        const { id, createdAt, updatedAt, ...rest } = branch;
        return rest;
      });
  
      // Prepare the payload
      const payload = {
        ...formData,
        branches: filteredBranches, // Use the filtered branches
        feesStartDate: formData.feesStartDate
          ? formData.feesStartDate + 'T00:00:00Z'
          : '2024-05-01T00:00:00Z',
        feesEndDate: formData.feesEndDate
          ? formData.feesEndDate + 'T00:00:00Z'
          : '2025-05-01T00:00:00Z',
        name: formData.translations.find((t) => t.languageId === 'en').name,
        description: formData.translations.find((t) => t.languageId === 'en')
          .description,
        revenueShare: parseInt(formData.revenueShare),
        fixedFees: formData.fixedFees ? parseInt(formData.fixedFees) : 0,
      };
  
      // Remove additional unwanted fields from the payload
      delete payload.revenueShareType;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.id;
  
      // Send the update request
      const response = await updatePharmacy({ id, pharmacy: payload }).unwrap();
  
      // Show success message
      toast({
        title: 'Success',
        description: 'Pharmacy updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Navigate back
      navigate('/admin/pharmacy');
    } catch (error) {
      setError(error.data);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to update pharmacy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  if (isFetching) return <Text>Loading...</Text>;
  if (fetchError) return <Text>Error loading pharmacy data.</Text>;

  return (
    <div className="container add-admin-container w-100">
      <Box bg={cardBg} className="add-admin-card shadow p-4 w-100">
        <Box  className="mb-3 d-flex justify-content-between align-items-center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Edit Pharmacy
          </Text>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            colorScheme="teal"
            size="sm"
            leftIcon={<IoMdArrowBack />}
          >
            Back
          </Button>
        </Box>
        <form>
          {/* Error Display */}
          {error?.success === false && (
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Validation failed</h4>
              <ul>
                {error.errors?.map((err) => (
                  <li key={err.field}>
                    {err.field} - {err.message.en || err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pharmacy Name (En & Ar) */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Pharmacy Name En <span className="text-danger">*</span>
              </Text>
              <Input
                bg={inputBg}
                color={textColor}
                value={
                  formData.translations.find((t) => t.languageId === 'en').name
                }
                onChange={(e) =>
                  handleTranslationChange('en', 'name', e.target.value)
                }
                mt={2}
              />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Pharmacy Name Ar <span className="text-danger">*</span>
              </Text>
              <Input
              bg={inputBg}
              color={textColor}
                value={
                  formData.translations.find((t) => t.languageId === 'ar').name
                }
                onChange={(e) =>
                  handleTranslationChange('ar', 'name', e.target.value)
                }
                mt={2}
              />
            </GridItem>
          </Grid>

          {/* Email & WhatsApp Number */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Email <span className="text-danger">*</span>
              </Text>
              <Input
                bg={inputBg}
                color={textColor}
                name="email"
                value={formData.email}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                WhatsApp Number <span className="text-danger">*</span>
              </Text>
              <Input
              bg={inputBg}
              color={textColor}
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>
          </Grid>

          {/* Password & Working Hours */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Password <span className="text-danger">*</span>
              </Text>
              <Input
              bg={inputBg}
              color={textColor}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Iban <span className="text-danger">*</span>
              </Text>
              <Input
              bg={inputBg}
              color={textColor}
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>
          </Grid>

          {/* Revenue Share Type */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Working Hours <span className="text-danger">*</span>
              </Text>
              <Input
              bg={inputBg}
              color={textColor}
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>
            <GridItem>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Revenue Share Type <span className="text-danger">*</span>
              </Text>
              <RadioGroup
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    revenueShareType: value,
                  }))
                }
                value={formData.revenueShareType}
                mt={2}
              >
                <Stack direction="row">
                  <Radio value="percentage">Percentage</Radio>
                  <Radio value="fixed">Fixed Fees</Radio>
                </Stack>
              </RadioGroup>
            </GridItem>
          </Grid>

          {/* Revenue Share or Fixed Fees */}
          {formData.revenueShareType === 'percentage' ? (
            <GridItem colSpan={2} mt={2}>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Percentage <span className="text-danger">*</span>
              </Text>
              <Input
              bg={inputBg}
              color={textColor}
                type="number"
                name="revenueShare"
                value={formData.revenueShare}
                onChange={handleChange}
                mt={2}
              />
            </GridItem>
          ) : (
            <>
              <GridItem mt={2}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Fixed Fees <span className="text-danger">*</span>
                </Text>
                <Input
                bg={inputBg}
                color={textColor}
                  type="number"
                  name="fixedFees"
                  value={formData.fixedFees}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
              <GridItem mt={2}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Fees Start Date <span className="text-danger">*</span>
                </Text>
                <Input
                bg={inputBg}
                color={textColor}
                  type="date"
                  name="feesStartDate"
                  value={formData.feesStartDate}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
              <GridItem mt={2}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Fees End Date <span className="text-danger">*</span>
                </Text>
                <Input
                bg={inputBg}
                color={textColor}
                  type="date"
                  name="feesEndDate"
                  value={formData.feesEndDate}
                  onChange={handleChange}
                  mt={2}
                />
              </GridItem>
            </>
          )}

          {/* Description (En & Ar) */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description En<span className="text-danger">*</span>
              </Text>
              <Textarea
              bg={inputBg}
              color={textColor}
                value={
                  formData.translations.find((t) => t.languageId === 'en')
                    .description
                }
                onChange={(e) =>
                  handleTranslationChange('en', 'description', e.target.value)
                }
                mt={2}
                mb={4}
                width="100%"
              />
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                Description Ar<span className="text-danger">*</span>
              </Text>
              <Textarea
              bg={inputBg}
              color={textColor}
                value={
                  formData.translations.find((t) => t.languageId === 'ar')
                    .description
                }
                onChange={(e) =>
                  handleTranslationChange('ar', 'description', e.target.value)
                }
                mt={2}
                mb={4}
                width="100%"
              />
            </Box>
          </Grid>

          {/* Image Upload */}
          <Box
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            textAlign="center"
            bg={inputBg}
                color={textColor}
            cursor="pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            mb={4}
          >
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop Image Here
            </Text>
            <Text color="gray.500" mb={2}>
              or
            </Text>
            <Button
              variant="outline"
              color="#422afb"
              border="none"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload Image
              <input
                type="file"
                id="fileInput"
                hidden
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </Button>
            {image && (
              <Box
                mt={4}
                display={'flex'}
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  width={80}
                  height={80}
                  borderRadius="md"
                />
              </Box>
            )}
          </Box>

          {/* Number of Branches */}
          <Box mt={4}>
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Number of Branches <span className="text-danger">*</span>
            </Text>
            <Input
            bg={inputBg}
            color={textColor}
              type="number"
              value={numberOfBranches}
              onChange={handleNumberOfBranchesChange}
              mt={2}
              min={0}
            />
          </Box>

          {/* Branches */}
          {Array.from({ length: numberOfBranches })?.map((_, index) => (
            <Box
              key={index}
              mt={4}
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid #ccc"
              bg={cardBg}
            >
              <Text color={textColor} fontSize="md" fontWeight="bold">
                Branch {index + 1}
              </Text>

              <SimpleGrid columns={2} mt={4} spacing={4}>
                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch En-Name <span className="text-danger">*</span>
                  </Text>
                  <Input
                  bg={inputBg}
                  color={textColor}
                    placeholder="Enter Branch En-Name"
                    value={
                      formData.branches[index]?.translations.find(
                        (t) => t.languageId === 'en',
                      ).name || ''
                    }
                    onChange={(e) =>
                      handleBranchTranslationChange(
                        index,
                        'en',
                        'name',
                        e.target.value,
                      )
                    }
                  />
                </Box>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch En-Address <span className="text-danger">*</span>
                  </Text>
                  <Input
                  bg={inputBg}
                  color={textColor}
                    placeholder="Enter Branch En-Address"
                    value={
                      formData.branches[index]?.translations.find(
                        (t) => t.languageId === 'en',
                      ).address || ''
                    }
                    onChange={(e) =>
                      handleBranchTranslationChange(
                        index,
                        'en',
                        'address',
                        e.target.value,
                      )
                    }
                  />
                </Box>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch Ar-Name <span className="text-danger">*</span>
                  </Text>
                  <Input
                  bg={inputBg}
                  color={textColor}
                    placeholder="أدخل اسم الفرع بالعربية"
                    value={
                      formData.branches[index]?.translations.find(
                        (t) => t.languageId === 'ar',
                      ).name || ''
                    }
                    onChange={(e) =>
                      handleBranchTranslationChange(
                        index,
                        'ar',
                        'name',
                        e.target.value,
                      )
                    }
                  />
                </Box>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    Branch Ar-Address <span className="text-danger">*</span>
                  </Text>
                  <Input
                  bg={inputBg}
                  color={textColor}
                    placeholder="أدخل عنوان الفرع بالعربية"
                    value={
                      formData.branches[index]?.translations.find(
                        (t) => t.languageId === 'ar',
                      ).address || ''
                    }
                    onChange={(e) =>
                      handleBranchTranslationChange(
                        index,
                        'ar',
                        'address',
                        e.target.value,
                      )
                    }
                  />
                </Box>
              </SimpleGrid>

              {/* Branch Location Link */}
              <Box mt={4}>
                <Text color={textColor} fontSize="sm" fontWeight="700">
                  Location Link <span className="text-danger">*</span>
                </Text>
                
                <Input
                bg={inputBg}
                color={textColor}
                  placeholder="Enter Branch Location Link"
                  value={formData.branches[index]?.locationLink || ''}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      branches: prevData.branches.map((branch, i) =>
                        i === index
                          ? { ...branch, locationLink: e.target.value }
                          : branch,
                      ),
                    }))
                  }
                />
              </Box>
            </Box>
          ))}

          {/* Save and Cancel Buttons */}
          <Flex justify="center" mt={6}>
            <Button
              variant="outline"
              colorScheme="red"
              mr={2}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={handleSubmit}
              isLoading={isUpdating}
            >
              Save Changes
            </Button>
          </Flex>
        </form>
      </Box>
    </div>
  );
};

export default EditPharmacy;
