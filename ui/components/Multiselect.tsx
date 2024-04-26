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
  MenuDivider,
  MenuGroup,
  MenuItemOption,
  MenuList,
  Portal,
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
    groupedOptions,
    onChange,
    onClose,
    className,
    disabled,
    value,
    size,
    hasDefaultValue = true,
    variant = "input",
  }: {
    children: ReactNode;
    options?: { label: string; value: string }[];
    groupedOptions?: Record<string, { label: string; value: string }[]>;
    onChange?: (value: string[]) => void;
    onClose?: () => void;
    className?: string;
    disabled?: boolean;
    value: string[];
    size?: "sm" | "md";
    hasDefaultValue?: boolean;
    variant?: string;
  }) => {
    if (groupedOptions)
      return (
        <GroupedMultiselect
          groupedOptions={groupedOptions}
          onChange={onChange}
          onClose={onClose}
          className={className}
          disabled={disabled}
          value={value}
          size={size}
          hasDefaultValue={hasDefaultValue}
          variant={variant}
        >
          {children}
        </GroupedMultiselect>
      );
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
          <MenuList zIndex={3} maxWidth={450} pt="0">
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

const GroupedMultiselect = chakra(
  ({
    children,
    groupedOptions = {},
    onChange,
    onClose,
    className,
    disabled,
    value,
    size,
    hasDefaultValue = true,
    variant = "input",
  }: {
    children: ReactNode;
    groupedOptions: Record<string, { label: string; value: string }[]>;
    onChange?: (value: string[]) => void;
    onClose?: () => void;
    className?: string;
    disabled?: boolean;
    value: string[];
    size?: "sm" | "md";
    hasDefaultValue?: boolean;
    variant?: string;
  }) => {
    const stateValue = useRef<Map<string, string>>(new Map([["090", ""]]));

    const map = useMemo(() => {
      return new Map(
        value.map((val) => {
          return [
            val,
            (stateValue.current?.get?.(val) ||
              groupedOptions[
                Object.keys(groupedOptions).find((key) =>
                  groupedOptions[key].find(({ value }) => val === value)
                ) as string
              ]?.find(({ value }) => val === value)?.label) ??
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

    const [preparedOptions, setPreparedOptions] = useState<
      Record<string, { label: string; value: string }[]>
    >({});

    const prepareOptions = () => {
      const selectedOptions: Record<
        string,
        { label: string; value: string }[]
      > = {};
      const restOptions: Record<string, { label: string; value: string }[]> =
        {};
      Object.keys(groupedOptions).forEach((key) => {
        const selectedGroupOptions = groupedOptions[key].filter((option) =>
          map.get(option.value)
        );
        const restGroupOptions = groupedOptions[key].filter(
          (option) => !map.get(option.value)
        );
        if (selectedGroupOptions.length > 0) {
          selectedOptions[key] = selectedGroupOptions;
        }
        if (restGroupOptions.length > 0) {
          restOptions[key] = restGroupOptions;
        }
      });
      setPreparedOptions({ ...selectedOptions, ...restOptions });
    };

    const filterOptions = () => {
      return search
        ? Object.keys(preparedOptions).reduce(
            (acc, key) => {
              const filteredOptions = preparedOptions[key].filter(
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

    const showDefaultValue = () =>
      hasDefaultValue && Object.keys(groupedOptions).length === 1;

    const selectGroupOptions = (groupLabel: string) => {
      const options = groupedOptions[groupLabel];
      if (options) {
        const values = options.map((option) => option.value);
        const allOptionsSelected = values.every((value) => value in map);
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
          prepareOptions();
          handleSearch("");
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        onClose={() => {
          setLimit(150);
          onClose?.();
        }}
        closeOnSelect={false}
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
            {showDefaultValue() ? Object.keys(groupedOptions)[0] : children}
          </ButtonContent>
        </MenuButton>
        <Portal>
          <MenuList zIndex={3} maxWidth={450} pt="0">
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
              {Object.keys(filteredOptions).map((groupLabel) => (
                <Box key={groupLabel} p={0}>
                  <MenuGroup
                    title={groupLabel}
                    fontSize={12}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    lineHeight={"20px"}
                    onClick={() => selectGroupOptions(groupLabel)}
                    cursor={"pointer"}
                  >
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
