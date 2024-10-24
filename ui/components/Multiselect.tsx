"use client";
import { ChevronDownIcon, RepeatIcon } from "@chakra-ui/icons";
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
  PositionProps,
  Text,
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
import removeAccents from "remove-accents";

const ButtonContent = ({
  selected,
  children,
}: {
  selected: string[];
  children: ReactNode;
}) => {
  if (!selected.length) return <>{children}</>;
  if (selected.length === 1) return <>{selected[0]}</>;
  return <>{selected.length} sélectionnés</>;
};

const Checkbox = ({
  value,
  onChange,
  children,
  checked,
}: {
  value: string;
  onChange: ChangeEventHandler;
  children: string;
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

const InputWapper = memo(
  ({
    onChange,
    ...props
  }: {
    value: string;
    onChange: (_: { checked: boolean; value: string; label: string }) => void;
    children: string;
    checked: boolean;
  }) => {
    return (
      <Checkbox
        onChange={(e) =>
          onChange({
            checked: (e.target as HTMLInputElement).checked,
            label: props.children,
            value: props.value,
          })
        }
        {...props}
      ></Checkbox>
    );
  }
);

const CheckboxIcon = ({ checked }: { checked: boolean }) => {
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
};

export const Multiselect = chakra(
  ({
    children,
    options = [],
    onChange,
    onClose,
    className,
    disabled,
    value,
    size,
    hasDefaultValue = true,
    variant = "input",
    menuZIndex,
    gutter,
  }: {
    children: ReactNode;
    options?: { label: string; value: string }[];
    onChange?: (value: string[]) => void;
    onClose?: () => void;
    className?: string;
    disabled?: boolean;
    value: string[];
    size?: "sm" | "md";
    hasDefaultValue?: boolean;
    variant?: string;
    menuZIndex?: PositionProps["zIndex"];
    gutter?: number;
  }) => {
    const stateValue = useRef<Map<string, string>>(new Map([["090", ""]]));

    const map = useMemo(() => {
      return new Map(
        value.map((val) => {
          return [
            val,
            (stateValue.current?.get?.(val) ||
              options.find(({ value }) => val === value)?.label) ??
              val,
          ];
        })
      );
    }, [value, options, stateValue.current]);

    const [search, setSearch] = useState("");

    const handleSearch = async (value: string) => {
      ref.current?.scrollTo({ top: 0 });
      setSearch(value);
    };

    const [preparedOptions, setPreparedOptions] = useState<typeof options>([]);

    const prepareOptions = () => {
      const selectedOptions = Array.from(map.entries()).map(
        ([value, label]) => ({ label, value })
      );
      const restOptions = options.filter((option) => !map.get(option.value));
      setPreparedOptions(selectedOptions.concat(restOptions));
    };

    const filterOptions = () => {
      return search
        ? preparedOptions.filter(
            (item) =>
              removeAccents(item.label?.toLowerCase()).includes(
                removeAccents(search.toLowerCase())
              ) ||
              removeAccents(item.value?.toLowerCase()).includes(
                removeAccents(search.toLowerCase())
              )
          )
        : preparedOptions;
    };

    const filteredOptions = useMemo(filterOptions, [
      preparedOptions,
      search,
      map,
    ]);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [limit, setLimit] = useState(150);

    const showDefaultValue = () => hasDefaultValue && options.length === 1;

    return (
      <Menu
        isLazy={true}
        onOpen={() => {
          unstable_batchedUpdates(() => {
            prepareOptions();
            handleSearch("");
          });
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        onClose={() => {
          setLimit(150);
          onClose?.();
        }}
        closeOnSelect={false}
        gutter={gutter}
      >
        <MenuButton
          as={Button}
          size={size ?? "sm"}
          isDisabled={disabled || showDefaultValue()}
          pointerEvents={disabled ? "none" : "unset"}
          className={className}
          variant={variant}
          borderColor={value.length ? "info.525" : "grey.950"}
          borderWidth={value.length ? "1.5px" : "1px"}
          rightIcon={<ChevronDownIcon />}
        >
          <ButtonContent selected={Array.from(map.values())}>
            {showDefaultValue() ? options[0].label : children}
          </ButtonContent>
        </MenuButton>
        <Portal>
          <MenuList maxWidth={450} pt="0" zIndex={menuZIndex}>
            <Flex borderBottom="1px solid" borderBottomColor="grey.900">
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
              <Button
                onClick={() => {
                  stateValue.current = new Map();
                  onChange?.(Array.from(new Map().keys()));
                }}
                bgColor={"transparent"}
              >
                {map.size > 0 && (
                  <Text
                    fontSize={12}
                    fontWeight={"normal"}
                    color="bluefrance.113"
                    p={2}
                  >
                    <RepeatIcon ml={1} mr={1} verticalAlign={"bottom"} />
                    Tout décocher
                  </Text>
                )}
              </Button>
            </Flex>
            <Flex
              direction="column"
              ref={ref}
              maxHeight={300}
              overflow="auto"
              sx={{ "> *": { px: "3", py: "1.5" } }}
            >
              {filteredOptions.slice(0, limit).map(({ value, label }) => (
                <InputWapper
                  key={value}
                  checked={!!map.get(value)}
                  onChange={({ checked, label, value }) => {
                    const newMap = new Map(map);
                    if (checked) {
                      newMap.set(value, label);
                    } else {
                      newMap.delete(value);
                    }
                    stateValue.current = newMap;
                    onChange?.(Array.from(newMap.keys()));
                  }}
                  value={value}
                >
                  {label}
                </InputWapper>
              ))}
              {filteredOptions.length > limit && (
                <Box px="3">
                  <Button
                    size="sm"
                    w="100%"
                    onClick={() => setLimit(limit + 100)}
                  >
                    Afficher plus
                  </Button>
                </Box>
              )}
            </Flex>
          </MenuList>
        </Portal>
      </Menu>
    );
  }
);
