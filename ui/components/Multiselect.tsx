"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import {
  ChangeEventHandler,
  memo,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-dom";

const ButtonContent = ({
  selected,
  children,
}: {
  selected: string[];
  children: ReactNode;
}) => {
  if (!selected.length) return <>{children}</>;
  if (selected.length === 1) return <>{selected[0]}</>;
  return <>{selected.length} séléctionné</>;
};

const Checkbox = ({
  value,
  onChange,
  children,
  checked,
}: {
  value: string;
  onChange: ChangeEventHandler;
  children: ReactNode;
  checked: boolean;
}) => {
  return (
    <label style={{ display: "flex", alignItems: "center" }}>
      <input
        checked={checked}
        value={value}
        onChange={onChange}
        hidden
        type="checkbox"
      />
      <CheckboxIcon checked={checked} />
      {children}
    </label>
  );
};

const CheckboxIcon = memo(({ checked }: { checked: boolean }) => {
  return (
    <Flex
      align="center"
      justify="center"
      border="2px solid"
      height="1rem"
      width="1rem"
      mr="2"
      mt="2px"
      borderRadius="2"
      bg={checked ? "bluefrance.113" : ""}
      transition="background 200ms, border-color 200ms"
      flexShrink="0"
      borderColor={checked ? "bluefrance.113" : "grey.900"}
    >
      {checked && (
        <svg
          fontSize="8px"
          viewBox="0 0 12 10"
          style={{
            width: "1.2em",
            height: "1.2em",
            fill: "none",
            strokeWidth: 2,
            stroke: "white",
            strokeDasharray: 16,
          }}
        >
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      )}
    </Flex>
  );
});

export const Multiselect = chakra(
  ({
    children,
    options = [],
    onChange,
    className,
  }: {
    children: ReactNode;
    options?: { label: string; value: string }[];
    onChange?: (value: string[]) => void;
    className?: string;
  }) => {
    const [selected, setSelected] = useState(new Map());

    const handleChange = (
      { value, label }: typeof options[number],
      checked: boolean
    ) => {
      if (checked) {
        const newSelected = new Map(selected);
        newSelected.set(value, label);
        setSelected(newSelected);
        onChange?.(Array.from(newSelected.keys()));
      } else {
        const newSelected = new Map(selected);
        newSelected.delete(value);
        setSelected(newSelected);
        onChange?.(Array.from(newSelected.keys()));
      }
    };

    const [search, setSearch] = useState("");

    const handleSearch = async (value: string) => {
      ref.current?.scrollTo({ top: 0 });
      setSearch(value);
    };

    const [preparedOptions, setPreparedOptions] = useState<typeof options>([]);

    const prepareOptions = () => {
      const selectedOptions = Array.from(selected.entries()).map(
        ([value, label]) => ({ label, value })
      );
      const restOptions = options.filter(
        (option) => !selected.get(option.value)
      );
      setPreparedOptions(selectedOptions.concat(restOptions));
    };

    const filterOptions = () => {
      return search
        ? preparedOptions.filter(
            (item) =>
              item.label &&
              item.label?.toLowerCase().includes(search.toLowerCase())
          )
        : preparedOptions;
    };

    const filteredOptions = useMemo(filterOptions, [
      preparedOptions,
      search,
      selected,
    ]);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <Menu
        isLazy={true}
        onOpen={() => {
          unstable_batchedUpdates(() => {
            prepareOptions();
            handleSearch("");
          });
          setTimeout(() => inputRef.current?.focus());
        }}
        closeOnSelect={false}
      >
        <MenuButton
          size="sm"
          className={className}
          variant="input"
          as={Button}
          rightIcon={<ChevronDownIcon />}
        >
          <ButtonContent selected={Array.from(selected.values())}>
            {children}
          </ButtonContent>
        </MenuButton>
        <Portal>
          <MenuList maxWidth={450} pt="0">
            <Box borderBottom="1px solid" borderBottomColor="grey.900">
              <Input
                ref={inputRef}
                placeholder="Rechercher dans la liste"
                value={search}
                onInput={(e) =>
                  handleSearch((e.target as HTMLInputElement).value)
                }
                px="3"
                py="2"
                variant="unstyled"
              />
            </Box>
            <Flex
              direction="column"
              ref={ref}
              maxHeight={300}
              overflow="auto"
              sx={{
                "> *": {
                  px: "3",
                  py: "1.5",
                },
              }}
            >
              {filteredOptions.map(({ value, label }) => (
                <Checkbox
                  key={value}
                  checked={!!selected.get(value)}
                  onChange={(e) =>
                    handleChange(
                      { value, label },
                      (e.target as HTMLInputElement).checked
                    )
                  }
                  value={value}
                >
                  {label}
                </Checkbox>
              ))}
            </Flex>
          </MenuList>
        </Portal>
      </Menu>
    );
  }
);
