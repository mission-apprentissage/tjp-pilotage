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
import { useSearchParams } from "next/navigation";
import { ComponentProps, ReactNode, useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import {
  isTypeDiminution,
  isTypeFermeture,
  shouldDisplayColoration,
  shouldDisplayTypeDemande,
  TYPES_DEMANDES_OPTIONS,
} from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";
import { CampagneContext } from "../IntentionForm";

function RadioCard({
  value,
  title,
  desc,
  selected,
  disabled,
  invalid,
  ...props
}: {
  value: string;
  title: ReactNode;
  desc: ReactNode;
  selected: boolean;
  disabled: boolean;
  invalid: boolean;
} & ComponentProps<"div">) {
  const bf113 = useToken("colors", "bluefrance.113");

  return (
    <Box
      display="flex"
      flexDirection="column"
      {...props}
      onClick={!disabled ? props.onClick : undefined}
      flex={1}
      cursor={disabled ? "not-allowed" : "pointer"}
      borderWidth="1px"
      aria-checked={selected}
      _checked={{
        bg: "blueecume.925",
        boxShadow: `0 0 0 2px ${bf113}`,
      }}
      borderColor={invalid ? "red" : "inherit"}
      p={4}
      opacity={disabled ? "0.5" : "1"}
    >
      <Flex mb="3">
        <Img
          me={2}
          display={["none", null, "unset"]}
          height={"20px"}
          src={`/icons/${value}.svg`}
        />
        <Text
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

// const getTypeDemandeOptions = ({
//   annee,
//   hasFCIL,
// }: {
//   annee?: string;
//   hasFCIL: boolean;
// }) => {
//   return Object.values(TYPES_DEMANDES_OPTIONS).filter(
//     (item) =>
//       shouldDisplayTypeDemande(item.value, annee ?? CURRENT_ANNEE_CAMPAGNE) &&
//       shouldDisplayColoration(item.value, hasFCIL)
//   );
// };

export const TypeDemandeField = chakra(
  ({
    disabled = false,
    className,
  }: {
    disabled?: boolean;
    className?: string;
  }) => {
    const {
      formState: { errors },
      control,
      getValues,
    } = useFormContext<IntentionForms>();
    const queryParams = useSearchParams();
    const compensation = queryParams.get("compensation");
    const libelleFCIL = getValues("libelleFCIL");

    const { campagne } = useContext(CampagneContext);

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
              columns={[2, null, 3]}
              spacing={4}
              ref={ref}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            >
              {Object.values(TYPES_DEMANDES_OPTIONS).map(
                (item) =>
                  shouldDisplayTypeDemande(
                    item.value,
                    campagne?.annee ?? CURRENT_ANNEE_CAMPAGNE
                  ) &&
                  shouldDisplayColoration(item.value, libelleFCIL) && (
                    <RadioCard
                      selected={value === item.value}
                      key={item.value}
                      value={item.value}
                      title={item.label}
                      desc={item.desc}
                      disabled={
                        disabled ||
                        (compensation != null &&
                          !isTypeFermeture(item.value) &&
                          !isTypeDiminution(item.value))
                      }
                      invalid={!!errors.typeDemande}
                      onClick={() => onChange(item.value)}
                    />
                  )
              )}
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
