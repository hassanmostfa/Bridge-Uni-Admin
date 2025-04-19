import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  FormControl,
  Input,
  Select,
  Text,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useGetCategoriesQuery } from "api/categorySlice";
import { useGetProviderQuery } from "api/providerSlice";
import { useGetAllProviderQuery } from "api/providerSlice";

const BasicInfoStep = ({ formData, handleChange,errors }) => {
  // Mock data for dropdowns
  const {data: categoriesResponse} = useGetCategoriesQuery();

  const {data: providersResponse} = useGetAllProviderQuery();
  const providers = providersResponse?.data?.data ?? [];
  const categories = categoriesResponse?.data?.data ?? [];


  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Basic Information</Text>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={2} spacing={4}>
          <FormControl isInvalid={!!errors.titleEn}>
            <Text fontSize="sm" fontWeight="700">
              Course Title (English) <span className="text-danger">*</span>
            </Text>
            <Input
              value={formData.titleEn}
              onChange={(e) => handleChange("titleEn", e.target.value)}
              placeholder="Enter course title in English"
              mt={2}
            />
            {errors.titleEn && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.titleEn}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.titleAr}>
            <Text fontSize="sm" fontWeight="700">
              Course Title (Arabic) <span className="text-danger">*</span>
            </Text>
            <Input
              value={formData.titleAr}
              onChange={(e) => handleChange("titleAr", e.target.value)}
              placeholder="أدخل عنوان الدورة بالعربية"
              dir="rtl"
              mt={2}
            />
            {errors.titleAr && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.titleAr}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.provider}>
            <Text fontSize="sm" fontWeight="700">
              Provider <span className="text-danger">*</span>
            </Text>
            <Select
              value={formData.provider}
              onChange={(e) => handleChange("provider", e.target.value)}
              placeholder="Select provider"
              mt={2}
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title_en}
                </option>
              ))}
            </Select>
            {errors.provider && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.provider}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.category}>
            <Text fontSize="sm" fontWeight="700">
              Category <span className="text-danger">*</span>
            </Text>
            <Select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Select category"
              mt={2}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title_en}
                </option>
              ))}
            </Select>
            {errors.category && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.category}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.featured}>
            <Flex align="center" mt={6}>
              <Text fontSize="sm" fontWeight="700" mr={2}>
                Featured Course
              </Text>
              <Switch
                isChecked={formData.featured}
                onChange={() => handleChange("featured", !formData.featured)}
                colorScheme="teal"
              />
            </Flex>
            {errors.featured && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.featured}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.soon}>
            <Flex align="center" mt={6}>
              <Text fontSize="sm" fontWeight="700" mr={2}>
                Coming Soon
              </Text>
              <Switch
                isChecked={formData.soon}
                onChange={() => handleChange("soon", !formData.soon)}
                colorScheme="teal"
              />
            </Flex>
            {errors.soon && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.soon}
              </Text>
            )}
          </FormControl>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default BasicInfoStep;