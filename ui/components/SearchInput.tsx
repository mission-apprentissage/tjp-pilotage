import { Search2Icon } from "@chakra-ui/icons";
import { Button, Flex, Input } from "@chakra-ui/react";

export const SearchInput = ({
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
    <Flex className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        w="sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick();
        }}
        bgColor={"white"}
        borderRightRadius={0}
      />
      <Button
        bgColor={"bluefrance.113"}
        size={"md"}
        onClick={() => onClick()}
        borderLeftRadius={0}
      >
        <Search2Icon color="white" />
      </Button>
    </Flex>
  );
};
