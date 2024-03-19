import { feature } from "../../../../../utils/feature";
import { EtablissementPage as EtablissementPageV1 } from "./etablissementV1";
import { EtablissementPage as EtablissementPageV2 } from "./etablissementV2";

export default function PanoramaEtablissement({
  params,
}: {
  params: { uai: string };
}) {
  if (feature.etablissement) {
    return <EtablissementPageV2 params={params} />;
  }

  return <EtablissementPageV1 params={params} />;
}
