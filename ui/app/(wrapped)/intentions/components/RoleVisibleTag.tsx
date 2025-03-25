import { Box, chakra, Tag, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

export const RoleVisibleTag = chakra(({ role, isChecked }: { role: string; isChecked: boolean }) => {
  const bluefrance113 = useToken("colors", "bluefrance.113");

  return isChecked ? (
    <Tag bgColor={"bluefrance.113"} color="white" borderRadius={"12px"} size={"lg"} paddingRight={0} paddingTop={0}>
      {role}
      <Box borderRadius={"100%"} marginBottom={"auto"} marginTop={"-4px"} marginRight={"-4px"} bgColor={"white"}>
        <Icon
          icon="ic:outline-check-circle"
          style={{
            color: bluefrance113,
          }}
        />
      </Box>
    </Tag>
  ) : (
    <Tag colorScheme="pink" borderRadius={"12px"} size={"lg"}>
      {role}
    </Tag>
  );
});
