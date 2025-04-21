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
  List,
  ListItem,
  ListIcon,
  IconButton,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaCheck } from "react-icons/fa6";
import { useAddFileMutation } from "api/filesSlice";
import { useDeleteFileMutation } from "api/filesSlice";

const MultiFileUpload = ({
  label,
  error,
  value = [],
  setValue,
  accept = "image/*",
  isRequired = false,
  onUploadStart,
  onUploadEnd,
}) => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
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
    e.target.value = ''; // Clear input to allow selecting the same files again
  };

  const handleFileChange = async (files) => {
    if (!files || files.length === 0) return;
    
    // Filter files by accepted types
    const validFiles = Array.from(files).filter(file => {
      if (accept === "image/*") return file.type.startsWith("image/");
      if (accept === ".pdf") return file.type === "application/pdf";
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      onUploadStart?.();
      const newUploadingFiles = validFiles.map(file => ({
        name: file.name,
        progress: 0
      }));
      setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

      const uploadedUrls = [];
      
      // Upload files sequentially
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        try {
          const fileFormData = new FormData();
          fileFormData.append('img', file);
          
          // Upload file to API
          const result = await addFile(fileFormData).unwrap();
          if (result?.url) {
            uploadedUrls.push(result.url);
          }
          
          // Update uploading state
          setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        }
      }

      // Add all successfully uploaded URLs to the value array
      if (uploadedUrls.length > 0) {
        setValue(prev => [...prev, ...uploadedUrls]);
      }
    } finally {
      onUploadEnd?.();
    }
  };

  const handleRemoveFile = async (url, index) => {
    try {
      // Remove from server
      await deleteFile(url).unwrap();
      
      // Remove from local state
      setValue(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete file:", err);
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
        {uploadingFiles.length > 0 ? (
          <Flex direction="column" align="center" justify="center" minH="120px">
            <Spinner size="lg" mb={4} />
            <Text>Uploading {uploadingFiles.length} file(s)...</Text>
          </Flex>
        ) : (
          <>
            <Icon as={FaUpload} w={8} h={8} color="#422afb" mb={2} />
            <Text color="gray.500" mb={2}>
              Drag & Drop {accept.includes("image") ? "Images" : "Files"} Here
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
                multiple
              />
            </Button>
          </>
        )}
      </Box>

      {/* Uploaded files list */}
      {(value.length > 0 || uploadingFiles.length > 0) && (
        <Box mt={4}>
          <Text fontSize="sm" mb={2}>
            {value.length > 0 ? "Uploaded files:" : "Uploading files:"}
          </Text>
          <List spacing={2}>
            {value.map((url, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <ListIcon as={FaCheck} color="green.500" />
                <Box flex="1" isTruncated>
                  {accept.includes("image") ? (
                    <Image 
                      src={url} 
                      alt={`Uploaded ${index}`}
                      maxH="50px"
                      maxW="100px"
                      objectFit="contain"
                    />
                  ) : (
                    <Text isTruncated>{url.split('/').pop()}</Text>
                  )}
                </Box>
                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  ml={2}
                  colorScheme="red"
                  onClick={() => handleRemoveFile(url, index)}
                  aria-label="Remove file"
                />
              </ListItem>
            ))}
            {uploadingFiles.map((file, index) => (
              <ListItem key={`uploading-${index}`} display="flex" alignItems="center">
                <ListIcon as={Spinner} color="blue.500" />
                <Text isTruncated flex="1">{file.name}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default MultiFileUpload;