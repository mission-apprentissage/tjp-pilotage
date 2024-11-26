import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";
import { Loading } from "@/components/Loading";

import { LiensUtiles } from "./components/LiensUtiles";

export const LiensUtilesSection = () => {
  const { analyseDetaillee } = useEtablissementContext();

  if (!analyseDetaillee) {
    return <Loading my={16} size="xl" />;
  }

  return <LiensUtiles analyseDetaillee={analyseDetaillee} />;
};
