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

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const cardData = [
    { name: "Total Applications", value: "3,540", icon: MdOutlineAssignment },
    { name: "Online Course Applications", value: "1,240", icon: MdOutlineComputer },
    { name: "Study Abroad Applications", value: "820", icon: MdOutlineFlightTakeoff },
    { name: "Total Online Courses", value: "460", icon: MdOutlineLibraryBooks },
    { name: "Total Short Courses", value: "320", icon: MdOutlineListAlt },
    { name: "Total Study Abroad", value: "220", icon: MdOutlineFlightTakeoff },
    { name: "Total Majors", value: "85", icon: MdOutlineSchool },
    { name: "Join Us Requests", value: "120", icon: MdOutlinePersonAdd },
    { name: "Total Inquiries", value: "675", icon: MdOutlineHelpCenter },
    { name: "Total Providers", value: "34", icon: MdOutlineAccountBalance },
    { name: "Total Admins", value: "12", icon: MdOutlineAdminPanelSettings },
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
