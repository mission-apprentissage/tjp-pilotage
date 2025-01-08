import { iframeResizer } from "iframe-resizer";
import { useRef } from "react";

import { client } from "@/api.client";

interface DashboardProps {
  domaineProfessionnel?: string;
  metier: string;
  dashboardId: number;
}

const Metabase = ({ domaineProfessionnel, metier, dashboardId }: DashboardProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data } = client.ref("[POST]/generate-metabase-dashboard-url").useQuery(
    {
      body: {
        dashboard: dashboardId,
        filters: {
          domaine_pro: domaineProfessionnel ?? null,
          metier,
        },
      },
    },
    { staleTime: 10000000, keepPreviousData: true },
  );

  const onIFrameLoad = () => {
    if (iframeRef?.current) {
      iframeResizer({ autoResize: true }, iframeRef?.current);
    }
  };

  if (!data?.url) {
    return <></>;
  }

  return <iframe ref={iframeRef} src={data?.url} width="100%" onLoad={onIFrameLoad} />;
};

export { Metabase };
