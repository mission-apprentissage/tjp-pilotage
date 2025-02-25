import type {
  FetchQueryOptions,
  QueryClient,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult} from '@tanstack/react-query';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type {
  Args,
  Client,
  OkResponse,
  Ref,
  RouteDefinition,
  TypeProvider} from 'shared/utils/http-wizard/core';
import {
  createClient
} from 'shared/utils/http-wizard/core';

export type ClientWithReactQuery<
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider,
> = Omit<Client<Definitions, TP>, 'ref'> & {
  ref: <URL extends keyof Definitions & string>(
    url: URL
  ) => Ref<Definitions, URL, TP> & {
    useQuery: (
      args: Args<Definitions[URL]['schema'], TP>,
      options?: Omit<
        UseQueryOptions<
          OkResponse<Definitions[URL], TP>,
          Error,
          OkResponse<Definitions[URL], TP>,
          QueryKey
        >,
        'queryKey' | 'queryFn' | 'refetchInterval'
      >,
      config?: AxiosRequestConfig
    ) => UseQueryResult<OkResponse<Definitions[URL], TP>>;
    useInfiniteQuery: (
      args: Args<Definitions[URL]['schema'], TP>,
      options: Omit<
        UseInfiniteQueryOptions<OkResponse<Definitions[URL], TP>>,
        'queryKey' | 'queryFn'
      >,
      config?: AxiosRequestConfig
    ) => UseInfiniteQueryResult<OkResponse<Definitions[URL], TP>>;
    useMutation: (
      options?: UseMutationOptions<
        OkResponse<Definitions[URL], TP>,
        Error,
        Args<Definitions[URL]['schema'], TP>
      >,
      config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
    ) => UseMutationResult<
      OkResponse<Definitions[URL], TP>,
      Error,
      Args<Definitions[URL]['schema'], TP>
    >;
    prefetchQuery: (
      args: Args<Definitions[URL]['schema'], TP>,
      options?: Omit<
        FetchQueryOptions<OkResponse<Definitions[URL], TP>>,
        'queryKey' | 'queryFn'
      >,
      config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
    ) => Promise<void>;
  };
};

export const createQueryClient = <
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider,
>({
    queryClient: optionQueryClient,
    ...options
  }: Parameters<typeof createClient>[0] & {
  queryClient?: QueryClient;
}): ClientWithReactQuery<Definitions, TP> => {
  const client: Client<Definitions, TP> = createClient<Definitions, TP>(
    options
  );
  return {
    ...client,
    ref: <URL extends keyof Definitions & string>(url: URL) => {
      const routeRef = client.ref<URL>(url);
      return {
        useQuery: (
          args: Args<Definitions[URL]['schema'], TP>,
          options?: Omit<
            UseQueryOptions<
              OkResponse<Definitions[URL], TP>,
              Error,
              OkResponse<Definitions[URL], TP>,
              QueryKey
            >,
            'queryKey' | 'queryFn'
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
        ) =>
          useQuery([url, args],
            async () => routeRef.query(args, config),
            optionQueryClient ? Object.assign(optionQueryClient, options) : options
          ),
        useInfiniteQuery: (
          args: Args<Definitions[URL]['schema'], TP>,
          options: Omit<
            UseInfiniteQueryOptions<OkResponse<Definitions[URL], TP>>,
            'queryKey' | 'queryFn'
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
        ) =>
          useInfiniteQuery([url, args],
            async () => routeRef.query(args, config),
            optionQueryClient ? Object.assign(optionQueryClient, options) : options
          ),
        useMutation: (
          options?: UseMutationOptions<
            OkResponse<Definitions[URL], TP>,
            Error,
            Args<Definitions[URL]['schema'], TP>
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
        ) =>
          useMutation([url],
            async (args) => routeRef.query(args, config),
            optionQueryClient ? Object.assign(optionQueryClient, options) : options
          ),
        prefetchQuery: async (
          args: Args<Definitions[URL]['schema'], TP>,
          options?: Omit<
            FetchQueryOptions<OkResponse<Definitions[URL], TP>>,
            'queryKey' | 'queryFn'
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
        ) => {
          // Ce sera utilisé dans un hook
          /* eslint-disable-next-line react-hooks/rules-of-hooks */
          const queryClient = optionQueryClient ?? useQueryClient();
          return queryClient.prefetchQuery({
            queryKey: [url, args],
            queryFn: async () => routeRef.query(args, config),
            ...options,
          });
        },
        ...routeRef,
      };
    },
  };
};

createQueryClient({ instance: axios.create() });
