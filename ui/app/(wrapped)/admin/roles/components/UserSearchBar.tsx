import { Badge, HStack, Skeleton, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import type { CSSObjectWithLabel, SingleValueProps } from "react-select";
import { components } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "@/api.client";
import { ROLES_LABELS } from "@/app/(wrapped)/admin/roles/const";
import { themeDefinition } from "@/theme/theme";
import { useAuth } from "@/utils/security/useAuth";

export type QueryResult = (typeof client.infer)["[GET]/user/search/:search"];
export type User = QueryResult[number];
type OptionType = {
  label: string;
  value: User;
};

const SingleValue = ({ ...props }: SingleValueProps<OptionType>) => {
  const value = props.getValue()[0].value;
  const role = value.role!;
  const firstName = value.firstname!;
  const lastName = value.lastname!;
  const codeRegion = value.codeRegion;

  return (
    <components.SingleValue {...props}>
      <HStack>
        <Text>
          {firstName} {lastName}{" "}
        </Text>
        <Badge variant="info" size="sm">
          {ROLES_LABELS[role](codeRegion).label}
        </Badge>
      </HStack>
    </components.SingleValue>
  );
};

interface UserSearchBarProps {
  updateUser: (user: User) => void;
  user: User | undefined;
}

const UserSearchBar = ({ updateUser, user }: UserSearchBarProps) => {
  const { auth } = useAuth();

  const { data: defaultValues, isLoading } = client
    .ref("[GET]/user/search/:search")
    .useQuery({ params: { search: auth!.user!.email } });

  useEffect(() => {
    if (!isLoading && defaultValues) {
      // TODO: Fix User type.
      // Le cast est nécessaire ici puisque le type utilisateur peut ne pas avoir de rôle ou de codeRegion
      // Ce qui n'est pas effectivement le cas en production. Le rôle est requis.
      updateUser({
        ...defaultValues[0],
        role: defaultValues[0].role!,
      });
    }
  }, [isLoading, defaultValues]);

  return (
    <>
      {(!user || isLoading) && <Skeleton width="200px" height="24px" />}
      {user && !isLoading && (
        <AsyncSelect
          instanceId={"user-search-email"}
          styles={{
            control: (styles: CSSObjectWithLabel) => ({
              ...styles,
              width: "25rem",
              borderColor: undefined,
              zIndex: "2",
              overflow: "hidden",
            }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          components={{
            DropdownIndicator: () => (
              <HStack
                padding="8px"
                bgColor={themeDefinition.colors.bluefrance[113]}
                height="100%"
                justifyContent="center"
                cursor="pointer"
              >
                <Icon icon="ri:search-line" color="white" height="18px" width="18px"></Icon>
              </HStack>
            ),
            IndicatorSeparator: () => null,
            SingleValue,
          }}
          onChange={(selected) => selected && updateUser((selected as OptionType).value)}
          defaultValue={{
            label: user.email,
            value: user,
          }}
          loadOptions={async (inputValue: string) => {
            if (inputValue.length >= 3) {
              const users = await client.ref("[GET]/user/search/:search").query({
                params: { search: inputValue },
              });

              return users.map((u) => ({
                label: u.email,
                value: { ...u, role: u.role! },
              }));
            }

            return [];
          }}
          loadingMessage={({ inputValue }) =>
            inputValue.length >= 3 ? "Recherche..." : "Veuillez rentrer au moins 3 lettres"
          }
          isClearable={true}
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "Pas d'utilisateur correspondant" : "Commencez à écrire..."
          }
          placeholder="Email de l'utilisateur"
          isMulti={false}
        />
      )}
    </>
  );
};

export { UserSearchBar };
