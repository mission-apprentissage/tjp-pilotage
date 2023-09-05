import { FormControl, FormLabel } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, {
  CSSObjectWithLabel,
  InputActionMeta,
  SingleValue,
} from "react-select";
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
  const [searchDiplomeInput, setSearchDiplomeInput] = useState<string>("");
  const {
    formState: { errors },
    trigger,
    getValues,
    setValue,
    control,
  } = useFormContext<IntentionForms["2"]>();

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

  useEffect(() => {
    if (!cfdInfo) return;
    trigger("searchDiplome");
  }, [cfdInfo]);

  useEffect(() => {
    if (!getValues("searchDiplome")) return;
    setSearchDiplomeInput(getValues("searchDiplome") ?? "");
    fetchStatus();
  }, []);

  const handleInputChange = (inputText: string, meta: InputActionMeta) => {
    if (meta.action !== "input-blur" && meta.action !== "menu-close") {
      setSearchDiplomeInput(inputText);
    }
  };

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
            <Select
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
              options={diplomeOptions}
              filterOption={null}
              onInputChange={handleInputChange}
              isLoading={isDiplomeOptionsLoading}
              loadingMessage={() => "Recherche..."}
              isClearable={false}
              noOptionsMessage={() => "Pas de diplôme correspondant"}
              placeholder="Code diplôme, libellé"
              autoFocus={false}
            />
          )}
        />
      </FormControl>
    </>
  );
};
