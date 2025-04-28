import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  FormControl,
  Input,
  Text,
  Textarea,
  Flex,
  Switch,
} from '@chakra-ui/react';

const BasicInfoStep = ({ formData, handleChange, errors }) => {
  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Basic Information</Text>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={2} spacing={4}>
          <FormControl isInvalid={errors.titleEn}>
            <Text fontSize="sm" fontWeight="700">
              Program Title (English) <span className="text-danger">*</span>
            </Text>
            <Input
              value={formData.titleEn}
              onChange={(e) => handleChange('titleEn', e.target.value)}
              placeholder="Enter program title in English"
              mt={2}
            />
            {errors.titleEn && (
              <Text color="red.500" fontSize="sm">
                {errors.titleEn}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={errors.titleAr}>
            <Text fontSize="sm" fontWeight="700">
              Program Title (Arabic) <span className="text-danger">*</span>
            </Text>
            <Input
              value={formData.titleAr}
              onChange={(e) => handleChange('titleAr', e.target.value)}
              placeholder="أدخل عنوان البرنامج بالعربية"
              dir="rtl"
              mt={2}
            />
            {errors.titleAr && (
              <Text color="red.500" fontSize="sm">
                {errors.titleAr}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={errors.innerTitle}>
            <Text fontSize="sm" fontWeight="700">
              Inner Title
            </Text>
            <Input
              value={formData.innerTitle}
              onChange={(e) => handleChange('innerTitle', e.target.value)}
              placeholder="Enter inner title"
              mt={2}
            />
            {errors.innerTitle && (
              <Text color="red.500" fontSize="sm">
                {errors.innerTitle}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={errors.sectionTitle}>
            <Text fontSize="sm" fontWeight="700">
              Section Title
            </Text>
            <Input
              value={formData.sectionTitle}
              onChange={(e) => handleChange('sectionTitle', e.target.value)}
              placeholder="Enter inner title"
              mt={2}
            />
            {errors.sectionTitle && (
              <Text color="red.500" fontSize="sm">
                {errors.sectionTitle}
              </Text>
            )}
          </FormControl>
        </SimpleGrid>
        <FormControl mt={4} isInvalid={errors.description}>
          <Text fontSize="sm" fontWeight="700">
            Description <span className="text-danger">*</span>
          </Text>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter program description"
            rows={4}
            mt={2}
          />
          {errors.description && (
            <Text color="red.500" fontSize="sm">
              {errors.description}
            </Text>
          )}
        </FormControl>
        <FormControl>
          <Flex align="center" mt={6}>
            <Text fontSize="sm" fontWeight="700" mr={2}>
              Featured Program
            </Text>
            <Switch
              isChecked={formData.featured}
              onChange={() => handleChange('featured', !formData.featured)}
              colorScheme="teal"
            />
          </Flex>
        </FormControl>
        <FormControl >
          <Flex align="center" mt={6}>
            <Text fontSize="sm" fontWeight="700" mr={2}>
              Coming Soon
            </Text>
            <Switch
              isChecked={formData.soon}
              onChange={() => handleChange('soon', !formData.soon)}
              colorScheme="teal"
            />
          </Flex>
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default BasicInfoStep;
