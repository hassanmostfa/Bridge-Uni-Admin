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

const MediaStep = ({ formData, handleChange, uploadCourseImageAPI, uploadBannerAPI, uploadPdfAPI }) => {
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
            <Text as="span">Uploading file...</Text>
          </Box>
        )}

        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <FileUploadField
            label="Course Image"
            value={formData?.courseImage}
            setValue={(val) => handleChange("courseImage", val)}
            accept="image/*"
            isRequired
            uploadFile={uploadCourseImageAPI}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
          />
          <FileUploadField
            label="Course Banner"
            value={formData?.courseBanner}
            setValue={(val) => handleChange("courseBanner", val)}
            accept="image/*"
            uploadFile={uploadBannerAPI}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
          />
          <FileUploadField
            label="Study Guide (PDF)"
            value={formData?.studyGuide}
            setValue={(val) => handleChange("studyGuide", val)}
            accept=".pdf"
            uploadFile={uploadPdfAPI}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

export default MediaStep;