import {
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { TooltipIcon } from "../../../../../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../../../../../glossaire/glossaireContext";
import { isTypeColoration } from "../../../../../utils/typeDemandeUtils";
import { toBoolean } from "../../../utils/toBoolean";
import { IntentionForms } from "../../defaultFormValues";

export const ColorationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      setValue,
      getValues,
    } = useFormContext<IntentionForms>();

    const { openGlossaire } = useGlossaireContext();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (
            name === "typeDemande" &&
            isTypeColoration(getValues("typeDemande"))
          )
            setValue("coloration", true);
          if (name === "libelleFCIL")
            setValue("coloration", !getValues("libelleFCIL"));
        }).unsubscribe
    );

    useEffect(() => {
      if (getValues("libelleFCIL")) setValue("coloration", false);
    }, []);

    const libelleFCIL = watch("libelleFCIL");
    const isColorationDisabled = !!libelleFCIL || disabled;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.coloration}
        isRequired
      >
        <Flex direction={"row"}>
          <FormLabel>Coloration</FormLabel>
          <TooltipIcon
            mt={"1"}
            ml={2}
            onClick={(e) => {
              e.preventDefault();
              openGlossaire("coloration");
            }}
            color={"bluefrance.113"}
          />
        </Flex>
        <Controller
          name="coloration"
          control={control}
          disabled={disabled}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({
            field: { onChange, ref, name, onBlur, value, disabled },
          }) => (
            <RadioGroup
              ms={6}
              as={Stack}
              name={name}
              onBlur={onBlur}
              onChange={(v) => onChange(toBoolean(v))}
              value={JSON.stringify(value)}
              isDisabled={disabled}
            >
              <Radio
                ref={ref}
                value="true"
                isReadOnly={
                  isTypeColoration(getValues("typeDemande")) ||
                  isColorationDisabled
                }
                _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                Oui
              </Radio>
              <Radio
                ref={ref}
                value="false"
                isReadOnly={
                  isTypeColoration(getValues("typeDemande")) ||
                  isColorationDisabled
                }
                _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                Non
              </Radio>
            </RadioGroup>
          )}
        />
        {errors.coloration && (
          <FormErrorMessage>{errors.coloration.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
