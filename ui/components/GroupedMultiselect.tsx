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
  VisuallyHidden,
} from "@chakra-ui/react";
import type { ChangeEventHandler, ReactNode } from "react";
import React, { memo, useId, useMemo, useRef, useState } from "react";
import removeAccents from "remove-accents";
import type { OptionType } from "shared/schema/optionSchema";

const ButtonContent = ({ selected, children }: { selected: string[]; children: ReactNode }) => {
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
      <input checked={checked} value={value} onChange={onChange} hidden type="checkbox" />
      <CheckboxIcon checked={checked} />
      {children}
    </label>
  );
};

// eslint-disable-next-line react/display-name
const InputWapper = memo(
  ({
    onChange,
    ...props
  }: {
    value: string;
    onChange: (_: { checked: boolean; value: string; label: string }) => void;
    children: string;
    checked: boolean;
    isReadOnly?: boolean;
  }) => {
    return (
      <Checkbox
        onChange={(e) =>
          props.isReadOnly
            ? undefined
            : onChange({
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
      {
        color?: string;
        options: (OptionType & { isDisabled?: boolean })[];
      }
    >;
    readonly defaultOptions?: OptionType[];
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

    const getDefaultMapOptions = () => {
      if (!defaultOptions) return new Map();
      return new Map(defaultOptions.map(({ value, label }) => [value, label]));
    };

    const map = useMemo(() => {
      return new Map(
        value.map((val) => {
          return [
            val,
            (
              groupedOptions[
                Object.keys(groupedOptions).find((key) =>
                  groupedOptions[key].options.find(({ value }) => val === value)
                ) as string
              ]?.options.find(({ value }) => val === value)?.label) ??
              val,
          ];
        })
      );
    }, [value, groupedOptions]);

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
                removeAccents(item.label?.toLowerCase()).includes(removeAccents(search.toLowerCase())) ||
                  removeAccents(item.value?.toLowerCase()).includes(removeAccents(search.toLowerCase()))
            );
            if (filteredOptions.length > 0) {
              acc[key] = filteredOptions;
            }
            return acc;
          },
            {} as Record<string, { label: string; value: string; isDisabled?: boolean }[]>
        )
        : Object.keys(groupedOptions).reduce(
          (acc, key) => {
            const unFilteredOptions = groupedOptions[key].options;
            if (unFilteredOptions.length > 0) {
              acc[key] = unFilteredOptions;
            }
            return acc;
          },
            {} as Record<string, { label: string; value: string; isDisabled?: boolean }[]>
        );
    };

    const filteredOptions = useMemo(filterOptions, [groupedOptions, search]);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const id = useId();

    const [limit, setLimit] = useState(150);

    const showDefaultValue = () => hasDefaultValue && Object.keys(groupedOptions).length === 1;

    const selectGroupOptions = (groupLabel: string) => {
      const options = groupedOptions[groupLabel].options;
      if (options) {
        const values = options.filter((option) => !option.isDisabled).map((option) => option.value);
        const allOptionsSelected = values.every((value) => map.has(value));
        if (allOptionsSelected) {
          onChange?.(value.filter((val) => !values.includes(val)));
        } else {
          // @ts-expect-error TODO
          onChange?.([...new Set([...value, ...values])]);
        }
      }
    };

    return (
      <Menu
        onOpen={() => {
          handleSearch("");
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        onClose={() => {
          setLimit(150);
          onClose?.();
        }}
        closeOnSelect={false}
        preventOverflow={false}
      >
        {customButton ? (
          customButton
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
              <VisuallyHidden as="label" htmlFor={id}>
                Rechercher dans la liste
              </VisuallyHidden>
              <Input
                id={id}
                ref={inputRef}
                placeholder="Rechercher dans la liste"
                value={search}
                onInput={async (e) => handleSearch((e.target as HTMLInputElement).value)}
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
                    <Text fontSize={12} fontWeight={"normal"} color="bluefrance.113" p={2}>
                      Réinitialiser
                    </Text>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onChange?.(Array.from(new Map().keys()));
                  }}
                  bgColor={"transparent"}
                >
                  {map.size > 0 && (
                    <Text fontSize={12} fontWeight={"normal"} color="bluefrance.113" p={2}>
                      Tout décocher
                    </Text>
                  )}
                </Button>
              )}
            </Flex>
            <Flex direction="column" ref={ref} maxHeight={300} overflow="auto" sx={{ "> *": { px: "3", py: "1.5" } }}>
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
                    {filteredOptions[groupLabel].map(({ value, label, isDisabled }) => (
                      <MenuItemOption key={value} isDisabled={isDisabled}>
                        <InputWapper
                          isReadOnly={isDisabled}
                          checked={!!map.get(value)}
                          onChange={({ checked, label, value }) => {
                            const newMap = new Map(map);
                            if (checked) {
                              newMap.set(value, label);
                            } else {
                              newMap.delete(value);
                            }
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
                  <Button size="sm" w="100%" onClick={() => setLimit(limit + 100)}>
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
