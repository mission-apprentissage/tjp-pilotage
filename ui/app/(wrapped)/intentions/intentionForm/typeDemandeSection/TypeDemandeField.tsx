import {
  Box,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  RadioGroup,
  SimpleGrid,
  Tag,
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
        Utiliser ce formulaire pour tout cas de création d'une formation sans
        fermeture ou diminution de capacité.
      </>
    ),
    tag: <>Objectif de la réforme : +15%</>,
  },
  {
    value: "ouverture_compensation",
    label: "Ouverture avec compensation",
    desc: (
      <>
        Utiliser ce formulaire pour tout cas de transfert de capacité d'une
        formation vers une autres (voir exemple ci-contre).
      </>
    ),
  },
  {
    value: "augmentation_nette",
    label: "Augmentation nette",
    desc: (
      <>
        Utiliser ce formulaire pour toute augmentation de capacité d'accueil sur
        une formation existant. Ne pas utiliser pour des places déjà ouvertes
        sur l'établissement
      </>
    ),
  },
  {
    value: "augmentation_compensation",
    label: "Augmentation par compensation",
    desc: (
      <>
        Utiliser ce formulaire pour tout cas d'augmentation de capacité sur une
        formation déjà ouverte et en lien avec une fermeture ou diminution de
        capacité.
      </>
    ),
  },
  {
    value: "fermeture",
    label: "Fermeture",
    desc: (
      <>
        Utiliser ce formulaire pour renseigner les places fermées en
        compoensation d'une ouverture ou pour les fermetures nettes.
      </>
    ),
  },
  {
    value: "diminution",
    label: "Diminution",
    desc: (
      <>
        Utiliser ce formulaire pour renseigner les places fermées en
        compensation d'une ouverture, ou pour les diminutions netttes.
      </>
    ),
  },
];

function RadioCard({
  title,
  desc,
  tag,
  selected,
  ...props
}: {
  title: ReactNode;
  desc: ReactNode;
  tag: ReactNode;
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
      <Text mb="3" fontWeight="bold" fontSize="lg" color="bluefrance.113">
        {title}
      </Text>
      <Text fontSize="12px" mb="auto">
        {desc}
      </Text>
      {tag && (
        <Tag size="sm" colorScheme="green" mt="3" ml="auto">
          {tag}
        </Tag>
      )}
    </Box>
  );
}

export const TypeDemandeField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();

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
                  tag={item.tag}
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
