import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const AugmentationCapaciteAccueilRestaurationPlacesField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("augmentationCapaciteAccueilRestauration");
    if (!visible) return null;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.augmentationCapaciteAccueilRestaurationPlaces}
      >
        <FormLabel>Combien de places ?</FormLabel>
        <Controller
          name="augmentationCapaciteAccueilRestaurationPlaces"
          shouldUnregister
          control={control}
          rules={{
            required: "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => (
            <NumberInput
              flex={1}
              isReadOnly={disabled}
              onChange={onChange}
              ref={ref}
              name={name}
              isRequired={false}
              key={name}
              onBlur={onBlur}
              value={value}
              min={0}
              defaultValue={0}
              size={"md"}
              w={56}
              bgColor={"white"}
              focusInputOnChange={false}
            >
              <NumberInputField
                textAlign={"end"}
                fontSize={"16px"}
                fontWeight={700}
                borderWidth={"1px"}
                borderColor={"gray.200"}
                borderRadius={4}
                _readOnly={{
                  opacity: "0.5",
                  cursor: "not-allowed",
                }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  opacity={disabled ? "0.3" : "1"}
                  cursor={disabled ? "not-allowed" : "pointer"}
                />
                <NumberDecrementStepper
                  opacity={disabled ? "0.3" : "1"}
                  cursor={disabled ? "not-allowed" : "pointer"}
                  _disabled={{
                    opacity: "0.3",
                    cursor: "not-allowed",
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        {errors.augmentationCapaciteAccueilRestaurationPlaces && (
          <FormErrorMessage>
            {errors.augmentationCapaciteAccueilRestaurationPlaces.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);

export const CommentaireField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.commentaire}>
        <FormLabel>Commentaires / Observations sur la demande</FormLabel>
        <Textarea
          variant="grey"
          height={150}
          {...register("commentaire", { shouldUnregister: true, disabled })}
        />
        {errors.commentaire && (
          <FormErrorMessage>{errors.commentaire.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
