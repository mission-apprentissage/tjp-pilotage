import { Static, TSchema } from "@sinclair/typebox";
import { AxiosInstance, AxiosRequestConfig } from "axios";

import { ROUTES_CONFIG } from "./ROUTES_CONFIG";

export type ParamsFromSchema<S> = S extends {
  params: TSchema;
}
  ? Static<S["params"]>
  : undefined;

export type Params<S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]> =
  ParamsFromSchema<S>;

export type QueryFromSchema<S> = S extends {
  querystring: TSchema;
}
  ? Static<S["querystring"]>
  : undefined;
export type Query<S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]> =
  QueryFromSchema<S>;

export type BodyFromSchema<S> = S extends {
  body: TSchema;
}
  ? Static<S["body"]>
  : undefined;

export type Body<S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]> =
  BodyFromSchema<S>;

export type Args<S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]> =
  Record<string, unknown> &
    (Body<S> extends undefined ? { body?: undefined } : { body: Body<S> }) &
    (Query<S> extends undefined ? { query?: undefined } : { query: Query<S> }) &
    (Params<S> extends undefined
      ? { params?: undefined }
      : { params: Params<S> });

export type ResponseFromSchema<S> = S extends {
  response: { 200: TSchema };
}
  ? Static<S["response"][200]>
  : undefined;

export type Response<
  S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]
> = ResponseFromSchema<S>;

export const callApi = async <
  S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]
>({
  config,
  method,
  url,
  instance,
  ...props
}: {
  method: AxiosRequestConfig["method"];
  url: string;
  config?: AxiosRequestConfig;
  instance: AxiosInstance;
} & Args<S>) => {
  const { data } = await instance.request({
    method,
    url,
    ...config,
    params: props.query,
    data: props.body,
  });
  return data as Response<S>;
};

export const createClientMethod =
  <S extends typeof ROUTES_CONFIG[keyof typeof ROUTES_CONFIG]>({
    method,
    url,
    instance,
  }: {
    method: AxiosRequestConfig["method"];
    url: string;
    instance: AxiosInstance;
  }) =>
  (args: Args<S>, config?: AxiosRequestConfig) => {
    return {
      call: () =>
        callApi<S>({
          method,
          url,
          config,
          instance,
          ...args,
        }),
      url: instance.getUri({
        method,
        url,
        params: args.query,
        data: args.body,
        ...config,
      }),
    };
  };

//@ts-ignore
export type ApiType<T extends (...args: any) => any> = Awaited<
  ReturnType<ReturnType<T>["call"]>
>;
