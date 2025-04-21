import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Grid,
  FormControl,
  Text,
  Box,
  Icon,
  Button,
  Input,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import FileUploadField from "./FileUploadField";
import MultiFileUpload from "./MultiFileUpload";
const MediaStep = ({ 
  formData, 
  handleChange, 
  uploadMainImageAPI, 
  uploadGalleryImagesAPI, 
  errors 
}) => {
  const [uploadCount, setUploadCount] = useState(0);
  const isAnyUploading = uploadCount > 0;

  const handleUploadStart = () => setUploadCount((prev) => prev + 1);
  const handleUploadEnd = () => setUploadCount((prev) => Math.max(prev - 1, 0));

  return (
    <Card mb={4}>
      <CardHeader bg="gray.100" p={3}>
        <Text fontWeight="bold">Media</Text>
      </CardHeader>
      <CardBody>
        {isAnyUploading && (
          <Box mb={4}>
            <Spinner size="md" color="blue.500" mr={2} />
            <Text as="span">Uploading file(s)...</Text>
          </Box>
        )}

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <FileUploadField
            label="Main Program Image"
            value={formData.mainImage}
            setValue={(val) => handleChange("mainImage", val)}
            accept="image/*"
            isRequired
            uploadFile={uploadMainImageAPI}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
            error={errors.mainImage}
          />

          <MultiFileUpload
            label="Gallery Images"
            files={formData.galleryImages}
            setValue={(files) => handleChange("galleryImages", files)}
            accept="image/*"
            uploadFile={uploadGalleryImagesAPI}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

export default MediaStep;