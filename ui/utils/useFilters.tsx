import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";

import { createParametrizedUrl } from "./createParametrizedUrl";

export function useStateParams<F>({ defaultValues }: { defaultValues: F }) {
  const queryParams = useSearchParams();
  const router = useRouter();
  const params = qs.parse(queryParams.toString());
  const [filters, setFilters] = useState<F>({ ...defaultValues, ...params });

  return {
    setFilters: (filters: F) => {
      setFilters({ ...params, ...filters });
      router.replace(
        createParametrizedUrl(location.pathname, { ...params, ...filters }),
        { scroll: false }
      );
    },
    filters,
  };
}
