import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import MiniStatistics from "components/card/MiniStatistics";
import {
  MdOutlineAssignment,
  MdOutlineComputer,
  MdOutlineFlightTakeoff,
  MdOutlineLibraryBooks,
  MdOutlineListAlt,
  MdOutlineSchool,
  MdOutlineAdminPanelSettings,
  MdOutlinePersonAdd,
  MdOutlineHelpCenter,
  MdOutlineAccountBalance,
} from "react-icons/md";
import { useGetAdminDashboardQuery } from "api/userSlice";
import { useEffect } from "react";

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const {data:statics,refetch} = useGetAdminDashboardQuery();
  const data = statics?.data || {};
  
  useEffect(()=>{
    refetch();
  },[]);

  const cardData = [
    { name: "Total Applications", value: data?.totalApplications, icon: MdOutlineAssignment },
    { name: "Online Course Applications", value: data?.onlineCourseApplications, icon: MdOutlineComputer },
    { name: "Study Abroad Applications", value: data?.studyAbroadApplications, icon: MdOutlineFlightTakeoff },
    { name: "Total Online Courses", value: data?.totalOnlineCourse, icon: MdOutlineLibraryBooks },
    { name: "Total Short Courses", value: data?.totalShortCourse, icon: MdOutlineListAlt },
    { name: "Total Study Abroad", value: data?.totalStudyAbroad, icon: MdOutlineFlightTakeoff },
    { name: "Total Majors", value: data?.totalMajors, icon: MdOutlineSchool },
    { name: "Join Us Requests", value: data?.joinUsRequests, icon: MdOutlinePersonAdd },
    { name: "Total Inquiries", value: data?.totalInquiries, icon: MdOutlineHelpCenter },
    { name: "Total Providers", value: data?.totalProviders, icon: MdOutlineAccountBalance },
    { name: "Total Admins", value: data?.totalAdmins, icon: MdOutlineAdminPanelSettings },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Updated Cards Section */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px" mb="20px">
        {cardData.map((card, index) => (
          <MiniStatistics
            key={index}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={<Icon w="32px" h="32px" as={card.icon} color={brandColor} />}
              />
            }
            name={card.name}
            value={card.value}
          />
        ))}
      </SimpleGrid>

      {/* You can place additional components here if needed */}
    </Box>
  );
}

