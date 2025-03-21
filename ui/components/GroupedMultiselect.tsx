"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {Box, Button, chakra, Checkbox, CheckboxGroup,Flex, Input, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Tag, Text, Tooltip, VisuallyHidden} from '@chakra-ui/react';
import type { ReactNode } from "react";
import { useId, useMemo, useRef, useState } from "react";
import removeAccents from "remove-accents";
import type { OptionType } from "shared/schema/optionSchema";

const ButtonContent = ({ selected, children }: { selected: string[]; children: ReactNode }) => {
  if (!selected.length) return <>{children}</>;
  if (selected.length === 1) return <>{selected[0]}</>;
  return <>{selected.length} sélectionnés</>;
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
        options: (OptionType & { isDisabled?: boolean, tooltip?: ReactNode })[];
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
            {} as Record<string, { label: string; value: string; isDisabled?: boolean, tooltip?: ReactNode }[]>
        )
        : Object.keys(groupedOptions).reduce(
          (acc, key) => {
            const unFilteredOptions = groupedOptions[key].options;
            if (unFilteredOptions.length > 0) {
              acc[key] = unFilteredOptions;
            }
            return acc;
          },
            {} as Record<string, { label: string; value: string; isDisabled?: boolean, tooltip?: ReactNode }[]>
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
              onChange={async (e) => handleSearch((e.target as HTMLInputElement).value)}
              px="3"
              py="2"
              variant="unstyled"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            />
            {defaultOptions ? (
              <Button
                onClick={() => {
                  const mapDefaultOptions = getDefaultMapOptions();
                  if (!mapDefaultOptions) return;
                  onChange?.(Array.from(mapDefaultOptions.keys()));
                }}
                bgColor={"transparent"}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
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
                <MenuGroup as={CheckboxGroup}>
                  <Tag
                    as={MenuItem}
                    bgColor={groupedOptions[groupLabel].color}
                    fontSize={12}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    lineHeight={"20px"}
                    onClick={() => selectGroupOptions(groupLabel)}
                    cursor={"pointer"}
                    w={"fit-content"}
                    h={"fit-content"}
                    m={2}
                    p={2}
                    py={0}
                  >
                    {groupLabel}
                  </Tag>
                  {filteredOptions[groupLabel].map(({ value, label, isDisabled, tooltip }) => (
                    <Checkbox
                      key={value}
                      as={MenuItem}
                      isChecked={!!map.get(value)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newMap = new Map(map);
                        if (checked) {
                          newMap.set(value, label);
                        } else {
                          newMap.delete(value);
                        }
                        onChange?.(Array.from(newMap.keys()));
                      }}
                      value={value}
                      colorScheme="bluefrance"
                      iconColor={"white"}
                    >
                      <Tooltip label={tooltip} shouldWrapChildren>
                        {label}
                      </Tooltip>
                    </Checkbox>
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
      </Menu>
    );
  }
);
