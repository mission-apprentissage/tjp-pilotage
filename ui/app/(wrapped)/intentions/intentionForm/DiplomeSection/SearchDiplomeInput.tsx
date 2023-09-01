import { FormControl, FormLabel } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CSSObjectWithLabel, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms } from "../defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const SearchDiplomeInput = ({
  onCfdInfoChange,
  cfdInfo,
}: {
  onCfdInfoChange: (info?: ApiType<typeof api.checkCfd>) => void;
  cfdInfo?: ApiType<typeof api.checkCfd>;
}) => {
  const {
    formState: { errors },
    trigger,
    getValues,
    setValue,
    control,
  } = useFormContext<IntentionForms["2"]>();

  useEffect(() => {
    if (!cfdInfo) return;
    trigger("searchDiplome");
  }, [cfdInfo]);

  const fetchStatus = async () => {
    const currentCfd = getValues("searchDiplome");
    console.log(currentCfd);
    if (!currentCfd) return;
    const res = await api.checkCfd({ params: { cfd: currentCfd } }).call();
    if (res.status === "valid") {
      setValue("libelleDiplome", res.data.libelle ?? "");
    }
    onCfdInfoChange(res);
  };

  const [searchDiplomeInput, setSearchDiplomeInput] = useState<string>("");

  type Option = { readonly value: string; readonly label: string };
  type Options = readonly Option[];

  const { data: diplomeOptions, isLoading: isDiplomeOptionsLoading } = useQuery(
    {
      keepPreviousData: false,
      staleTime: 1000,
      queryKey: ["searchDiplome", searchDiplomeInput],
      enabled: searchDiplomeInput.length >= 3,
      queryFn: api.searchDiplome({ params: { search: searchDiplomeInput } })
        .call,
    }
  );

  const loadOptions = (
    inputValue: string,
    callback: (options: Options) => void
  ) => {
    setSearchDiplomeInput(inputValue);
    setTimeout(() => {
      if (diplomeOptions) callback(diplomeOptions);
    }, 1000);
  };

  const colourStyles = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      backgroundColor: "white",
    }),
    option: (styles: CSSObjectWithLabel) => {
      return {
        ...styles,
        color: "#000",
      };
    },
  };

  return (
    <>
      <FormControl
        mb="4"
        maxW="500px"
        isInvalid={!!errors.searchDiplome?.message}
        isRequired
        flex="1"
      >
        <FormLabel>Recherche d'un diplôme</FormLabel>
        <Controller
          name="searchDiplome"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <AsyncSelect
              name={name}
              styles={colourStyles}
              onChange={(
                selectedUai: SingleValue<{ label: string; value: string }>
              ) => {
                if (selectedUai) {
                  onChange(selectedUai.value);
                  fetchStatus();
                }
              }}
              value={diplomeOptions?.find((uai) => uai.value === value)}
              loadOptions={loadOptions}
              isLoading={isDiplomeOptionsLoading}
              loadingMessage={() => "Recherche..."}
              isClearable={false}
              noOptionsMessage={() => "Pas de diplôme correspondant"}
              placeholder="Code diplôme, libellé"
            />
          )}
        />
      </FormControl>
    </>
  );
};
