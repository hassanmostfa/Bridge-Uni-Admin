import {
  Flex,
  Box,
  Card,
  Text,
  Input,
  Checkbox,
  Stack,
  useColorModeValue,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import Swal from 'sweetalert2';
import { useGetRolePermissiosQuery, useUpdateRoleMutation, useGetRolesQuery } from 'api/roleSlice';

const EditRole = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch all roles to get the role name
  const { data: rolesData } = useGetRolesQuery();
  // Fetch role permissions
  const { data: permissionsData, isLoading: isPermissionsLoading, isError: isPermissionsError } = useGetRolePermissiosQuery(id);
  // Update role mutation
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  // State for modules and role name
  const [modules, setModules] = React.useState([]);
  const [roleName, setRoleName] = React.useState('');

  // Process data when loaded
  React.useEffect(() => {
    if (rolesData?.flag && permissionsData?.flag) {
      // Set role name
      const role = rolesData?.data?.data.find(r => r.id === parseInt(id));
      if (role) setRoleName(role.name);

      // Transform permissions data into modules structure
      const transformedModules = permissionsData.data.map(modulePermission => {
        const module = modulePermission.role_module;
        
        // Get the first table_role for the module (if exists)
        const moduleTableRole = modulePermission;

        // Process submodules
        const submodules = module.role_sub_modules?.map(submodule => {
          // Get the first table_role for the submodule (if exists)
          const submoduleTableRole = submodule.table_roles?.[0] || {
            can_view: false,
            can_add: false,
            can_update: false,
            can_delete: false
          };

          return {
            id: submodule.id,
            name: submodule.displayName,
            permissions: {
              canView: submoduleTableRole.can_view,
              canAdd: submoduleTableRole.can_add,
              canEdit: submoduleTableRole.can_update,
              canDelete: submoduleTableRole.can_delete,
            },
            tableRoleId: submoduleTableRole.id // Store the table_role ID for updates
          };
        }) || [];

        return {
          id: module.id,
          name: module.displayName,
          permissions: {
            canView: modulePermission.can_view,
            canAdd: modulePermission.can_add,
            canEdit: modulePermission.can_update,
            canDelete: modulePermission.can_delete,
          },
          tableRoleId: modulePermission.id, // Store the table_role ID for updates
          submodules
        };
      });

      setModules(transformedModules);
    }
  }, [rolesData, permissionsData, id]);

  // Handle permission change for modules
  const handleModulePermissionChange = (moduleId, permission) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          permissions: {
            ...module.permissions,
            [permission]: !module.permissions[permission],
          },
        };
      }
      return module;
    });
    setModules(updatedModules);
  };

  // Handle permission change for submodules
  const handleSubmodulePermissionChange = (moduleId, submoduleId, permission) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          submodules: module.submodules.map(submodule => {
            if (submodule.id === submoduleId) {
              return {
                ...submodule,
                permissions: {
                  ...submodule.permissions,
                  [permission]: !submodule.permissions[permission],
                },
              };
            }
            return submodule;
          }),
        };
      }
      return module;
    });
    setModules(updatedModules);
  };
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare module permissions (only include if any permission is true)
  const modulePermissions = modules
    .filter(module => 
      module.permissions.canView || 
      module.permissions.canAdd || 
      module.permissions.canEdit || 
      module.permissions.canDelete
    )
    .map(module => ({
      role_module_id: module.id,
      role_sub_module_id: 0, // 0 indicates module-level permission
      can_view: module.permissions.canView,
      can_add: module.permissions.canAdd,
      can_update: module.permissions.canEdit,
      can_delete: module.permissions.canDelete,
    }));

  // Prepare submodule permissions (only include if any permission is true)
  const submodulePermissions = modules.flatMap(module =>
    module.submodules
      .filter(submodule => 
        submodule.permissions.canView || 
        submodule.permissions.canAdd || 
        submodule.permissions.canEdit || 
        submodule.permissions.canDelete
      )
      .map(submodule => ({
        role_module_id: module.id,
        role_sub_module_id: submodule.id,
        can_view: submodule.permissions.canView,
        can_add: submodule.permissions.canAdd,
        can_update: submodule.permissions.canEdit,
        can_delete: submodule.permissions.canDelete,
      }))
  );

  // Combine both permissions
  const admin_role = [...modulePermissions, ...submodulePermissions];

  // Prepare the payload
  const payload = {
    name: e.target.roleName.value,
    admin_role,
  };

  try {
    // Send the data to the API
    await updateRole({ id, role: payload }).unwrap();
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Role updated successfully',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/undefined/rules');
      }
    });
  } catch (error) {
    console.log(error);
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.data?.message || 'Failed to update role',
      confirmButtonText: 'OK',
    });
  }
};

  if (isPermissionsLoading) {
    return <div>Loading...</div>;
  }

  if (isPermissionsError) {
    return <div>Error loading permissions data.</div>;
  }

  return (
    <div className="container">
      <Card
        flexDirection="column"
        w="100%"
        px="20px"
        py="20px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex justifyContent="space-between" align="center" w="100%" mb="20px">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Edit Role
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
        </Flex>
        <form onSubmit={handleSubmit}>
          {/* Role Name Input */}
          <Box mb="20px">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              Role Name
            </Text>
            <Input
              name="roleName"
              placeholder="Enter role name"
              size="sm"
              width={'50%'}
              required
              mt="8px"
              defaultValue={roleName}
            />
          </Box>

          {/* Modules and Submodules */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing="20px">
            {modules.map((module) => (
              <Card key={module.id} p="16px">
                <Box
                  display={'flex'}
                  gap={'10px'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Text
                    fontSize="lg"
                    paddingBottom={'5px'}
                    fontWeight="700"
                    mb="16px"
                    backdropBlur={'10px'}
                  >
                    {module.name}
                  </Text>
                  <Stack direction="row" spacing={4}>
                    <Checkbox
                      isChecked={module.permissions.canView}
                      onChange={() =>
                        handleModulePermissionChange(module.id, 'canView')
                      }
                    >
                      View
                    </Checkbox>
                    <Checkbox
                      isChecked={module.permissions.canAdd}
                      onChange={() =>
                        handleModulePermissionChange(module.id, 'canAdd')
                      }
                    >
                      Add
                    </Checkbox>
                    <Checkbox
                      isChecked={module.permissions.canEdit}
                      onChange={() =>
                        handleModulePermissionChange(module.id, 'canEdit')
                      }
                    >
                      Edit
                    </Checkbox>
                    <Checkbox
                      isChecked={module.permissions.canDelete}
                      onChange={() =>
                        handleModulePermissionChange(module.id, 'canDelete')
                      }
                    >
                      Delete
                    </Checkbox>
                  </Stack>
                </Box>
                <hr />
                {module.submodules.length > 0 ? (
                  module.submodules.map((submodule) => (
                    <Box
                      key={submodule.id}
                      mb="12px"
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Text fontSize="md" fontWeight="600" mb="8px">
                        {submodule.name}
                      </Text>

                      <Stack direction="row" spacing={4}>
                        <Checkbox
                          isChecked={submodule.permissions.canView}
                          onChange={() =>
                            handleSubmodulePermissionChange(
                              module.id,
                              submodule.id,
                              'canView',
                            )
                          }
                        >
                          View
                        </Checkbox>
                        <Checkbox
                          isChecked={submodule.permissions.canAdd}
                          onChange={() =>
                            handleSubmodulePermissionChange(
                              module.id,
                              submodule.id,
                              'canAdd',
                            )
                          }
                        >
                          Add
                        </Checkbox>
                        <Checkbox
                          isChecked={submodule.permissions.canEdit}
                          onChange={() =>
                            handleSubmodulePermissionChange(
                              module.id,
                              submodule.id,
                              'canEdit',
                            )
                          }
                        >
                          Edit
                        </Checkbox>
                        <Checkbox
                          isChecked={submodule.permissions.canDelete}
                          onChange={() =>
                            handleSubmodulePermissionChange(
                              module.id,
                              submodule.id,
                              'canDelete',
                            )
                          }
                        >
                          Delete
                        </Checkbox>
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.500" mt="8px">
                    No submodules available
                  </Text>
                )}
              </Card>
            ))}
          </SimpleGrid>

          {/* Submit Button */}
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            type="submit"
            mt="20px"
            isLoading={isUpdating}
          >
            Update Role
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditRole;