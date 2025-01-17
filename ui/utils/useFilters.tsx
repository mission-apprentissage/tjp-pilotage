import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";

import { createParameterizedUrl } from "./createParameterizedUrl";

export function useStateParams<F extends object>({
  defaultValues,
  prefix,
}: {
  defaultValues: F;
  prefix?: string;
}): [F, (f: SetStateAction<F>) => void] {
  const queryParams = useSearchParams();
  const router = useRouter();
  const params = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
  const prefixed = (prefix ? params[prefix] : params) as F;
  const [filters, setFilters] = useState<F>({ ...defaultValues, ...prefixed });

  useEffect(() => {
    router.replace(
      createParameterizedUrl(location.pathname, prefix ? { ...params, [prefix]: filters } : { ...params, ...filters }),
      { scroll: false }
    );
  }, [filters]);

  return [filters, setFilters];
}
