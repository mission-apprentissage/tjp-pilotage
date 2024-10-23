import { Search2Icon } from "@chakra-ui/icons";
import { Button, Flex, Input } from "@chakra-ui/react";

export const ConsoleSearchInput = ({
  className,
  value,
  onChange,
  onClick,
  placeholder,
}: {
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  onClick: () => void;
  placeholder: string;
}) => {
  return (
    <Flex
      className={className}
      borderBottom={"1px solid"}
      borderColor={"bluefrance.113"}
      ps={0}
      pe={2}
    >
      <Button
        variant={"unstyled"}
        size={"md"}
        onClick={() => onClick()}
        ps={0}
        me={"auto"}
      >
        <Search2Icon color="bluefrance.113" />
      </Button>
      <Input
        variant={"unstyled"}
        type="text"
        placeholder={placeholder}
        w="xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick();
        }}
        bgColor={"white"}
        borderRightRadius={0}
        _placeholder={{ color: "blueecume.247_active" }}
      />
    </Flex>
  );
};
