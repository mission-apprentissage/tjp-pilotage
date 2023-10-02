import {
  chakra,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { typeDemandesOptions } from "../../utils/typeDemandeUtils";

const motifLabels = {
  taux_insertion_satisfaisant: "Taux d’insertion satisfaisant",
  taux_poursuite_satisfaisant: "Taux de poursuite satisfaisant",
  taux_insertion_insatisfaisant: "Taux d’insertion insatisfaisant",
  taux_poursuite_insatisfaisant: "Taux de poursuite insatisfaisant",
  besoin_recrutement_local: "Besoins recrutements avérés localement",
  ouverture_plus_inserante: "Ouverture d’une formation plus insérante",
  repartition_autres_etablissements:
    "Répartition des élèves sur d’autres établissements",
  transfert_apprentissage: "Transfert vers l’apprentissage",
  recrutements_baisse: "Recrutements en baisse",
  capacite_trop_élevée_territoire: "Capacité trop élevée sur le territoire",
  locaux: "Locaux",
  cout_financier: "Coût financier",
  plateau_technique: "Plateau technique",
  metiers_2030: "Métiers 2030",
  projet_pedagogique_territorial: "Projet pédagogique territorial",
  maintien_specifique: "Maintien pour public spécifique",
  nouvel_etablissement: "Nouvel établissement",
  sauvegarde_metier_rare: "Sauvegarde métier rare",
  autre: "Autre motif (veuillez préciser)",
};

type MotifLabel = keyof typeof motifLabels;

const motifsOuverture: MotifLabel[] = [
  "taux_insertion_satisfaisant",
  "taux_poursuite_satisfaisant",
  "besoin_recrutement_local",
  "metiers_2030",
  "projet_pedagogique_territorial",
  "nouvel_etablissement",
  "maintien_specifique",
  "sauvegarde_metier_rare",
  "autre",
];

const motifsFermeture: MotifLabel[] = [
  "taux_insertion_insatisfaisant",
  "taux_poursuite_insatisfaisant",
  "ouverture_plus_inserante",
  "repartition_autres_etablissements",
  "transfert_apprentissage",
  "recrutements_baisse",
  "capacite_trop_élevée_territoire",
  "locaux",
  "cout_financier",
  "plateau_technique",
  "autre",
];

const motifs: Record<string, MotifLabel[]> = {
  ouverture_nette: motifsOuverture,
  ouverture_compensation: motifsOuverture,
  augmentation_nette: motifsOuverture,
  augmentation_compensation: motifsOuverture,
  fermeture: motifsFermeture,
  diminution: motifsFermeture,
};

const getMotifOptions = (typeDemande: keyof typeof motifs) => {
  return Object.entries(motifLabels)
    .filter(([key]) => motifs[typeDemande]?.includes(key as MotifLabel))
    .map(([value, label]) => ({
      value,
      label,
    }));
};

export const MotifField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("motif", []);
        }).unsubscribe
    );

    const [typeDemande] = watch(["typeDemande"]);
    if (!typeDemande) return <></>;

    return (
      <FormControl className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel>
          Merci de préciser le(s) motif(s) de votre{" "}
          {typeDemandesOptions[typeDemande].label.toLowerCase()}
        </FormLabel>
        <Controller
          name="motif"
          shouldUnregister
          disabled={disabled}
          control={control}
          rules={{ required: "Le motif est obligatoire" }}
          render={({
            field: { onChange, value, onBlur, ref, name, disabled },
          }) => {
            return (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]}>
                  {getMotifOptions(typeDemande as keyof typeof motifs)?.map(
                    ({ value, label }) => (
                      <Checkbox
                        ref={ref}
                        disabled={disabled}
                        name={name}
                        isRequired={false}
                        key={value}
                        onBlur={onBlur}
                        value={value}
                      >
                        {label}
                      </Checkbox>
                    )
                  )}
                </Stack>
              </CheckboxGroup>
            );
          }}
        />
        {errors.motif && (
          <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
