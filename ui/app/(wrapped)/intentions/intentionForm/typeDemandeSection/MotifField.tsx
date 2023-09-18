import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

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
  parcours_pedagogique: "Parcours pédagogique",
  projet_pedagogique_territorial: "Projet pédagogique territorial",
  maintien_specifique: "Maintien pour public spécifique",
  fermeture_compensation: "Fermeture en compensation",
  nouvel_etablissement: "Nouvel établissement",
  perspective_ami: "Perspective AMI",
  sauvegarde_metier_rare: "Sauvegarde métier rare",
  etablissement_prive_sous_contrat: "Établissement privé sous contrat",
  autre: "Autre motif (veuillez préciser)",
};

type MotifLabel = keyof typeof motifLabels;

const motifsOuverture: MotifLabel[] = [
  "taux_insertion_satisfaisant",
  "taux_poursuite_satisfaisant",
  "parcours_pedagogique",
  "besoin_recrutement_local",
  "metiers_2030",
  "projet_pedagogique_territorial",
  "fermeture_compensation",
  "etablissement_prive_sous_contrat",
  "nouvel_etablissement",
  "perspective_ami",
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

export const MotifField = () => {
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<IntentionForms[2]>();

  const [typeDemande] = watch(["typeDemande"]);

  if (!typeDemande) return <></>;

  return (
    <FormControl mb="6" isInvalid={!!errors.motif} isRequired maxW="500px">
      <FormLabel>Merci de préciser le(s) motif(s)</FormLabel>
      <Controller
        name="motif"
        shouldUnregister
        control={control}
        rules={{ required: "Le motif est obligatoire" }}
        render={({ field: { onChange, value, onBlur } }) => (
          <CheckboxGroup onChange={onChange} value={value}>
            <Stack spacing={[3]}>
              {getMotifOptions(typeDemande as keyof typeof motifs)?.map(
                ({ value, label }) => (
                  <Checkbox
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
        )}
      />
      {errors.motif && (
        <FormErrorMessage>{errors.motif?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
