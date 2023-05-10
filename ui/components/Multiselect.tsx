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
  useReducer,
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

function useController<A, I>(
  reducer: (s: I, _: A) => I,
  initial: I,
  effect?: (v: I) => void
) {
  const [state, dispatch] = useReducer(reducer, initial);

  const stateRef = useRef(initial);
  stateRef.current = state;

  const effectRef = useRef(effect);
  effectRef.current = effect;

  const controller = useRef([
    state,
    (v: A) => {
      const val = reducer(stateRef.current, v);
      dispatch(v);
      effectRef.current?.(val);
    },
  ] as const);
  return [state, controller.current[1]] as const;
}

export const Multiselect = chakra(
  ({
    children,
    options = [],
    onChange,
    onClose,
    className,
  }: {
    children: ReactNode;
    options?: { label: string; value: string }[];
    onChange?: (value: string[]) => void;
    onClose?: () => void;
    className?: string;
  }) => {
    const [selected, dispatch] = useController(
      (
        state,
        {
          checked,
          value,
          label,
        }: { checked: boolean; value: string; label: string }
      ) => {
        const newSelected = new Map(state);
        if (checked) {
          newSelected.set(value, label);
          return newSelected;
        }
        newSelected.delete(value);
        return newSelected;
      },
      new Map(),
      (value) => onChange?.(Array.from(value.keys()))
    );

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
        ? preparedOptions.filter((item) =>
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

    const [limit, setLimit] = useState(150);

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
              sx={{ "> *": { px: "3", py: "1.5" } }}
            >
              {filteredOptions.slice(0, limit).map(({ value, label }) => (
                <InputWapper
                  key={value}
                  checked={!!selected.get(value)}
                  onChange={dispatch}
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
