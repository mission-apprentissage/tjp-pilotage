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

import { typeDemandesOptions } from "../../utils/typeDemandeUtils";

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
          rules={{ required: "Le type de demande est obligatoire." }}
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
              {Object.values(typeDemandesOptions).map((item) => (
                <RadioCard
                  selected={value === item.value}
                  key={item.value}
                  value={item.value}
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
