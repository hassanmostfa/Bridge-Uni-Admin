import React, { useState, useRef } from "react";
import {
  FormControl,
  Text,
  Box,
  Icon,
  Button,
  Input,
  Image,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { FaUpload, FaTrash } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";
import { useDeleteFileMutation } from "api/filesSlice";

const FileUploadField = ({
  label,
  error,
  value,
  setValue,
  accept,
  isRequired = false,
  uploadFile,
  onUploadStart,
  onUploadEnd,
}) => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
    const [addFile] = useAddFileMutation();
    const [deleteFile] = useDeleteFileMutation();
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
    handleFileChange(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileChange(files);
    e.target.value = ''; // Clear input to allow selecting the same file again
  };

  const handleFileChange = async (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      return;
    }
    if (accept === ".pdf" && file.type !== "application/pdf") {
      return;
    }

    try {
      setIsUploading(true);
      onUploadStart?.();
      const fileFormData = new FormData();
      fileFormData.append('img', file);
      // Upload file to API and get URL
      const fileUrl = await addFile(fileFormData).unwrap();
      console.log(fileUrl);
      
      // Set the value to the URL (or file object if you prefer)
      setValue(fileUrl?.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  const handleRemoveFile = async () => {
    setValue(null);
    await deleteFile(value);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <Text fontSize="sm" fontWeight="700" mb="2">
        {label} {isRequired && <Text as="span" color="red.500">*</Text>}
      </Text>
      <Box
        border="1px dashed"
        borderColor={isDragging ? "blue.500" : "gray.200"}
        borderRadius="md"
        p={4}
        textAlign="center"
        backgroundColor={isDragging ? "blue.50" : "gray.100"}
        cursor="pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        transition="all 0.2s"
        position="relative"
      >
        {isUploading ? (
          <Flex direction="column" align="center" justify="center" minH="120px">
            <Spinner size="lg" mb={4} />
            <Text>Uploading...</Text>
          </Flex>
        ) : value ? (
          <Box>
            {accept.includes("image") ? (
              <Box position="relative">
                <Image
                  src={value}
                  alt="Preview"
                  width="100%"
                  maxH="200px"
                  objectFit="contain"
                  borderRadius="md"
                />
                <Button
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  onClick={handleRemoveFile}
                >
                  <FaTrash />
                </Button>
              </Box>
            ) : (
              <Flex direction="column" align="center">
                <Text mb={2}>PDF File Uploaded</Text>
                <a href={value} target="blank" className="btn btn-primary my-1">See File</a>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={handleRemoveFile}
                >
                  Remove File
                </Button>
              </Flex>
            )}
          </Box>
        ) : (
          <>
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop {accept.includes("image") ? "Image" : "PDF"} Here
            </Text>
            <Text color="gray.500" mb={2}>
              or
            </Text>
            <Button
              variant="outline"
              color="#422afb"
              border="none"
              onClick={() => fileInputRef.current.click()}
            >
              Browse Files
              <Input
                type="file"
                hidden
                ref={fileInputRef}
                accept={accept}
                onChange={handleFileInputChange}
              />
            </Button>
          </>
        )}
      </Box>
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default FileUploadField;