import { useToast } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { DneSSOInfoType } from "shared/enum/dneSSOInfoEnum";

import { INFO_MESSAGES } from "@/app/(wrapped)/auth/login/const";

const SSOInfo = () => {
  const searchParams = useSearchParams();
  const ssoSearchParam = searchParams.get('sso');
  const ssoInfos = ssoSearchParam?.split(',') as Array<DneSSOInfoType> ?? [];
  const toast = useToast();


  useEffect(() => {
    ssoInfos.forEach((message) => {
      const { title, message: description } = INFO_MESSAGES[message] ?? {};

      if (!title && !description) {
        return;
      }

      toast({
        variant: "left-accent",
        status: "success",
        title,
        description
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default SSOInfo;
