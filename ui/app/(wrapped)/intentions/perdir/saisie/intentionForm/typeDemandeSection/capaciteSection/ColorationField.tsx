import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { toBoolean } from "@/utils/toBoolean";

export const ColorationField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name === "typeDemande" && isTypeColoration(getValues("typeDemande"))) setValue("coloration", true);
        if (name === "libelleFCIL") setValue("coloration", !getValues("libelleFCIL"));
      }).unsubscribe
  );

  useEffect(() => {
    if (getValues("libelleFCIL")) setValue("coloration", false);
  }, []);

  const libelleFCIL = watch("libelleFCIL");
  const isColorationDisabled = !!libelleFCIL || disabled;

  return (
    <FormControl className={className} isInvalid={!!errors.coloration} isRequired>
      <Flex direction={"row"}>
        <FormLabel>Coloration</FormLabel>
        <GlossaireShortcut
          glossaireEntryKey={"coloration"}
          color="bluefrance.113"
          mb={"6px"}
          tooltip={
            <Box>
              <Text>
                Une coloration consiste à adapter le projet pédagogique à un champ professionnel particulier, en général
                concentré sur un territoire donné.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
        />
      </Flex>
      <Controller
        name="coloration"
        control={control}
        disabled={disabled}
        rules={{
          validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, ref, name, onBlur, value, disabled } }) => (
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
              isReadOnly={isTypeColoration(getValues("typeDemande")) || isColorationDisabled}
              _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
            >
              Oui
            </Radio>
            <Radio
              ref={ref}
              value="false"
              isReadOnly={isTypeColoration(getValues("typeDemande")) || isColorationDisabled}
              _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
            >
              Non
            </Radio>
          </RadioGroup>
        )}
      />
      {errors.coloration && <FormErrorMessage>{errors.coloration.message}</FormErrorMessage>}
    </FormControl>
  );
});
