import { Loading } from "../../../../../../components/Loading";
import { useEtablissementContext } from "../../context/etablissementContext";
import { LiensUtiles } from "./components/LiensUtiles";

export const LiensUtilesSection = () => {
  const { analyseDetaillee } = useEtablissementContext();

  if (!analyseDetaillee) {
    return <Loading my={16} size="xl" />;
  }

  return <LiensUtiles analyseDetaillee={analyseDetaillee} />;
};
