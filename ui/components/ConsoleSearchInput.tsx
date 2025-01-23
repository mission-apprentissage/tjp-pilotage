import { Search2Icon } from "@chakra-ui/icons";
import { Button, chakra, Flex, Input, VisuallyHidden } from "@chakra-ui/react";
import { useId } from "react";

export const ConsoleSearchInput = chakra(
  ({
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
      <Flex className={className} borderBottom={"1px solid"} borderColor={"bluefrance.113"} ps={0} pe={2}>
        <Button variant={"unstyled"} size={"md"} onClick={() => onClick()} ps={0} me={"auto"}>
          <VisuallyHidden>Rechercher</VisuallyHidden>
          <Search2Icon color="bluefrance.113" />
        </Button>
        <VisuallyHidden as="label" htmlFor={searchInputId}>Rechercher</VisuallyHidden>
        <Input
          id={searchInputId}
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
          _placeholder={{
            color: "blueecume.247_active",
          }}
          me={"auto"}
        />
      </Flex>
    );
  }
);
