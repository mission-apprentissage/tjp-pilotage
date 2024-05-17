import { Badge, HStack, Skeleton, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { components, CSSObjectWithLabel, SingleValueProps } from "react-select";
import AsyncSelect from "react-select/async";

import { client } from "../../../../../api.client";
import { useAuth } from "../../../../../utils/security/useAuth";
import { ROLES_LABELS } from "../const";

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
            }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            SingleValue,
          }}
          onChange={(selected) =>
            selected && updateUser((selected as OptionType).value)
          }
          defaultValue={{
            label: user.email,
            value: user,
          }}
          loadOptions={(inputValue: string) => {
            if (inputValue.length >= 3) {
              const d = client.ref("[GET]/user/search/:search").query({
                params: { search: inputValue },
              }) as Promise<QueryResult>;
              return d.then((users) =>
                users.map((u) => ({
                  label: u.email,
                  value: { ...u, role: u.role! },
                }))
              );
            }
          }}
          loadingMessage={({ inputValue }) =>
            inputValue.length >= 3
              ? "Recherche..."
              : "Veuillez rentrer au moins 3 lettres"
          }
          isClearable={true}
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? "Pas d'établissement correspondant"
              : "Commencez à écrire..."
          }
          placeholder="Email de l'utilisateur"
          isMulti={false}
        />
      )}
    </>
  );
};

export { UserSearchBar };
