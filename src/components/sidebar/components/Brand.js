import React from "react";

import { Image } from "@chakra-ui/react";
// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import Logo from "../../../assets/img/logo.png";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Image src={Logo} py={"10px"} w='200px' alt='logo' />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
