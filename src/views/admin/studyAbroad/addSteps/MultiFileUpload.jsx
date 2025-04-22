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
  const [urls,setUrls] = useState([]);

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
    if (files && files.length > 0) {
      handleFileChange(files);
    }
    e.target.value = ''; // Clear input to allow selecting the same files again
  };

  const handleFileChange = async (files) => {
    if (!files || files.length === 0) return;
    
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
        file, // Store the actual file object
        progress: 0
      }));
      setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

      const uploadedUrls = [];
      
      for (let i = 0; i < newUploadingFiles.length; i++) {
        const { name, file } = newUploadingFiles[i];
        try {
          const fileFormData = new FormData();
          fileFormData.append('img', file);
          
          const result = await addFile(fileFormData).unwrap();
          if (result?.url) {
            uploadedUrls.push(result.url);
            
            
          }
        
          
        } catch (err) {
          console.error(`Failed to upload ${name}:`, err);
        } finally {
          // Remove this file from uploading state
          setUploadingFiles(prev => prev.filter(f => f.name !== name));
        }
      }

      if (uploadedUrls.length > 0) {
        setValue(uploadedUrls);
        console.log(value);
        
        setUrls(uploadedUrls);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      onUploadEnd?.();
    }
    
    
  };

  const handleRemoveFile = async (url) => {
    try {
      // await deleteFile(url).unwrap();
      console.log(url);
      
      setValue(value.filter(u => u !== url));      
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
      {(value?.length > 0 || uploadingFiles.length > 0) && (
        <Box mt={4}>
          <Text fontSize="sm" mb={2}>
            {value?.length > 0 ? "Uploaded files:" : "Uploading files:"}
          </Text>
          <List spacing={2}>
            
            {(Array.isArray(value)) && value?.map((url, index) => (
              <ListItem 
                key={url} // Using URL as key is better than index
                display="flex" 
                alignItems="center"
                p={2}
                bg="gray.50"
                borderRadius="md"
              >
                <ListIcon as={FaCheck} color="green.500" />
                <Box flex="1" overflow="hidden">
                  {accept.includes("image") ? (
                    <Flex align="center">
                      <Image 
                        src={url} 
                        alt={`Uploaded ${index}`}
                        maxH="50px"
                        maxW="100px"
                        objectFit="contain"
                        mr={2}
                      />
                      <Text isTruncated>{url.split('/').pop()}</Text>
                    </Flex>
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
            
            {uploadingFiles.map((file) => (
              <ListItem 
                key={`uploading-${file.name}`} 
                display="flex" 
                alignItems="center"
                p={2}
                bg="gray.50"
                borderRadius="md"
              >
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