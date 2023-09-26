import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Img,
  RadioGroup,
  SimpleGrid,
  Text,
  useToken,
} from "@chakra-ui/react";
import { ComponentProps, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import {
  isTypeCompensation,
  typeDemandesOptions,
} from "../../utils/typeDemandeUtils";

function RadioCard({
  value,
  title,
  desc,
  selected,
  ...props
}: {
  value: string;
  title: ReactNode;
  desc: ReactNode;
  selected: boolean;
} & ComponentProps<"div">) {
  const bf113 = useToken("colors", "bluefrance.113");

  return (
    <Box
      display="flex"
      flexDirection="column"
      {...props}
      flex={1}
      cursor="pointer"
      borderWidth="1px"
      aria-checked={selected}
      _checked={{
        bg: "#E2E7F8",
        borderColor: "bluefrance.113",
        boxShadow: `0 0 0 2px ${bf113}`,
      }}
      p={4}
    >
      <Flex mb="3">
        <Img height={"20px"} src={`/icons/${value}.svg`} />
        <Text
          ms={2}
          fontWeight="bold"
          fontSize="lg"
          color="bluefrance.113"
          lineHeight={"20px"}
        >
          {title}
        </Text>
      </Flex>
      <Text fontSize="12px" mb="auto">
        {desc}
      </Text>
    </Box>
  );
}

export const TypeDemandeField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      control,
      resetField,
    } = useFormContext<IntentionForms>();

    const resetCapaciteFields = (typeDemande: string) => {
      resetField("capaciteScolaireActuelle", { defaultValue: 0 });
      resetField("capaciteApprentissageActuelle", { defaultValue: 0 });
      resetField("capaciteScolaire", { defaultValue: 0 });
      resetField("capaciteApprentissage", { defaultValue: 0 });
      resetField("capaciteScolaireColoree", { defaultValue: 0 });
      resetField("capaciteApprentissageColoree", { defaultValue: 0 });
      if (!isTypeCompensation(typeDemande)) {
        resetField("compensationCfd", { defaultValue: undefined });
        resetField("compensationDispositifId", { defaultValue: undefined });
        resetField("compensationUai", { defaultValue: undefined });
      }
    };

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.typeDemande}
        isRequired
      >
        <FormLabel mb="4">Ma demande concerne</FormLabel>
        <Controller
          name="typeDemande"
          control={control}
          render={({ field: { onChange, ref, name, onBlur, value } }) => (
            <RadioGroup
              as={SimpleGrid}
              columns={3}
              spacing={4}
              ref={ref}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            >
              {Object.entries(typeDemandesOptions).map(([_key, item]) => (
                <RadioCard
                  selected={value === item.value}
                  key={item.value}
                  value={item.value}
                  title={item.label}
                  desc={item.desc}
                  onClick={() => {
                    resetCapaciteFields(item.value);
                    return onChange(item.value);
                  }}
                />
              ))}
            </RadioGroup>
          )}
        ></Controller>
        {errors.typeDemande && (
          <FormErrorMessage>{errors.typeDemande.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
