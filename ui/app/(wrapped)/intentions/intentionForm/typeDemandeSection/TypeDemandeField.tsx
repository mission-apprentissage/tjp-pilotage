import {
  Box,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  RadioGroup,
  SimpleGrid,
  Text,
  useToken,
} from "@chakra-ui/react";
import { ComponentProps, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

const typeDemandesOptions = [
  {
    value: "ouverture_nette",
    label: "Ouverture nette",
    desc: (
      <>
        Dans le cas d’une ouverture sans compensation (ex : fermeture ou
        diminution de place).
      </>
    ),
  },
  {
    value: "ouverture_compensation",
    label: "Ouverture avec compensation",
    desc: (
      <>
        Une Nouvelle demande (fermeture ou diminution) sera attendue une fois
        que vous aurez finalisé cette demande.
      </>
    ),
  },
  {
    value: "augmentation_nette",
    label: "Augmentation nette",
    desc: (
      <>
        Dans le cas d’une augmentation sans compensation (ex : fermeture ou
        diminution de place).
      </>
    ),
  },
  {
    value: "augmentation_compensation",
    label: "Augmentation par compensation",
    desc: (
      <>
        Une Nouvelle demande (fermeture ou diminution) sera attendue une fois
        que vous aurez finalisé cette demande.
      </>
    ),
  },
  {
    value: "fermeture",
    label: "Fermeture",
    desc: <>Avec ou sans compensation de capacité.</>,
  },
  {
    value: "diminution",
    label: "Diminution",
    desc: <>Avec ou sans compensation de capacité.</>,
  },
];

function RadioCard({
  title,
  desc,
  selected,
  ...props
}: {
  title: ReactNode;
  desc: ReactNode;
  selected: boolean;
} & ComponentProps<"div">) {
  const bf113 = useToken("colors", "bluefrance.113");

  return (
    <Box
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
      <Text mb="3" fontWeight="bold" fontSize="lg" color="bluefrance.113">
        {title}
      </Text>
      <Text fontSize="sm">{desc}</Text>
    </Box>
  );
}

export const TypeDemandeField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms[2]>();

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
              {typeDemandesOptions.map((item) => (
                <RadioCard
                  selected={value === item.value}
                  key={item.value}
                  title={item.label}
                  desc={item.desc}
                  onClick={() => onChange(item.value)}
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
