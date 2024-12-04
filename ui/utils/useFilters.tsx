import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";

import { createParametrizedUrl } from "./createParametrizedUrl";

export function useStateParams<F extends object>({
  defaultValues,
  prefix,
}: {
  defaultValues: F;
  prefix?: string;
}): [F, (filters: F) => void] {
  const queryParams = useSearchParams();
  const router = useRouter();
  const params = qs.parse(queryParams.toString());
  const prefixed = (prefix ? params[prefix] : params) as F;
  const [filters, setFilters] = useState<F>({ ...defaultValues, ...prefixed });

  return [
    filters,
    (filters: F) => {
      const mergedFilters = { ...prefixed, ...filters };
      console.log({ prefixed, filters, mergedFilters });
      setFilters(mergedFilters);
      router.replace(
        createParametrizedUrl(
          location.pathname,
          prefix ? { ...params, [prefix]: mergedFilters } : { ...params, ...mergedFilters }
        ),
        { scroll: false }
      );
    },
  ];
}
