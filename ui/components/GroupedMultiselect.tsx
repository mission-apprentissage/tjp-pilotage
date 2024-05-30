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
  MenuDivider,
  MenuGroup,
  MenuItemOption,
  MenuList,
  Portal,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, {
  ChangeEventHandler,
  memo,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
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

export const GroupedMultiselect = chakra(
  ({
    children,
    groupedOptions = {},
    defaultOptions,
    onChange,
    onClose,
    className,
    disabled,
    value,
    size,
    hasDefaultValue = true,
    variant = "input",
    customButton,
  }: {
    children?: ReactNode;
    groupedOptions: Record<
      string,
      { color?: string; options: { label: string; value: string }[] }
    >;
    readonly defaultOptions?: { label: string; value: string }[];
    onChange?: (value: string[]) => void;
    onClose?: () => void;
    className?: string;
    disabled?: boolean;
    value: string[];
    size?: "sm" | "md";
    hasDefaultValue?: boolean;
    variant?: string;
    customButton?: ReactNode;
  }) => {
    const stateValue = useRef<Map<string, string>>(new Map([["090", ""]]));

    const getDefaultMapOptions = () => {
      if (!defaultOptions) return new Map();
      return new Map(defaultOptions.map(({ value, label }) => [value, label]));
    };

    const map = useMemo(() => {
      return new Map(
        value.map((val) => {
          return [
            val,
            (stateValue.current?.get?.(val) ||
              groupedOptions[
                Object.keys(groupedOptions).find((key) =>
                  groupedOptions[key].options.find(({ value }) => val === value)
                ) as string
              ]?.options.find(({ value }) => val === value)?.label) ??
              val,
          ];
        })
      );
    }, [value, groupedOptions, stateValue.current]);

    const [search, setSearch] = useState("");

    const handleSearch = async (value: string) => {
      ref.current?.scrollTo({ top: 0 });
      setSearch(value);
    };

    const filterOptions = () => {
      return search
        ? Object.keys(groupedOptions).reduce(
            (acc, key) => {
              const filteredOptions = groupedOptions[key].options.filter(
                (item) =>
                  removeAccents(item.label?.toLowerCase()).includes(
                    removeAccents(search.toLowerCase())
                  ) ||
                  removeAccents(item.value?.toLowerCase()).includes(
                    removeAccents(search.toLowerCase())
                  )
              );
              if (filteredOptions.length > 0) {
                acc[key] = filteredOptions;
              }
              return acc;
            },
            {} as Record<string, { label: string; value: string }[]>
          )
        : Object.keys(groupedOptions).reduce(
            (acc, key) => {
              const unFilteredOptions = groupedOptions[key].options;
              if (unFilteredOptions.length > 0) {
                acc[key] = unFilteredOptions;
              }
              return acc;
            },
            {} as Record<string, { label: string; value: string }[]>
          );
    };

    const filteredOptions = useMemo(filterOptions, [
      groupedOptions,
      search,
      map,
    ]);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [limit, setLimit] = useState(150);

    const showDefaultValue = () =>
      hasDefaultValue && Object.keys(groupedOptions).length === 1;

    const selectGroupOptions = (groupLabel: string) => {
      const options = groupedOptions[groupLabel].options;
      if (options) {
        const values = options.map((option) => option.value);
        const allOptionsSelected = values.every((value) => map.has(value));
        if (allOptionsSelected) {
          onChange?.(value.filter((val) => !values.includes(val)));
        } else {
          onChange?.([...new Set([...value, ...values])]);
        }
      }
    };

    return (
      <Menu
        isLazy={true}
        onOpen={() => {
          handleSearch("");
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        onClose={() => {
          setLimit(150);
          onClose?.();
        }}
        closeOnSelect={false}
        flip={false}
        preventOverflow={false}
        placement={"top"}
      >
        {customButton ? (
          <MenuButton as={Flex} cursor={"pointer"} h={"fit-content"}>
            {customButton}
          </MenuButton>
        ) : (
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
              {showDefaultValue() ? Object.keys(groupedOptions)[0] : children}
            </ButtonContent>
          </MenuButton>
        )}
        <Portal>
          <MenuList zIndex={"sticky"} maxWidth={450} pt="0">
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
              {defaultOptions ? (
                <Button
                  onClick={() => {
                    const mapDefaultOptions = getDefaultMapOptions();
                    if (!mapDefaultOptions) return;
                    onChange?.(Array.from(mapDefaultOptions.keys()));
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
                      Réinitialiser
                    </Text>
                  )}
                </Button>
              ) : (
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
                      Tout décocher
                    </Text>
                  )}
                </Button>
              )}
            </Flex>
            <Flex
              direction="column"
              ref={ref}
              maxHeight={300}
              overflow="auto"
              sx={{ "> *": { px: "3", py: "1.5" } }}
            >
              {Object.keys(filteredOptions).map((groupLabel) => (
                <Box key={groupLabel} p={0}>
                  <MenuGroup>
                    <Tag
                      bgColor={groupedOptions[groupLabel].color}
                      fontSize={12}
                      textTransform={"uppercase"}
                      fontWeight={700}
                      lineHeight={"20px"}
                      onClick={() => selectGroupOptions(groupLabel)}
                      cursor={"pointer"}
                      ms={5}
                      my={2}
                    >
                      {groupLabel}
                    </Tag>
                    {filteredOptions[groupLabel].map(({ value, label }) => (
                      <MenuItemOption key={value}>
                        <InputWapper
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
                      </MenuItemOption>
                    ))}
                  </MenuGroup>
                  <MenuDivider mb={0} />
                </Box>
              ))}
              {Object.keys(filteredOptions).length === 0 && (
                <Text px="3" py="1.5" color="gray.500" textAlign="center">
                  Aucun résultat trouvé.
                </Text>
              )}
              {Object.keys(filteredOptions).length > limit && (
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
