import { Search2Icon } from "@chakra-ui/icons";
import { Button, Flex, Input, VisuallyHidden } from "@chakra-ui/react";
import { useId } from "react";

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

  const searchInputId = useId();
  return (
    <Flex className={className}>
      <VisuallyHidden as="label" htmlFor={searchInputId}>Rechercher</VisuallyHidden>
      <Input
        id={searchInputId}
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
      <Button bgColor={"bluefrance.113"} size={"md"} onClick={() => onClick()} borderLeftRadius={0}>
        <VisuallyHidden>Rechercher</VisuallyHidden>
        <Search2Icon color="white" />
      </Button>
    </Flex>
  );
};
