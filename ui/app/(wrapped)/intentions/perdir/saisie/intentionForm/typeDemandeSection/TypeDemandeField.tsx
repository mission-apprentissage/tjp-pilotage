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
import type { ComponentProps, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";
import {
  isTypeColoration,
  isTypeDiminution,
  isTypeFermeture,
} from "shared/utils/typeDemandeUtils";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import {shouldDisplayColoration, shouldDisplayTypeDemande, TYPES_DEMANDES_OPTIONS} from '@/app/(wrapped)/intentions/utils/typeDemandeUtils';
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { useAuth } from "@/utils/security/useAuth";

function RadioCard({
  value,
  title,
  desc,
  selected,
  disabled,
  invalid,
  tooltip,
  ...props
}: {
  value: string;
  title: ReactNode;
  desc: ReactNode;
  selected: boolean;
  disabled: boolean;
  invalid: boolean;
  tooltip: ReactNode;
} & ComponentProps<"div">) {
  const { user } = useAuth();
  const bf113 = useToken("colors", "bluefrance.113");

  return (
    <Box
      display="flex"
      flexDirection="column"
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
      {...props}
    >
      <Flex mb="3">
        <Img
          me={2}
          display={["none", null, "unset"]}
          height={"20px"}
          src={`/icons/${value}.svg`}
          alt={`Icône ${title}`}
        />
        <Text fontWeight="bold" fontSize="lg" color="bluefrance.113" lineHeight={"20px"}>
          {title}
        </Text>
        {tooltip}
      </Flex>
      <Text fontSize={12} mb="auto">
        {desc}
      </Text>
    </Box>
  );
}

export const TypeDemandeField = chakra(
  ({ campagne, disabled = false, className }: { campagne: CampagneType, disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      getValues,
      watch,
    } = useFormContext<IntentionForms>();
    const queryParams = useSearchParams();
    const compensation = queryParams.get("compensation");
    const libelleFCIL = getValues("libelleFCIL");
    const rentreeScolaire = watch("rentreeScolaire");

    return (
      <FormControl as="fieldset" className={className} isInvalid={!!errors.typeDemande} isRequired>
        <FormLabel as="legend" mb="4">Ma demande concerne</FormLabel>
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
              {Object.values(TYPES_DEMANDES_OPTIONS).filter((typeDemande) =>
                shouldDisplayTypeDemande(typeDemande.value, campagne.annee, rentreeScolaire) &&
                shouldDisplayColoration(typeDemande.value, libelleFCIL)
              ).map(
                (item) =>
                  (
                    <RadioCard
                      selected={value === item.value}
                      key={item.value}
                      value={item.value}
                      title={item.label}
                      desc={item.desc}
                      disabled={
                        disabled ||
                        (compensation != null && !isTypeFermeture(item.value) && !isTypeDiminution(item.value))
                      }
                      invalid={!!errors.typeDemande}
                      onClick={() => onChange(item.value)}
                      tooltip={
                        isTypeColoration(item.value) && (
                          <GlossaireShortcut
                            marginLeft={1}
                            glossaireEntryKey={"coloration"}
                            color="bluefrance.113"
                            tooltip={
                              <Box>
                                <Text>
                                  Une coloration consiste à adapter le projet pédagogique à un champ professionnel
                                  particulier, en général concentré sur un territoire donné.
                                </Text>
                                <Text>Cliquez pour plus d'infos.</Text>
                              </Box>
                            }
                          />
                        )
                      }
                    />
                  )
              )}
            </RadioGroup>
          )}
        ></Controller>
        {errors.typeDemande && <FormErrorMessage>{errors.typeDemande.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
